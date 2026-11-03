import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User as FirebaseUser,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Global type declarations for window recaptcha and confirmation result
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID (CRITICAL for AI Studio Firestore Enterprise)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard Operation Types for error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Successfully verified Firestore live connection!');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline or database initializing.');
      return false;
    }
    // Return true if connected even if test document is not found
    return true;
  }
}

// Real Google Sign-In with Firebase Auth
export async function signInWithGoogleFirebase() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: result.user,
    };
  } catch (error: any) {
    console.error('[Firebase Auth Error]', error);
    return {
      success: false,
      error: error.message || 'Google Sign-in failed',
    };
  }
}

// --- FIREBASE PHONE AUTH WITH RECAPTCHA VERIFIER ---

/**
 * Clean up existing reCAPTCHA instance to avoid "reCAPTCHA has already been rendered" errors.
 */
export function clearRecaptchaVerifier() {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      console.warn('[Firebase] Could not clear reCAPTCHA verifier:', e);
    }
    window.recaptchaVerifier = undefined;
  }
}

/**
 * Initializes and returns a Firebase RecaptchaVerifier for web.
 * Uses 'normal' or 'invisible' size based on preference.
 */
export function setupRecaptchaVerifier(containerId = 'recaptcha-container', size: 'normal' | 'invisible' = 'normal'): RecaptchaVerifier {
  clearRecaptchaVerifier();

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: size,
    callback: () => {
      console.log('[Firebase] reCAPTCHA challenge passed by user.');
    },
    'expired-callback': () => {
      console.warn('[Firebase] reCAPTCHA expired, user must retry.');
    },
  });

  window.recaptchaVerifier = verifier;
  return verifier;
}

/**
 * Triggers a real SMS OTP via Firebase signInWithPhoneNumber
 */
export async function sendFirebasePhoneOtp(
  phoneNumber: string,
  containerId = 'recaptcha-container'
): Promise<{ success: boolean; confirmationResult?: ConfirmationResult; message: string; isFirebaseError?: boolean }> {
  try {
    // Format to E.164 (+91 for 10-digit Indian numbers)
    let formattedPhone = phoneNumber.trim().replace(/\s+/g, '');
    if (!formattedPhone.startsWith('+')) {
      const digitsOnly = formattedPhone.replace(/\D/g, '');
      if (digitsOnly.length === 10) {
        formattedPhone = `+91${digitsOnly}`;
      } else {
        formattedPhone = `+${digitsOnly}`;
      }
    }

    if (formattedPhone.length < 11) {
      return {
        success: false,
        message: 'Please enter a valid 10-digit mobile number.',
      };
    }

    const appVerifier = setupRecaptchaVerifier(containerId, 'normal');
    await appVerifier.render();

    console.log(`[Firebase Phone Auth] Dispatching real SMS OTP to ${formattedPhone}...`);
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
    window.confirmationResult = confirmationResult;

    return {
      success: true,
      confirmationResult,
      message: `Real SMS OTP dispatched to ${formattedPhone}! Check your phone.`,
    };
  } catch (error: any) {
    console.error('[Firebase Phone Auth Error]', error);
    clearRecaptchaVerifier();

    let userMessage = error.message || 'Failed to dispatch SMS OTP';
    if (error.code === 'auth/invalid-phone-number') {
      userMessage = 'Invalid phone number format. Please check the digits and try again.';
    } else if (error.code === 'auth/too-many-requests') {
      userMessage = 'SMS request limit reached for this device. Please wait or use demo test profile.';
    } else if (error.code === 'auth/operation-not-allowed') {
      userMessage = 'Phone sign-in is not yet enabled in Firebase Console. Please enable Phone provider in Firebase Authentication.';
    } else if (error.code === 'auth/quota-exceeded') {
      userMessage = 'Firebase daily SMS quota exceeded for this project.';
    } else if (error.code === 'auth/captcha-check-failed') {
      userMessage = 'reCAPTCHA verification failed. Please try completing the reCAPTCHA challenge again.';
    }

    return {
      success: false,
      message: userMessage,
      isFirebaseError: true,
    };
  }
}

/**
 * Verifies the 6-digit SMS OTP against Firebase confirmationResult
 */
export async function verifyFirebasePhoneOtp(
  otpCode: string,
  confirmationResult?: ConfirmationResult
): Promise<{ success: boolean; user?: FirebaseUser; message: string }> {
  try {
    const confirmation = confirmationResult || window.confirmationResult;
    if (!confirmation) {
      return {
        success: false,
        message: 'No active OTP session. Please request a new SMS OTP.',
      };
    }

    const userCredential = await confirmation.confirm(otpCode.trim());
    return {
      success: true,
      user: userCredential.user,
      message: 'Mobile number verified successfully! Welcome to Zest Esports.',
    };
  } catch (error: any) {
    console.error('[Firebase Verify OTP Error]', error);
    let msg = error.message || 'Invalid or expired OTP.';
    if (error.code === 'auth/invalid-verification-code') {
      msg = 'Invalid 6-digit SMS code. Please recheck your SMS and try again.';
    } else if (error.code === 'auth/code-expired') {
      msg = 'This SMS code has expired. Please request a new OTP.';
    }
    return {
      success: false,
      message: msg,
    };
  }
}

export async function signOutFirebase() {
  try {
    await fbSignOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

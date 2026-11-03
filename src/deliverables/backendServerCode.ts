export const NODEJS_BACKEND_SERVER_TS = `// =========================================================================
// ZEST ESPORTS PLATFORM - BACKEND ENGINE & NODEMAILER DISPATCHER
// Framework: Node.js 20+ / Express / TypeScript
// Features: Atomic Concurrency Locks, Double-Spending Prevention,
//           Automated Nodemailer Google Play Delivery, FIFO Inventory Queue
// =========================================================================

import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { Pool, PoolClient } from 'pg'; // PostgreSQL Connection Pool
import crypto from 'crypto';

const app = express();
app.use(express.json());

// Initialize PostgreSQL Connection Pool with Isolation Levels
const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://zest_admin:secret@localhost:5432/zest_esports',
  max: 20,
  idleTimeoutMillis: 30000,
});

// Configure Nodemailer Gmail SMTP Transporter (SYSTEM_GMAIL & SYSTEM_APP_PASSWORD)
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SYSTEM_GMAIL || 'ajubaid.ik@gmail.com',
    pass: (process.env.SYSTEM_APP_PASSWORD || '').replace(/\s+/g, ''),
  },
});

// =========================================================================
// 1. ATOMIC WITHDRAWAL REQUEST API (DOUBLE-SPEND PREVENTION)
// Endpoint: POST /api/v1/wallet/withdraw
// =========================================================================
app.post('/api/v1/wallet/withdraw', async (req: Request, res: Response) => {
  const { userId, method, amount, upiId, targetGmail } = req.body;

  // Basic Input Validation
  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid withdrawal payload' });
  }

  if (method === 'upi') {
    const upiRegex = /^[\\w.-]+@[\\w.-]+$/;
    if (!upiId || !upiRegex.test(upiId.trim())) {
      return res.status(400).json({ success: false, message: 'Invalid UPI ID format' });
    }
  } else if (method === 'google_play_code') {
    const validDenominations = [10, 30, 80, 100, 250];
    if (!validDenominations.includes(amount)) {
      return res.status(400).json({ success: false, message: 'Invalid denomination. Allowed: 10, 30, 80, 100, 250' });
    }
    const email = (targetGmail || '').trim().toLowerCase();
    if (!email.endsWith('@gmail.com') || email.length < 11) {
      return res.status(400).json({ success: false, message: 'Redeem code requires a valid @gmail.com address' });
    }
  } else {
    return res.status(400).json({ success: false, message: 'Unsupported withdrawal method' });
  }

  const client: PoolClient = await dbPool.connect();

  try {
    // BEGIN SERIALIZABLE TRANSACTION (Strict Concurrency Lock)
    await client.query('BEGIN ISOLATION LEVEL SERIALIZABLE');

    // Acquire Exclusive Row-Level Lock on User Record (FOR UPDATE)
    const userQuery = await client.query(
      'SELECT id, winnings_balance, is_banned FROM users WHERE id = $1 FOR UPDATE',
      [userId]
    );

    if (userQuery.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = userQuery.rows[0];

    if (user.is_banned) {
      await client.query('ROLLBACK');
      return res.status(403).json({ success: false, message: 'Account is suspended due to fair-play violation' });
    }

    const availableWinnings = parseFloat(user.winnings_balance);
    if (availableWinnings < amount) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: \`Insufficient Winnings Cash! (Available: ₹\${availableWinnings}). Deposit Cash cannot be withdrawn.\`,
      });
    }

    // Deduct immediately into pending withdrawal (Atomic Lock)
    await client.query(
      'UPDATE users SET winnings_balance = winnings_balance - $1, updated_at = NOW() WHERE id = $2',
      [amount, userId]
    );

    const referenceId = \`REQ-\${method.toUpperCase().slice(0, 3)}-\${crypto.randomBytes(4).toString('hex').toUpperCase()}\`;

    // Insert immutable transaction ledger record
    await client.query(
      \`INSERT INTO transactions (id, user_id, type, amount, wallet_source, status, reference_id, description, metadata)
       VALUES (gen_random_uuid(), $1, 'withdrawal', $2, 'winnings', 'pending', $3, $4, $5)\`,
      [
        userId,
        amount,
        referenceId,
        method === 'upi' ? \`UPI Payout to \${upiId}\` : \`Google Play Code ₹\${amount}\`,
        JSON.stringify({ upiId, targetGmail, method }),
      ]
    );

    await client.query('COMMIT');

    return res.status(200).json({
      success: true,
      message: 'Withdrawal request registered successfully with atomic balance lock.',
      referenceId,
      remainingWinnings: availableWinnings - amount,
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Withdrawal Transaction Error:', error);
    return res.status(500).json({ success: false, message: 'Concurrency conflict or server error' });
  } finally {
    client.release();
  }
});

// =========================================================================
// 2. NODEMAILER GOOGLE PLAY REDEEM CODE DISPATCHER ENGINE
// Dispatches AAA-styled HTML email to player's Gmail upon admin/queue approval
// =========================================================================
export async function sendGooglePlayRedeemEmail(params: {
  toEmail: string;
  playerName: string;
  redeemCode: string;
  denomination: number;
  transactionRef: string;
}): Promise<{ success: boolean; messageId?: string }> {
  const { toEmail, playerName, redeemCode, denomination, transactionRef } = params;

  const htmlContent = \`
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { margin: 0; padding: 0; background-color: #090D16; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #E2E8F0; }
      .container { max-width: 600px; margin: 0 auto; background-color: #121824; border: 1px solid #1E293B; border-radius: 12px; overflow: hidden; }
      .header { background: linear-gradient(135deg, #FF5722 0%, #E64A19 100%); padding: 30px 20px; text-align: center; }
      .header h1 { margin: 0; color: #FFFFFF; font-size: 26px; letter-spacing: 2px; text-transform: uppercase; }
      .header p { margin: 5px 0 0; color: #FFE0B2; font-size: 14px; }
      .content { padding: 30px 25px; }
      .badge { display: inline-block; background: #00E676; color: #000000; font-weight: bold; font-size: 12px; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; margin-bottom: 15px; }
      .code-box { background: #171F2F; border: 2px dashed #00E5FF; border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0; }
      .code-label { color: #94A3B8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
      .redeem-code { color: #00E5FF; font-family: 'Courier New', Courier, monospace; font-size: 26px; font-weight: bold; letter-spacing: 4px; margin: 10px 0; }
      .amount-badge { color: #FF5722; font-size: 18px; font-weight: bold; }
      .instructions { background: #0B111E; border-radius: 8px; padding: 15px; font-size: 13px; color: #94A3B8; line-height: 1.6; }
      .instructions ol { margin: 0; padding-left: 20px; }
      .footer { padding: 20px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #1E293B; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>ZEST ESPORTS</h1>
        <p>Official Tournament Rewards Payout</p>
      </div>
      <div class="content">
        <span class="badge">Verified Payout</span>
        <h2 style="margin: 0 0 10px; color: #FFFFFF;">Congratulations, \${playerName}!</h2>
        <p style="color: #94A3B8; font-size: 14px; line-height: 1.5;">
          Your tournament winnings withdrawal request has been approved and processed. Your official Google Play Store Redeem Gift Voucher is ready.
        </p>

        <div class="code-box">
          <div class="code-label">Google Play Gift Card Code (INR)</div>
          <div class="redeem-code">\${redeemCode}</div>
          <div class="amount-badge">Value: ₹\${denomination} INR</div>
        </div>

        <div class="instructions">
          <strong style="color: #FFFFFF;">How to redeem on your Android device:</strong>
          <ol>
            <li>Open the <strong>Google Play Store</strong> app on your Android phone.</li>
            <li>Tap on your profile icon in the top right corner.</li>
            <li>Tap <strong>Payments & subscriptions</strong> &rarr; <strong>Redeem gift code</strong>.</li>
            <li>Paste your 16-character code: <code>\${redeemCode}</code> and tap Redeem!</li>
          </ol>
        </div>

        <p style="margin-top: 20px; font-size: 12px; color: #64748B;">
          Transaction Ref: \${transactionRef} | Time: \${new Date().toUTCString()}
        </p>
      </div>
      <div class="footer">
        &copy; 2026 ZEST ESPORTS PLATFORM. All rights reserved.<br>
        This email was sent to \${toEmail} because you requested a prize withdrawal.
      </div>
    </div>
  </body>
  </html>
  \`;

  try {
    const info = await emailTransporter.sendMail({
      from: '"Zest Esports Payouts" <payouts@zestesports.gg>',
      to: toEmail,
      subject: \`🎁 Your ₹\${denomination} Google Play Redeem Code is Here! [Ref: \${transactionRef}]\`,
      html: htmlContent,
    });

    console.log(\`[Email Sent] Message ID: \${info.messageId} to \${toEmail}\`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Nodemailer Error]', error);
    return { success: false };
  }
}

// =========================================================================
// 3. ADMIN ONE-CLICK APPROVE & EMAIL TRIGGER
// Endpoint: POST /api/v1/admin/withdrawals/:id/fulfill-code
// =========================================================================
app.post('/api/v1/admin/withdrawals/:id/fulfill-code', async (req: Request, res: Response) => {
  const transactionId = req.params.id;
  const { manualCode } = req.body;

  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');

    // Retrieve pending transaction
    const txRes = await client.query(
      'SELECT t.*, u.full_name FROM transactions t JOIN users u ON t.user_id = u.id WHERE t.id = $1 AND t.status = \\'pending\\' FOR UPDATE',
      [transactionId]
    );

    if (txRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Transaction not found or already processed' });
    }

    const tx = txRes.rows[0];
    const metadata = tx.metadata || {};
    let codeToUse = manualCode;

    // If manual code not passed, take FIFO available code from inventory
    if (!codeToUse) {
      const codeRes = await client.query(
        \`SELECT id, code FROM google_play_redeem_inventory 
         WHERE denomination = $1 AND is_used = false 
         ORDER BY created_at ASC LIMIT 1 FOR UPDATE\`,
        [tx.amount]
      );

      if (codeRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'Redeem code inventory exhausted for this denomination' });
      }

      codeToUse = codeRes.rows[0].code;

      // Mark inventory code used
      await client.query(
        \`UPDATE google_play_redeem_inventory 
         SET is_used = true, used_by_user_id = $1, sent_to_email = $2, assigned_at = NOW() 
         WHERE id = $3\`,
        [tx.user_id, metadata.targetGmail, codeRes.rows[0].id]
      );
    }

    // Mark transaction completed
    await client.query(
      \`UPDATE transactions 
       SET status = 'completed', reference_id = $1, metadata = metadata || $2, updated_at = NOW() 
       WHERE id = $3\`,
      [codeToUse, JSON.stringify({ redeemCode: codeToUse }), transactionId]
    );

    await client.query('COMMIT');

    // Trigger Nodemailer asynchronous dispatch
    sendGooglePlayRedeemEmail({
      toEmail: metadata.targetGmail,
      playerName: tx.full_name,
      redeemCode: codeToUse,
      denomination: tx.amount,
      transactionRef: tx.reference_id,
    });

    return res.status(200).json({
      success: true,
      message: \`Code \${codeToUse} dispatched to \${metadata.targetGmail}\`,
      redeemCode: codeToUse,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});
`;

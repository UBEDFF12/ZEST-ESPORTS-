import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Nodemailer Gmail SMTP Transporter
function getEmailTransporter() {
  const user = process.env.SYSTEM_GMAIL;
  const pass = process.env.SYSTEM_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user.trim(),
      pass: pass.trim().replace(/\s+/g, ''), // App passwords often copied with spaces
    },
  });
}

// 1. SMTP Health & Configuration Check
app.get('/api/smtp-status', (req: Request, res: Response) => {
  const user = process.env.SYSTEM_GMAIL;
  const pass = process.env.SYSTEM_APP_PASSWORD;
  const isConfigured = Boolean(user && pass && user.includes('@') && pass.length >= 8);

  res.json({
    isConfigured,
    systemGmail: user ? `${user.slice(0, 3)}***@${user.split('@')[1] || 'gmail.com'}` : null,
    status: isConfigured ? 'ready_live_smtp' : 'unconfigured_fallback',
    message: isConfigured
      ? 'Live Gmail SMTP Transporter is ready for automated dispatch.'
      : 'Set SYSTEM_GMAIL and SYSTEM_APP_PASSWORD in .env for live Gmail delivery.',
  });
});

// 2. Deliverable 3: Automated Nodemailer Google Play Code Dispatcher
app.post('/api/send-redeem-email', async (req: Request, res: Response) => {
  const { toEmail, userName, redeemCode, amount, transactionRef } = req.body;

  if (!toEmail || !redeemCode || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Missing required email parameters (toEmail, redeemCode, amount).',
    });
  }

  const cleanEmail = String(toEmail).trim().toLowerCase();
  const playerName = userName || 'Gamer';
  const cleanCode = String(redeemCode).trim().toUpperCase();
  const txRef = transactionRef || `GP-DELIV-${Date.now().toString().slice(-6)}`;

  // AAA Esports HTML Email Template (as specified in Deliverable 3)
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { margin: 0; padding: 0; background-color: #090D16; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #E2E8F0; }
      .container { max-width: 600px; margin: 20px auto; background-color: #121824; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
      .header { background: linear-gradient(135deg, #FF5722 0%, #E64A19 100%); padding: 32px 20px; text-align: center; }
      .header h1 { margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
      .header p { margin: 6px 0 0; color: #FFE0B2; font-size: 13px; font-weight: 600; letter-spacing: 1px; }
      .content { padding: 32px 24px; }
      .badge { display: inline-block; background: #00E676; color: #090D16; font-weight: 900; font-size: 11px; padding: 5px 12px; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
      .greeting { margin: 0 0 12px; color: #FFFFFF; font-size: 20px; font-weight: 800; }
      .text { color: #94A3B8; font-size: 14px; line-height: 1.6; margin: 0 0 20px; }
      .code-box { background: #090D16; border: 2px dashed #00E5FF; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
      .code-label { color: #94A3B8; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
      .redeem-code { color: #00E5FF; font-family: 'Courier New', Courier, monospace; font-size: 28px; font-weight: 900; letter-spacing: 4px; margin: 12px 0; word-break: break-all; }
      .amount-badge { display: inline-block; background: rgba(255, 87, 34, 0.15); color: #FF5722; border: 1px solid rgba(255, 87, 34, 0.4); padding: 4px 14px; border-radius: 20px; font-size: 15px; font-weight: 800; }
      .instructions { background: #0B111E; border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 18px; font-size: 13px; color: #94A3B8; line-height: 1.7; margin-top: 24px; }
      .instructions strong { color: #FFFFFF; }
      .instructions ol { margin: 8px 0 0; padding-left: 20px; }
      .instructions li { margin-bottom: 6px; }
      .instructions code { background: #171F2F; color: #00E676; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
      .meta { margin-top: 24px; padding-top: 16px; border-top: 1px solid #1E293B; font-size: 11px; color: #64748B; font-family: monospace; }
      .footer { padding: 20px 24px; text-align: center; font-size: 11px; color: #64748B; background: #090D16; border-top: 1px solid #1E293B; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>ZEST ESPORTS</h1>
        <p>OFFICIAL TOURNAMENT PRIZE PAYOUT</p>
      </div>
      <div class="content">
        <span class="badge">&#10003; 100% VERIFIED DISPATCH</span>
        <h2 class="greeting">Congratulations, ${playerName}!</h2>
        <p class="text">
          Your Free Fire tournament winnings payout of <strong>₹${amount}</strong> has been approved by the Admin Room Master.
          Your official Google Play Store Redeem Gift Voucher is activated and ready to claim.
        </p>

        <div class="code-box">
          <div class="code-label">Official Google Play Redeem Voucher</div>
          <div class="redeem-code">${cleanCode}</div>
          <div class="amount-badge">Total Value: ₹${amount} INR</div>
        </div>

        <div class="instructions">
          <strong>How to redeem your code on Android:</strong>
          <ol>
            <li>Open the <strong>Google Play Store</strong> app on your Android device.</li>
            <li>Tap your profile avatar at the top right corner.</li>
            <li>Select <strong>Payments & subscriptions</strong> &rarr; <strong>Redeem code</strong>.</li>
            <li>Paste your 16-character code: <code>${cleanCode}</code> and tap <strong>Redeem</strong>!</li>
          </ol>
        </div>

        <div class="meta">
          Transaction Reference: ${txRef} | Dispatched: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
        </div>
      </div>
      <div class="footer">
        &copy; 2026 ZEST ESPORTS ECOSYSTEM &bull; ALL RIGHTS RESERVED<br>
        This is an automated operational notification dispatched to ${cleanEmail}.
      </div>
    </div>
  </body>
  </html>
  `;

  const transporter = getEmailTransporter();

  // If real Gmail SMTP is configured with SYSTEM_GMAIL and SYSTEM_APP_PASSWORD:
  if (transporter && process.env.SYSTEM_GMAIL) {
    try {
      console.log(`[Nodemailer] Connecting to Gmail SMTP as ${process.env.SYSTEM_GMAIL}...`);
      const info = await transporter.sendMail({
        from: `"Zest Esports Payouts" <${process.env.SYSTEM_GMAIL}>`,
        to: cleanEmail,
        subject: `🎁 Your ₹${amount} Google Play Redeem Code is Here! [Ref: ${txRef}]`,
        html: htmlContent,
      });

      console.log(`[Nodemailer SUCCESS] Message dispatched! ID: ${info.messageId} to ${cleanEmail}`);
      return res.json({
        success: true,
        mode: 'real_smtp',
        messageId: info.messageId,
        sender: process.env.SYSTEM_GMAIL,
        recipient: cleanEmail,
        redeemCode: cleanCode,
        amount,
        message: `Real email successfully dispatched via Gmail SMTP (${process.env.SYSTEM_GMAIL}) to ${cleanEmail}!`,
      });
    } catch (error: any) {
      console.error('[Nodemailer Real SMTP Failed]', error);
      return res.status(500).json({
        success: false,
        mode: 'smtp_error',
        error: error.message || 'SMTP Authentication Failed',
        message: 'Failed to send email through Gmail SMTP. Check your Google App Password in .env.',
      });
    }
  }

  // Graceful fallback when SYSTEM_GMAIL / SYSTEM_APP_PASSWORD are not yet filled in .env
  console.log(`[Nodemailer Simulation] Dispatching preview to ${cleanEmail}: ${cleanCode}`);
  return res.json({
    success: true,
    mode: 'simulated',
    recipient: cleanEmail,
    redeemCode: cleanCode,
    amount,
    message: `Preview generated! (To send real emails, set SYSTEM_GMAIL & SYSTEM_APP_PASSWORD in environment)`,
  });
});

// Start dev server with Vite middlewares in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Zest Esports Full-Stack Server] Running at http://0.0.0.0:${PORT}`);
    console.log(`[SMTP Status] SYSTEM_GMAIL: ${process.env.SYSTEM_GMAIL || 'NOT_CONFIGURED'}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Start Error]', err);
});

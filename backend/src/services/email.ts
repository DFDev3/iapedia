import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Check if email is configured
const isEmailConfigured = env.SMTP_USER && env.SMTP_PASS;

// Create reusable transporter (only if configured)
let transporter: nodemailer.Transporter | null = null;

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
  console.log('✅ Email service configured');
} else {
  console.warn('⚠️  Email service not configured. Set SMTP_USER and SMTP_PASS in .env');
}

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Send an email
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!transporter) {
    throw new Error('Email service is not configured. Please set SMTP_USER and SMTP_PASS in .env');
  }

  try {
    await transporter.sendMail({
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL || env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
): Promise<void> {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6; 
          color: #030213;
          background: linear-gradient(135deg, #f3f3f5 0%, #ffffff 100%);
          padding: 40px 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }
        .header { 
          background: linear-gradient(135deg, #030213 0%, #1a1a2e 100%);
          color: white; 
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          font-size: 26px;
          font-weight: 600;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .logo {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #00d4ff 0%, #00ff88 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .content { 
          background: #ffffff;
          padding: 40px 30px;
        }
        .content p {
          color: #030213;
          font-size: 16px;
          margin-bottom: 16px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #030213;
          margin-bottom: 20px;
        }
        .button-container {
          text-align: center;
          margin: 35px 0;
        }
        .button { 
          display: inline-block;
          background: linear-gradient(135deg, #030213 0%, #1a1a2e 100%);
          color: white;
          padding: 16px 40px;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 15px rgba(3, 2, 19, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(3, 2, 19, 0.4);
        }
        .link-box {
          background: #f3f3f5;
          padding: 16px;
          border-radius: 10px;
          margin: 25px 0;
          border-left: 4px solid #030213;
        }
        .link-box p {
          font-size: 13px;
          color: #717182;
          margin-bottom: 8px;
        }
        .link-text {
          word-break: break-all;
          color: #030213;
          font-size: 14px;
          font-family: 'Courier New', monospace;
        }
        .warning {
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
          padding: 16px;
          border-radius: 10px;
          border-left: 4px solid #f59e0b;
          margin: 25px 0;
        }
        .warning strong {
          color: #b45309;
          font-size: 15px;
        }
        .info-box {
          background: #f3f3f5;
          padding: 20px;
          border-radius: 10px;
          margin: 25px 0;
          font-size: 14px;
          color: #717182;
        }
        .footer { 
          text-align: center;
          padding: 30px;
          background: #f3f3f5;
          color: #717182;
          font-size: 14px;
        }
        .footer-gradient {
          height: 4px;
          background: linear-gradient(90deg, #00d4ff 0%, #00ff88 50%, #8a2be2 100%);
        }
        @media only screen and (max-width: 600px) {
          .container { border-radius: 0; }
          .header, .content, .footer { padding: 30px 20px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">IAPedia</div>
          <h1>Solicitud de Restablecimiento de Contraseña</h1>
        </div>
        <div class="content">
          <p class="greeting">Hola ${name},</p>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta de IAPedia.</p>
          <p>Haz clic en el botón de abajo para crear una nueva contraseña:</p>
          
          <div class="button-container">
            <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
          </div>
          
          <div class="link-box">
            <p>O copia y pega este enlace en tu navegador:</p>
            <div class="link-text">${resetUrl}</div>
          </div>
          
          <div class="warning">
            <strong>⏱️ Este enlace expirará en 1 hora.</strong>
          </div>
          
          <div class="info-box">
            <p><strong>¿No solicitaste este cambio?</strong></p>
            <p>Si no solicitaste este restablecimiento de contraseña, puedes ignorar este correo de forma segura. Tu contraseña permanecerá sin cambios.</p>
          </div>
        </div>
        <div class="footer-gradient"></div>
        <div class="footer">
          <p><strong>IAPedia</strong> - Tu directorio de herramientas IA</p>
          <p>&copy; ${new Date().getFullYear()} IAPedia. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Hola ${name},
    
    Recibimos una solicitud para restablecer la contraseña de tu cuenta de IAPedia.
    
    Haz clic en el enlace de abajo para restablecer tu contraseña:
    ${resetUrl}
    
    Este enlace expirará en 1 hora.
    
    Si no solicitaste este restablecimiento de contraseña, puedes ignorar este correo de forma segura.
    
    Saludos cordiales,
    El Equipo de IAPedia
  `;

  await sendEmail({
    to: email,
    subject: 'Restablece tu Contraseña - IAPedia',
    text,
    html,
  });
}

import nodemailer from 'nodemailer';
import { env, isDev } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { CircuitBreaker, retryWithBackoff } from '../utils/resilience.js';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private circuitBreaker = new CircuitBreaker('EmailService', { failureThreshold: 5, resetTimeoutMs: 15000 });

  constructor() {
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT || 587,
        secure: env.SMTP_SECURE,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD,
        },
      });
    }
  }

  async sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
    const from = env.SMTP_FROM || `"Talentra Support" <support@talentra.com>`;

    if (!this.transporter || isDev) {
      logger.info(`[Email Service Dev Mode] Email to: ${to} | Subject: "${subject}"`);
      logger.debug(`HTML Body preview: ${html.substring(0, 150)}...`);
      return;
    }

    try {
      await this.circuitBreaker.execute(async () => {
        await retryWithBackoff(
          async () => {
            await this.transporter!.sendMail({
              from,
              to,
              subject,
              html,
            });
          },
          { maxRetries: 2, initialDelayMs: 300, maxDelayMs: 2000, jitter: true }
        );
      });
      logger.info(`Email successfully sent to ${to} [Subject: "${subject}"]`);
    } catch (error) {
      logger.error(`Failed to send email to ${to}`, { error });
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Welcome to Talentra, ${name}!</h2>
        <p>We're thrilled to have you on board. Explore thousands of enterprise job opportunities or start hiring top talent today.</p>
        <p>Best regards,<br/>The Talentra Team</p>
      </div>
    `;
    await this.sendEmail({ to, subject: 'Welcome to Talentra!', html });
  }

  async sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
    const verifyUrl = `${env.CLIENT_URL}/auth/verify-email?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Verify Your Talentra Email</h2>
        <p>Hi ${name},</p>
        <p>Please click the button below to verify your email address and activate your account:</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">Verify Email Address</a>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `;
    await this.sendEmail({ to, subject: 'Verify your Talentra email address', html });
  }

  async sendForgotPasswordEmail(to: string, name: string, token: string): Promise<void> {
    const resetUrl = `${env.CLIENT_URL}/auth/reset-password?token=${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>You requested a password reset. Click the link below to set a new password for your account (link expires in 1 hour):</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">Reset Password</a>
        <p>If you didn't request a password reset, please secure your account immediately.</p>
      </div>
    `;
    await this.sendEmail({ to, subject: 'Reset your Talentra password', html });
  }

  async sendPasswordChangedEmail(to: string, name: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Your Talentra Password Was Changed</h2>
        <p>Hi ${name},</p>
        <p>This is confirmation that the password for your Talentra account was successfully changed.</p>
        <p>If you did not authorize this change, please contact support immediately.</p>
      </div>
    `;
    await this.sendEmail({ to, subject: 'Security Alert: Talentra password updated', html });
  }
}

export const emailService = new EmailService();

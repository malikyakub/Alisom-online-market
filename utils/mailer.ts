// utils/mailer.ts

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "hotmail", // specifically for Hotmail/Outlook
  auth: {
    user: import.meta.env.VITE_EMAIL_USER || process.env.EMAIL_USER,
    pass: import.meta.env.VITE_EMAIL_PASSWORD || process.env.EMAIL_PASSWORD,
  },
});

type SendMailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export async function sendMail({ to, subject, text, html }: SendMailOptions) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.response}`);
    return { success: true, info };
  } catch (error: any) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

import { AutoRepairShop, User } from '../models/index.js';
import nodemailer from 'nodemailer';

export const generateOtp = async (req, res) => {
  const { number, email, authType, role } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'noreply@autoaider.online',
        pass: 'BRBbfP0nt1zM',
      },
    });

    await transporter.sendMail({
      from: '"Auto AIDER" <noreply@autoaider.online>',
      to: email,
      subject: 'OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color:#2c3e50;">Reset Password</h2>
          <p>Hello,</p>
          <p>We received a request to reset your ${role === 'Car Owner' ? 'account' : 'shop'} password. Please use the one-time password (OTP) below to continue:</p>
          <h1 style="color:#2980b9; letter-spacing: 3px;">${otp}</h1>
          <p>This code will expire in <strong>5 minutes</strong>.</p>
          <p>Please do not share this code with anyone. If you did not request this, please ignore this email. Your account is safe, and no further action is needed.</p>
          <br/>
          <p>Thanks,<br/>Auto AIDER Support Team</p>
        </div>
      `,
    });

    res.status(200).json(otp);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
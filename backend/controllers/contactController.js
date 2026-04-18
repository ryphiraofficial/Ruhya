const nodemailer = require('nodemailer');
const SiteSettings = require('../models/SiteSettings');

/**
 * Sends a contact enquiry email using configuration from .env and database settings
 */
const sendContactEmail = async (req, res) => {
    const { name, email, phone, message, serviceName } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    try {
        // Verify we have the required environment variables
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Email configuration missing in .env (EMAIL_USER or EMAIL_PASS)');
            throw new Error('Email configuration error on server');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // The email set in .env will now be both the sender and the recipient
        const recipient = process.env.EMAIL_USER;

        const mailOptions = {
            from: `"Ruhiya Website" <${process.env.EMAIL_USER}>`,
            to: recipient,
            replyTo: email,
            subject: serviceName
                ? `Service Enquiry: ${serviceName} from ${name}`
                : `New Contact Enquiry from ${name}`,
            html: `
                <div style="background-color: #f4f7f5; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.08);">
                        <!-- Gradient Header -->
                        <div style="background: #245e2f; background: linear-gradient(135deg, #1a4a22 0%, #245e2f 50%, #3a7a4a 100%); padding: 50px 40px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase;">RUH'YA</h1>
                            <div style="height: 1px; width: 40px; background: rgba(255,255,255,0.3); margin: 20px auto;"></div>
                            <p style="color: #e8f5e9; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9;">
                                ${serviceName ? `Enquiry for ${serviceName}` : 'New Website Message'}
                            </p>
                        </div>
                        
                        <div style="padding: 50px 40px;">
                            <!-- Sender Info -->
                            <div style="margin-bottom: 40px;">
                                <h2 style="font-size: 12px; color: #8fa194; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; border-bottom: 1px solid #f0f4f2; padding-bottom: 10px;">Contact Information</h2>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 12px 0; color: #5c6e61; font-size: 14px; width: 100px;">Name</td>
                                        <td style="padding: 12px 0; color: #1a2e1f; font-size: 16px; font-weight: 600;">${name}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #5c6e61; font-size: 14px;">Email</td>
                                        <td style="padding: 12px 0;"><a href="mailto:${email}" style="color: #245e2f; text-decoration: none; font-size: 16px; font-weight: 600;">${email}</a></td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #5c6e61; font-size: 14px;">Phone</td>
                                        <td style="padding: 12px 0; color: #1a2e1f; font-size: 16px; font-weight: 600;">${phone || 'Not provided'}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Message Content -->
                            <div style="background: #fcfdfc; border: 1px solid #eef2f0; border-radius: 16px; padding: 30px; margin-bottom: 40px;">
                                <h2 style="font-size: 12px; color: #8fa194; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;">Message</h2>
                                <div style="color: #2d3a30; line-height: 1.8; font-size: 16px; font-style: italic;">"${message}"</div>
                            </div>

                            <!-- Action Button -->
                            <div style="text-align: center;">
                                <a href="mailto:${email}" style="display: inline-block; background: #245e2f; color: #ffffff; padding: 18px 35px; border-radius: 14px; text-decoration: none; font-weight: 600; font-size: 15px; box-shadow: 0 10px 20px rgba(36, 94, 47, 0.15);">Reply to ${name}</a>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="background: #f8faf9; padding: 30px; text-align: center; border-top: 1px solid #f0f4f2;">
                            <p style="margin: 0; font-size: 12px; color: #8fa194; line-height: 1.6;">
                                This enquiry was sent from the official Ruh'ya website.<br>
                                © 2026 Ruh'ya Holistic Healing
                            </p>
                        </div>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${recipient} from ${email}`);
        res.status(200).json({ message: 'Your message has been sent successfully!' });

    } catch (error) {
        console.error('Email transport error:', error);
        res.status(500).json({
            message: 'Failed to send message.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = { sendContactEmail };


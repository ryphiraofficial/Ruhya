const nodemailer = require('nodemailer');

/**
 * Sends a contact enquiry email using configuration from .env
 */
const sendContactEmail = async (req, res) => {
    const { name, email, phone, message, serviceName } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    try {
        // Verify we have the required environment variables
        const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS;
        
        if (!hasEmailConfig) {
            console.warn('WARNING: Email configuration missing in .env (EMAIL_USER or EMAIL_PASS). Email will not be sent, but enquiry is acknowledged.');
        } else {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const recipient = process.env.ADMIN_CONTACT_EMAIL || process.env.EMAIL_USER;

            const mailOptions = {
                from: `"Ruhiya Website" <${process.env.EMAIL_USER}>`,
                to: recipient,
                replyTo: email,
                subject: serviceName
                    ? `Service Enquiry: ${serviceName} from ${name}`
                    : `New Contact Enquiry from ${name}`,
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; color: #1a202c;">
                        <div style="background: #245e2f; padding: 40px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px;">RUH'YA</h1>
                            <p style="color: #c6f6d5; margin: 10px 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                                ${serviceName ? `New Enquiry for ${serviceName}` : 'New Website Message'}
                            </p>
                        </div>
                        
                        <div style="padding: 40px 30px;">
                            <div style="margin-bottom: 30px; border-bottom: 1px solid #edf2f7; padding-bottom: 20px;">
                                <h2 style="font-size: 18px; color: #2d3748; margin-bottom: 15px;">Contact Details</h2>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #718096; width: 100px;">Name:</td>
                                        <td style="padding: 8px 0; color: #1a202c; font-weight: 600;">${name}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #718096;">Email:</td>
                                        <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #245e2f; text-decoration: none; font-weight: 600;">${email}</a></td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #718096;">Phone:</td>
                                        <td style="padding: 8px 0; color: #1a202c;">${phone || 'Not provided'}</td>
                                    </tr>
                                </table>
                            </div>

                            <div>
                                <h2 style="font-size: 18px; color: #2d3748; margin-bottom: 15px;">Message</h2>
                                <div style="background: #f7fafc; padding: 20px; border-radius: 8px; line-height: 1.6; color: #4a5568; white-space: pre-wrap;">${message}</div>
                            </div>

                            <div style="margin-top: 40px; padding-top: 25px; border-top: 1px solid #edf2f7; text-align: center;">
                                <a href="mailto:${email}" style="display: inline-block; background: #245e2f; color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply to ${name}</a>
                            </div>
                        </div>

                        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #edf2f7;">
                            This message was sent via the contact form on ruhya.com
                        </div>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email successfully sent to ${recipient} from ${email}`);
        }

        res.status(200).json({ 
            message: 'Your message has been processed successfully!',
            whatsappRedirect: true 
        });

    } catch (error) {
        console.error('Email transport error:', error);
        // Still return 200 so the frontend can proceed with WhatsApp redirect
        res.status(200).json({
            message: 'Enquiry acknowledged (email delivery failed).',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            whatsappRedirect: true
        });
    }
};

module.exports = { sendContactEmail };


import nodemailer from 'nodemailer';


export const sendEmail = async (email: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env['EMAIL_USER'],
        pass: process.env['EMAIL_PASS'],
      },
    });

    await transporter.sendMail({
      from: `"Note Taking App" <${process.env['EMAIL_USER']}>`,
      to: email,
      subject: subject,
      html: text,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};




export const generateOtpEmailHtml = (name: string, otp: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #f6f8fa;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                padding: 20px;
                text-align: center;
            }
            .logo {
                width: 48px;
                height: 48px;
                margin-bottom: 20px;
            }
            .card {
                background-color: #ffffff;
                border: 1px solid #e1e4e8;
                border-radius: 6px;
                padding: 32px;
            }
            h1 {
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 24px;
            }
            p {
                font-size: 16px;
                line-height: 1.5;
                margin-top: 0;
                margin-bottom: 16px;
            }
            .otp-code {
                font-size: 32px;
                font-weight: 700;
                letter-spacing: 4px;
                color: #0366d6;
                background-color: #f1f8ff;
                padding: 12px 20px;
                border-radius: 6px;
                display: inline-block;
                margin: 16px 0;
            }
            .warning {
                font-size: 14px;
                color: #586069;
            }
            .footer {
                margin-top: 24px;
                font-size: 12px;
                color: #6a737d;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <h1>Please verify your identity, ${name}</h1>
                <p>Here is your one-time authentication code:</p>
                <div class="otp-code">${otp}</div>
                <p class="warning">This code is valid for 10 minutes and can only be used once.</p>
                <p class="warning"><strong>Please don't share this code with anyone.</strong> We'll never ask for it on the phone or via email.</p>
            </div>
            <p class="footer">
                You're receiving this email because a verification code was requested for your HD Note App account. If this wasn't you, you can safely ignore this email.
            </p>
        </div>
    </body>
    </html>
  `;
};


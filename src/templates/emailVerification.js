const emailVerificationTemp = ({ name, otp, link }) => {
  const isOtp = Boolean(otp);

  return `
  <!DOCTYPE html>
  <html lang="en" style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif;">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Email Verification - EduVerse</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f9fafb;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 2rem auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <tr style="background-color: #1e3a8a;">
          <td style="padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">EduVerse</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #111827; font-size: 20px;">Hello ${name}, 👋</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              ${isOtp ? `Use the verification code below to complete your registration or sign-in process.` : `Click the button below to reset your password. If you didn’t request this, you can safely ignore this email..`
    }
            </p>

            ${isOtp ? `
                <div style="background-color: #f3f4f6; text-align: center; padding: 20px; border-radius: 8px; margin: 30px 0;">
                  <p style="font-size: 16px; color: #1e3a8a; margin: 0;">Your OTP code is:</p>
                  <h2 style="font-size: 32px; letter-spacing: 4px; margin: 10px 0; color: #111827;">${otp}</h2>
                  <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">This code is valid for 5 minutes.</p>
                </div>
                ` : `
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #1e3a8a; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px;">
                    Reset Password
                  </a>
                  <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">This link is valid for 5 minutes.</p>
                </div>
                `
    }

            <p style="color: #6b7280; font-size: 14px;">
              If you did not request this, you can safely ignore this email.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0;" />

            <p style="color: #9ca3af; font-size: 13px; text-align: center;">
              &copy; ${new Date().getFullYear()
    } EduVerse. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

export default emailVerificationTemp;

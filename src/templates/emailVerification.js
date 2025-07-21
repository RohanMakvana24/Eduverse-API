const emailVerificationTemp = (name, otp) => {
    return `
   <!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background: #f9fafb;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to EduVerse</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 2rem auto; background: #ffffff; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); overflow: hidden;">
      <tr style="background-color: #1e3a8a;">
        <td style="padding: 1.5rem 2rem; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px;">EduVerse</h1>
        </td>
      </tr>

      <tr>
        <td style="padding: 2rem;">
          <h2 style="color: #111827;">Welcome, ${name}! 🎉</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Thank you for joining <strong>EduVerse</strong>, the platform where learning never stops.
            We're excited to have you on board.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Start exploring courses, track your learning, and grow your knowledge.
          </p>

          <div style="background: #f3f4f6; padding: 1rem; margin: 2rem 0; text-align: center; border-radius: 6px;">
            <p style="margin: 0; font-size: 18px; color: #1e3a8a;">
              Your verification code:
            </p>
            <h2 style="margin: 0.5rem 0 0; font-size: 32px; letter-spacing: 4px; color: #111827;">
             ${otp}
            </h2>
            <p style="margin-top: 1rem; font-size: 14px; color: #6b7280;">
              This code is valid for 5 minutes.
            </p>
          </div>

          <p style="color: #6b7280; font-size: 14px;">
            If you didn’t create an account, you can safely ignore this email.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0;" />

          <p style="color: #9ca3af; font-size: 13px; text-align: center;">
            &copy; 2025 EduVerse. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>

    `
}

export default emailVerificationTemp;

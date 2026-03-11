export const resetPasswordTemplate = (email, resetLink) => `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">

        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:40px;">

          <tr>
            <td align="center">
              <img src="https://foodie-food-order-app.vercel.app/images/logo-3a62f2e6.jpg" width="60" style="width: 60px;height: 60px;object-fit: contain;border-radius: 50%;border: 2px solid #ffc404">
              <h1 style="margin:0;color:#ffc404;">
                <span>Foodie</span>
              </h1>
              <p style="color:#888;font-size:13px;margin-top:4px;">
                Delicious food delivered to you
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-top:30px;">
              <h2 style="color:#29251c;margin-bottom:10px;">
                Reset your password
              </h2>

              <p style="color:#555;font-size:14px;line-height:1.6;">
                We received a request to reset the password for your Foodie account.
                Click the button below to choose a new password.
              </p>

              <!-- Bonus improvement -->
              <p style="color:#555;font-size:14px;margin-top:10px;">
                This password reset was requested for <strong style="color: #29251c">${email}</strong>.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:30px 0;">
              <a href="${resetLink}"
                 style="background:#ffc404;color:#1f1a09;padding:14px 28px;
                        border-radius:6px;text-decoration:none;
                        font-size:15px;font-weight:bold;">
                Reset Password
              </a>
            </td>
          </tr>

          <tr>
            <td>
              <p style="color:#666;font-size:13px;">
                This link will expire in <strong style="color:#29251c">15 minutes</strong>.
              </p>

              <p style="color:#666;font-size:13px;">
                If you didn't request a password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-top:30px;border-top:1px solid #eee;">
              <p style="font-size:12px;color:#999;text-align:center;">
                © ${new Date().getFullYear()} Foodie. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</div>
`;

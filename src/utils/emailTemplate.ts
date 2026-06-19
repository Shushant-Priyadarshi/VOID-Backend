export const EmailTemplate = ({
  title,
  message,
  buttonText,
  buttonUrl,
}: {
  title: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body style="
      margin:0;
      padding:0;
      background:#f5f7fb;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    ">

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 20px;">

          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background:white;
              border-radius:16px;
              overflow:hidden;
              box-shadow:0 4px 12px rgba(0,0,0,0.06);
            "
          >

            <tr>
              <td
                style="
                  background:#111827;
                  padding:24px;
                  text-align:center;
                "
              >
                <h1
                  style="
                    color:white;
                    margin:0;
                    font-size:24px;
                  "
                >
                  Voice Of Indian Doctors
                </h1>
              </td>
            </tr>

            <tr>
              <td style="padding:40px;">

                <h2
                  style="
                    margin-top:0;
                    color:#111827;
                  "
                >
                  ${title}
                </h2>

                <p
                  style="
                    color:#4b5563;
                    font-size:16px;
                    line-height:1.7;
                  "
                >
                  ${message}
                </p>

                ${
                  buttonUrl
                    ? `
                    <div style="margin:32px 0;">
                      <a
                        href="${buttonUrl}"
                        style="
                          display:inline-block;
                          background:#111827;
                          color:white;
                          text-decoration:none;
                          padding:14px 28px;
                          border-radius:10px;
                          font-weight:600;
                        "
                      >
                        ${buttonText}
                      </a>
                    </div>
                  `
                    : ""
                }

                <p
                  style="
                    color:#9ca3af;
                    font-size:14px;
                    margin-top:32px;
                  "
                >
                  If you didn't request this, you can safely ignore this email.
                </p>

              </td>
            </tr>

            <tr>
              <td
                style="
                  background:#f9fafb;
                  text-align:center;
                  padding:20px;
                  color:#6b7280;
                  font-size:13px;
                "
              >
                © ${new Date().getFullYear()} Voice Of Indian Doctors
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};
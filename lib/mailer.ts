import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "checkercaption@gmail.com",
    pass: "pvdy rmkl xvlh xjec",
  },
});

export async function sendResetEmail(to: string, resetLink: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "CaptionChecker <noreply@example.com>",
    to,
    subject: "Password Reset Request",
    html: `
      <p>Hi there,</p>
      <p>You requested to reset your password.</p>
      <p><a href="${resetLink}" target="_blank">Click here to reset your password</a></p>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
}
export async function sendUserVerificationEmail(
  to: string,
  verifyLink: string
) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "CaptionChecker <noreply@example.com>",
    to,
    subject: "User Confirmation Email",
    html: `
    <h2>Email Verification</h2>
    <p>Click the link below to verify your email:</p>
    <a href="${verifyLink}">Confirm Your Email</a>
     `,
  });
}

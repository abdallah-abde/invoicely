import { Resend } from "resend";

import RequestPasswordEmail from "@/components/emails/request-password-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async ({
  to,
  url,
}: {
  to: string;
  url: string;
}) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: "Reset your password",
      react: <RequestPasswordEmail url={url} to={to} />,
    });
  } catch (error) {
    console.error(error);
  }
};

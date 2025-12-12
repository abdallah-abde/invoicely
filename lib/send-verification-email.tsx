import { Resend } from "resend";

import VerificationEmail from "@/components/emails/verification-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async ({
  to,
  verificationUrl,
  username,
}: {
  to: string;
  verificationUrl: string;
  username: string;
}) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: `Welcome to ${process.env.APP_NAME}`,
      react: (
        <VerificationEmail
          verificationUrl={verificationUrl}
          username={username}
        />
      ),
    });
  } catch (error) {
    console.error(error);
  }
};

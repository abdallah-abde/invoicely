import { Resend } from "resend";

import OTPEmail from "@/components/emails/otp-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async ({
  to,
  otp,
}: {
  to: string;
  otp: string;
}) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: `Your login code`,
      react: <OTPEmail otp={otp} />,
    });
  } catch (error) {
    console.error(error);
  }
};

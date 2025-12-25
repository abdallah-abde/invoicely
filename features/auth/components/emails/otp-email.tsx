import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface OTPEmailProps {
  otp: string;
  appName?: string;
}

export const OTPEmail = ({
  otp,
  appName = process.env.NEXT_PUBLIC_APP_NAME!,
}: OTPEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-white">
        <Preview>Your login code for {appName}</Preview>
        <Container className="mx-auto py-5 pb-12">
          <Text className="text-[16px] leading-[26px]">
            Please find your code to login below
          </Text>
          <Text className="text-[40px] leading-5">{otp}</Text>

          <Text className="text-secondary text-[12px]">
            If you did not request a code, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default OTPEmail;

import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  verificationUrl: string;
  appName?: string;
}

export const VerificationEmail = ({
  username,
  verificationUrl,
  appName = process.env.NEXT_PUBLIC_APP_NAME!,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-white">
        <Preview>Verify your email for {appName}</Preview>
        <Container className="mx-auto py-5 pb-12">
          <Text className="text-[16px] leading-[26px]">Hi {username},</Text>
          <Text className="text-[16px] leading-[26px]">
            Welcome to {appName}. Thank you for signing up for {appName}. Please
            confirm your email address by clicking on the button below.
          </Text>
          <Section className="text-center">
            <Button
              className="bg-black rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
              href={verificationUrl}
            >
              Verify your email
            </Button>
          </Section>

          <Text className="text-secondary text-[12px]">
            If you did not create an account, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default VerificationEmail;

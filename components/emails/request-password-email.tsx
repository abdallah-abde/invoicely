import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface RequestPasswordEmailProps {
  url: string;
  to: string;
}

export const RequestPasswordEmail = ({
  url,
  to,
}: RequestPasswordEmailProps) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME!;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white">
          <Preview>Reset your password for {appName} account</Preview>
          <Container className="mx-auto py-5 pb-12">
            <Heading
              as="h1"
              className="mb-3 text-center text-[20px] font-semibold text-black"
            >
              Hello
            </Heading>
            <Text className="text-[16px] leading-[26px]">
              We received a request to reset the password for {appName} account
              associated with {to}
            </Text>
            <Section className="text-center">
              <Button
                className="bg-black rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
                href={url}
              >
                Reset your password
              </Button>
            </Section>

            <Text className="text-secondary text-[12px]">
              If you did not request for password reset, you can safely ignore
              this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default RequestPasswordEmail;

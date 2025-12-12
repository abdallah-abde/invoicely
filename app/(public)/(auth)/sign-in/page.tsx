import { SignInForm } from "@/components/forms/sign-in-form";
import { authIsNotRequired } from "@/lib/auth-utils";

export default async function SignInPage() {
  await authIsNotRequired();
  return <SignInForm />;
}

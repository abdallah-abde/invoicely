// import { signIn } from "@/auth";
// import { Button } from "@/components/ui/button";

import { SignInForm } from "@/components/forms/sign-in-form";

export default function page() {
  return (
    <>
      <SignInForm />
      {/* <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/dashboard" });
        }}
      >
        <Button type="submit">Signin with GitHub</Button>
      </form> */}
    </>
  );
}

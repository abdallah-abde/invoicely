import { authIsNotRequired } from "@/lib/auth-utils";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await authIsNotRequired();

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {children}
    </div>
  );
}

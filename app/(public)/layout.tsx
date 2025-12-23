import Navbar from "@/components/navigation/navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="w-full">
        <Navbar />
      </header>
      <main>{children}</main>
    </>
  );
}

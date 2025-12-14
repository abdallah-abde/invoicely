import Navbar from "@/components/navigation/navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="p-2 px-6">{children}</main>
    </>
  );
}

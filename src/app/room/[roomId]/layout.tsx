export default function HomeLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return <div className="min-h-screen w-full">{children}</div>;
  }
  
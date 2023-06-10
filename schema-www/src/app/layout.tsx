import Link from "next/link";
import "../styles/globals.css";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="p-4 bg-green-500 text-gray-700 font-bold">
          <Link href="/">schema.regen.network</Link>
        </header>
        {children}
      </body>
    </html>
  );
}

export default RootLayout;

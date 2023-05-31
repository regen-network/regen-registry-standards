import Link from "next/link";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <header className="p-4 bg-green-500 text-gray-700 font-bold">
        <Link href="/">schema.regen.network</Link>
      </header>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

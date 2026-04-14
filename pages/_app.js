import '../styles/globals.css';
import Link from 'next/link';

export default function App({ Component, pageProps }) {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">ValidateAI</Link>
        <div className="nav-links">
          <Link href="/">New Idea</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </>
  );
}

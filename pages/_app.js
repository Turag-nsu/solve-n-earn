import '@/styles/globals.css'
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import Footer from '@/components/Footer';
import { SessionProvider } from 'next-auth/react';
export default function App({ Component, pageProps }) {
  
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <ResponsiveAppBar />
        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
    </>
  );
}

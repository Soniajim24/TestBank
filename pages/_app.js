/* Global styles fixed with this strategy */
import './styles/globals.module.css'
import { IconCheck, IconX } from "@tabler/icons-react";

export default function MyApp({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  );
}
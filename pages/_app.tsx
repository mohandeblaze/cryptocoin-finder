import { ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css";
import "../styles/flex.css";

function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}
export default MyApp;

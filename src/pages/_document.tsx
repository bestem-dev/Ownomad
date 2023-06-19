import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/ownomad.jpeg" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script async src="/chat.js"></script>
      </body>
    </Html>
  );
}

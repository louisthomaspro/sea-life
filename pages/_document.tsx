import { Head, Html, Main, NextScript } from "next/document";
import Document, { DocumentContext } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="fr">
        <Head>
          <meta
            name="application-name"
            content="Vie Marine (Mer Mediterranée)"
          />
          <meta
            name="description"
            content="L'application Vie Marine est un guide d'identification de la mer Mediterranée. Vous pouvez y trouver des informations sur les différentes espèces de la mer."
          />
          <meta name="theme-color" content="#ffffff" />
          <meta name="referrer" content={"strict-origin"} />

          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/favicon-512x512.png" />
          <link
            href="/favicon-512x512.png"
            rel="icon"
            type="image/png"
            sizes="512x512"
          />

          {/* <link href={nunito} rel="stylesheet" /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

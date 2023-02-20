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
          <meta name="application-name" content="SeaLife" />
          <meta
            name="description"
            content="Explorer la vie marine de la Méditerranée, de l'Océan Indien et du Pacifique tropical avec plus de 1000 fiches d'espèces communes ou insolites. Chaque fiche comporte des photos prises dans leur milieu naturel et des informations sur leur comportement, morphologie et habitat. Recherchez facilement une espèce en utilisant son nom commun ou scientifique. Utilisez les filtres pour retrouver une espèces en fonction de sa couleur, sa forme ou son habitat. Téléchargez notre application maintenant pour une expérience de découverte marine inoubliable !"
          />
          <meta name="theme-color" content="#ffffff" />
          <meta name="referrer" content={"strict-origin"} />

          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/icon-512x512.png" />
          <link
            href="/icon-512x512.png"
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

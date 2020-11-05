import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';

type IProps = {
  styleTags: any;
};

export default class MyDocument extends Document<IProps> {
  static async getInitialProps(ctx: any) {
    const sheet = new ServerStyleSheet();
    const rp = ctx.renderPage;
    ctx.renderPage = () =>
      rp({
        enhanceApp: (App: any) => (props: JSX.IntrinsicAttributes) => sheet.collectStyles(<App {...props} />),
      });
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=1024" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

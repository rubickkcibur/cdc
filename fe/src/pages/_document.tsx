import Document, { Head, Main, NextScript } from 'next/document';
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
      <html>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

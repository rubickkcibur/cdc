
import React from 'react';
import App from 'next/app';
import 'antd/dist/antd.css';
import { initializeStore } from '../lib/store';
import { Provider } from 'react-redux';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
// import "./global.less"
import "./global.scss"
import "antd/dist/antd.css"
// import 'antd/dist/antd.less'
let reduxStore: any;

const getOrInitializeStore = () => {
  if (typeof window === 'undefined') {
    return initializeStore();
  }
  if (!reduxStore) {
    reduxStore = initializeStore();
  }
  return reduxStore;
};

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const store = getOrInitializeStore();
    return (
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ConfigProvider>
    );
  }
}

export default MyApp;

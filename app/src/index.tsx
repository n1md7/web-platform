import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import {ToastContainer} from 'react-toastify';
import {BrowserRouter} from 'react-router-dom';
import { ChakraProvider, extendTheme} from "@chakra-ui/react";
import {Provider} from 'react-redux';
import store from './redux/store';
import App from './App';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.scss';

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};
const theme = extendTheme({ colors });

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <App/>
          <ToastContainer/>
        </BrowserRouter>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

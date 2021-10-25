import {CommonStyle, onboarderTheme} from 'akeneo-design-system';
import React from 'react';
import ReactDOM from 'react-dom';
import {createGlobalStyle, ThemeProvider} from 'styled-components';
import App from './App';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 20px;
    ${CommonStyle};
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={onboarderTheme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

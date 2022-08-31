import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
  }

  html, body, #root {
    min-height: 100%;
  }

  body {
    background-color: #0D2737;
    -webkit-font-smoothing: antialiased;
    font-size: 1.6rem;
    font-family: 'Nunito', sans-serif;
  }

  input, button {
    font-size: 1.6rem;
    font-family: 'Nunito', sans-serif;
  }
`;

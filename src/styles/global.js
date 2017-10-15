import { injectGlobal } from 'styled-components';
import { color } from './theme';

injectGlobal`
  html {
    box-sizing: border-box;
    font-size: 12px;
  }
  body {
    background: ${color.dark};
    font-size: 12px;
    font-family: monospace;
    margin: 0;
    padding: 0;
    position: relative;
    width: 100vw;
    height: 100vh;
  }
  #app {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
`;

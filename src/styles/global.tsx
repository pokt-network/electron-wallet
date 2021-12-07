import { createGlobalStyle } from 'styled-components';
import { WalletTheme } from './theme';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    background-attachment: fixed;
    background-size: cover;
    background-image: linear-gradient(123.23deg, #141C24 11.81%, #262A34 98.51%);

    color: ${({ theme }: { theme: WalletTheme }) => theme.baseTextColor};

  }
`;

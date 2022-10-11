import UserProvider from '@components/UserProvider';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';

const theme = createTheme();

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider>
                <UserProvider>
                    <Component {...pageProps} />
                </UserProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default MyApp;

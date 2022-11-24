import UserProvider from '@components/UserProvider';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { Provider as ReduxProvider } from 'react-redux';
import store from '@redux/store';

const theme = createTheme();

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <ReduxProvider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SnackbarProvider>
                    <UserProvider>
                        <Component {...pageProps} />
                    </UserProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </ReduxProvider>
    );
};

export default MyApp;

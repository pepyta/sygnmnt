import UserProvider from '@components/UserProvider';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { Provider as ReduxProvider } from 'react-redux';
import store from '@redux/store';

const theme = createTheme({
    components: {
        MuiDialogActions: {
            defaultProps: {
                sx: {
                    pr: 3,
                    pl: 3,
                    pb: 2,
                },
            },
        }
    },
});

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

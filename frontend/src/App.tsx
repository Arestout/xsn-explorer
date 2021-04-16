import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { ThemeProvider } from '@material-ui/styles';
import { SimpleCard } from './components/SimpleCard/SimpleCard';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  AppBar,
  CssBaseline,
  Typography,
  createMuiTheme,
  Container,
  Grid,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: 50,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  })
);

export const App: React.FC = () => {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  return (
    <div className="container">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar color="inherit">
            <Typography variant="h6">
              App bar background should be dark!
            </Typography>
          </AppBar>
          {/* <Container maxWidth="lg"> */}

          <div className={classes.root}>
            <Grid container spacing={7}>
              <Grid item xs={12} sm={6} md={3}>
                <SimpleCard title="Total supply" text="114382803.70499662" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SimpleCard />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SimpleCard />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SimpleCard />
              </Grid>
            </Grid>
          </div>
          {/* </Container> */}
        </ThemeProvider>
      </ErrorBoundary>
    </div>
  );
};

function ErrorFallback({ error }: FallbackProps) {
  return (
    <div className="error-fallback-wrapper">
      <div className="error-fallback" role="alert">
        <p>Something went wrong:</p>
        <p>{error.message}</p>
        <p>Please refresh the page and try again.</p>
      </div>
    </div>
  );
}

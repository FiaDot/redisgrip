import React, { useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';
import ReplayOutlinedIcon from '@material-ui/icons/ReplayOutlined';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ThemeProvider } from '@material-ui/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {
  setShowResult,
  startConnecting,
  stopConnecting,
  testConnection,
} from './connectionSlice';
import { createServer } from './serversSlice';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const generate = require('project-name-generator');

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#EE313f', // '#FF0000', e0313f
    },
    secondary: {
      main: '#000000',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.background,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    alignItems: 'center',
    align: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 1),
  },
}));

export default function AddServer() {
  const classes = useStyles();

  // redux
  const dispatch = useDispatch();

  const isConnecting = useSelector((state) => state.connections.isConnecting);
  const connectResult = useSelector((state) => state.connections.connectResult);
  const showResult = useSelector((state) => state.connections.showResult);

  // TODO : final!!
  // const initialState = {
  //   redirect: false,
  //   alias: generate({ words: 2, number: true }).dashed,
  //   host: 'localhost',
  //   port: 6379,
  //   password: '',
  //   sshHost: '',
  //   sshPort: '',
  //   sshUsername: '',
  //   : '',
  //   pemFilePath: '',
  //   pemPassphrase: '',
  // };

  const initialState = {
    redirect: false,
    alias: generate({ words: 2, number: true }).dashed,
    host: 'localhost',
    port: 6379,
    password: '',
    sshActive: false,
    sshHost: '',
    sshPort: '22',
    sshUsername: '',
    pemFilePath: '',
    pemPassphrase: '',
  };

  // local
  const [inputs, setInputs] = useState(initialState);

  const {
    redirect,
    alias,
    host,
    port,
    password,
    sshActive,
    sshHost,
    sshPort,
    sshUsername,
    pemFilePath,
    pemPassphrase,
  } = inputs;

  useEffect(() => {
    console.log('AddServer useEffect open');

    return () => {
      console.log('AddServer useEffect close');
      dispatch(stopConnecting());
      dispatch(setShowResult(false));
    };
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onChangeCheckbox = (e) => {
    setInputs({
      ...inputs,
      sshActive: e.target.checked,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(
      createServer({
        alias,
        host,
        port,
        password,
        sshActive,
        sshHost,
        sshPort,
        sshUsername,
        pemFilePath,
        pemPassphrase,
      })
    );

    // 저장 하고 나서 첫화면으로 이동
    setInputs({
      ...inputs,
      redirect: true,
    });
  };

  const onAddPemFile = (e) => {
    e.preventDefault();

    console.log('called onAddPemFile');
    console.log(e.target.files[0].path);

    setInputs({
      ...inputs,
      pemFilePath: e.target.files[0].path,
    });
  };

  const onAlertClose = () => {
    dispatch(setShowResult(false));
  };

  const onTestConnection = () => {
    dispatch(
      testConnection({
        alias,
        host,
        port,
        password,
        sshActive,
        sshHost,
        sshPort,
        sshUsername,
        pemFilePath,
        pemPassphrase,
      })
    );
  };

  return redirect ? (
    <Redirect push to="/servers" />
  ) : (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Backdrop className={classes.backdrop} open={isConnecting}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={showResult}
          onClose={onAlertClose}
          autoHideDuration={3000}
          // message={connectResult ? 'Success' : 'Failed'}
          key="bottom center"
        >
          <Alert
            onClose={onAlertClose}
            severity={connectResult ? 'success' : 'error'}
          >
            Connection {connectResult ? 'Success' : 'Failed'}
          </Alert>
        </Snackbar>

        <CssBaseline />
        <div className={classes.paper}>
          <form className={classes.form} noValidate>
            <Typography component="h1" variant="h6" align="center">
              Redis
            </Typography>

            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              autoFocus
              label="Alias"
              name="alias"
              value={alias}
              onChange={onChange}
              disabled={isConnecting}
            />

            <Grid container spacing={1}>
              <Grid item xs={12} sm={9}>
                <TextField
                  size="small"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Host Address"
                  name="host"
                  value={host}
                  onChange={onChange}
                  disabled={isConnecting}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  size="small"
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Port"
                  name="port"
                  value={port}
                  onChange={onChange}
                  disabled={isConnecting}
                />
              </Grid>
            </Grid>

            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              name="password"
              value={password}
              onChange={onChange}
              disabled={isConnecting}
            />

            <Typography component="h1" variant="h6" align="center">
              SSH
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={sshActive}
                  onChange={onChangeCheckbox}
                  name="sshActive"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                  disabled={isConnecting}
                />
              }
              label="SSH Enable"
            />

            <Grid container spacing={1}>
              <Grid item xs={12} sm={9}>
                <TextField
                  size="small"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="SSH Host"
                  name="sshHost"
                  value={sshHost}
                  onChange={onChange}
                  disabled={isConnecting}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  size="small"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="SSH Port"
                  name="sshPort"
                  value={sshPort}
                  onChange={onChange}
                  disabled={isConnecting}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={12}>
                <TextField
                  size="small"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="SSH Username"
                  name="sshUsername"
                  value={sshUsername}
                  onChange={onChange}
                  disabled={isConnecting}
                />
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12} sm={10}>
                <TextField
                  size="small"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Pem File Path"
                  name="pemFilePath"
                  value={pemFilePath}
                  onChange={onChange}
                  disabled={isConnecting}
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <Button
                  startIcon={<SearchIcon />}
                  variant="contained"
                  color="primary"
                  component="label"
                  className={classes.submit}
                  disabled={isConnecting}
                >
                  <input
                    type="file"
                    accept=".pem"
                    style={{ display: 'none' }}
                    name="pemFilePath"
                    onChange={onAddPemFile}
                    disabled={isConnecting}
                  />
                </Button>
              </Grid>
            </Grid>

            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              label="Pem Passphrase"
              name="pemPassphrase"
              value={pemPassphrase}
              onChange={onChange}
              disabled={isConnecting}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <Button
                  startIcon={<ReplayOutlinedIcon />}
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={onTestConnection}
                  disabled={isConnecting}
                >
                  Test
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <Button
                  startIcon={<AddCircleIcon />}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={onSubmit}
                  disabled={isConnecting}
                >
                  Add
                </Button>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Button
                  startIcon={<CancelIcon />}
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.submit}
                  component={Link}
                  to="/servers"
                  disabled={isConnecting}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
}

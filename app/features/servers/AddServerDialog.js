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
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import Paper from '@material-ui/core/Paper';
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
    minWidth: 500,
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 1),
  },
}));

export default function AddServerDialog() {
  const classes = useStyles();

  // redux
  const dispatch = useDispatch();

  const disabled = useSelector((state) => state.connections.isConnecting);
  const connectResult = useSelector((state) => state.connections.connectResult);
  const showResult = useSelector((state) => state.connections.showResult);

  // local
  const [inputs, setInputs] = useState({
    open: false,
    alias: generate({ words: 2, number: true }).dashed,
    host: 'localhost',
    port: 6379,
    // TODO : password로 변경 필요!
    pwd: 'pwd',
    sshHost: 'sshlocalhost',
    sshPort: '22',
    sshUsername: 'ubuntu',
    sshPassword: '1',
    pemFilePath: '2',
    pemPassphrase: '3',
  });

  const {
    open,
    alias,
    host,
    port,
    pwd,
    sshHost,
    sshPort,
    sshUsername,
    sshPassword,
    pemFilePath,
    pemPassphrase,
  } = inputs;

  // useEffect(() => {
  //   dispatch(stopConnecting());
  //   dispatch(setShowResult(false));
  //   return () => {
  //     dispatch(stopConnecting());
  //     dispatch(setShowResult(false));
  //   };
  // }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleClickOpen = () => {
    dispatch(stopConnecting());
    dispatch(setShowResult(false));

    setInputs({ ...inputs, open: true });
  };

  const handleClose = () => {
    dispatch(stopConnecting());
    dispatch(setShowResult(false));

    setInputs({ ...inputs, open: false });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    await dispatch(startConnecting());

    await dispatch(
      createServer({
        alias,
        host,
        port,
        pwd,
        sshHost,
        sshPort,
        sshUsername,
        sshPassword,
        pemFilePath,
        pemPassphrase,
      })
    );

    handleClose();
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
        pwd,
        sshHost,
        sshPort,
        sshUsername,
        sshPassword,
        pemFilePath,
        pemPassphrase,
      })
    );
  };

  const ShowIcon = () => {
    return (
      <Tooltip TransitionComponent={Zoom} title="Add">
        <IconButton
          // variant="contained"
          className={classes.button}
          onClick={handleClickOpen}
        >
          <AddBoxOutlinedIcon className={classes.buttonIcon} color="primary" />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <>
      {/* 아이콘 */}
      {ShowIcon()}

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

      <Backdrop className={classes.backdrop} open={disabled}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-add-server"
      >
        <DialogTitle id="form-dialog-add-sub-key">Server</DialogTitle>

        <DialogContent className={classes.form}>
          <DialogContentText>{/* New Key... */}</DialogContentText>

          {/* alias */}
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
            disabled={disabled}
          />

          {/* host, port */}
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
              />
            </Grid>
          </Grid>

          {/* password */}
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            fullWidth
            label="Password"
            name="pwd"
            value={pwd}
            onChange={onChange}
          />

          {/* ssh */}
          <Typography component="h1" variant="h6" align="center">
            SSH
          </Typography>

          {/* ssh host, port */}
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
              />
            </Grid>
          </Grid>

          {/* ssh id, pwd */}
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                fullWidth
                label="SSH Username"
                name="sshUsername"
                value={sshUsername}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                fullWidth
                label="SSH Pasword"
                name="sshPassword"
                value={sshPassword}
                onChange={onChange}
              />
            </Grid>
          </Grid>

          {/* ssh pem */}

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
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button
                startIcon={<SearchIcon />}
                variant="contained"
                color="primary"
                component="label"
                className={classes.submit}
                disabled={disabled}
              >
                <input
                  type="file"
                  accept=".pem"
                  style={{ display: 'none' }}
                  name="pemFilePath"
                  onChange={onAddPemFile}
                />
              </Button>
            </Grid>
          </Grid>

          {/* ssh pem pwd */}
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            fullWidth
            label="Pem Passphrase"
            name="pemPassphrase"
            value={pemPassphrase}
            onChange={onChange}
          />


          {/* Test Button */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Button
                startIcon={<ReplayOutlinedIcon />}
                fullWidth
                variant="contained"
                color="primary"
                onClick={onTestConnection}
                disabled={disabled}
              >
                Connection Test
              </Button>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          {/* Add, Cancel Button */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Button
                startIcon={<AddCircleIcon />}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={onSubmit}
                disabled={disabled}
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
                disabled={disabled}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
}

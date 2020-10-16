import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Zoom from '@material-ui/core/Zoom';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useDispatch, useSelector } from 'react-redux';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import SearchIcon from '@material-ui/icons/Search';
import ReplayOutlinedIcon from '@material-ui/icons/ReplayOutlined';
import { Link } from 'react-router-dom';
import { setShowResult, testConnection } from './connectionSlice';
import { createServer } from './serversSlice';
const generate = require('project-name-generator');

const useStyles = makeStyles((theme) => ({
  form: {
    minWidth: 300,
    marginTop: theme.spacing(0),
  },
  formSpecing: {
    marginBottom: theme.spacing(-0.5),
  },
  submit: {
    margin: theme.spacing(2, 0, 1),
  },
}));


export default function EditServerDialog() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isConnecting = useSelector((state) => state.connections.isConnecting);
  const connectResult = useSelector((state) => state.connections.connectResult);
  const showResult = useSelector((state) => state.connections.showResult);


  const initialState = {
    open: false,
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
    open,
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

  const handleClose = () => {
    setInputs({ ...inputs, open: false });
    setInputs({ ...initialState });
  };

  const onSubmit = async () => {
    console.log(`onSubmit`);
    // await dispatch(addKey({ key, type }));

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

  const handleClickOpen = () => {
    setInputs({ ...inputs, open: true });
  };


  return (
    <Fragment>
      {/* Edit Button */}
      <Tooltip TransitionComponent={Zoom} title="Edit">
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={handleClickOpen}
        >
          <EditOutlinedIcon className={classes.buttonIcon} color={'primary'} />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-edit-server"
      >
        <DialogTitle id="form-dialog-edit-server">Edit Server</DialogTitle>
        <DialogContent className={classes.form}>
          <DialogContentText>
          </DialogContentText>

          <div className={classes.paper}>
            <Typography component="h1" variant="h6" align="center">
              Redis
            </Typography>

            <form className={classes.form} noValidate>
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
                className={classes.formSpecing}
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
                    className={classes.formSpecing}
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
                    className={classes.formSpecing}
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
                    className={classes.formSpecing}
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
                    className={classes.formSpecing}
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
                    className={classes.formSpecing}
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
                    className={classes.formSpecing}
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
                      className={classes.formSpecing}
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
            </form>
          </div>

        </DialogContent>
        <DialogActions>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                startIcon={<AddCircleIcon />}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={onSubmit}
              >
                Update
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                startIcon={<CancelIcon />}
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

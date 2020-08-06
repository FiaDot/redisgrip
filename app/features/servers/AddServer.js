import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import { addServer } from './serversSlice';
import HomeIcon from '@material-ui/icons/Home';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import SearchIcon from '@material-ui/icons/Search';
import ReplayOutlinedIcon from '@material-ui/icons/ReplayOutlined';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  const onAddServer = (name, host, port, pwd) =>
    dispatch(addServer({ name, host, port, pwd }));

  // local
  const [inputs, setInputs] = useState({
    redirect: false,
    name: 'local',
    host: 'localhost',
    port: 6379,
    pwd: '',
    sshHost: '',
    sshPort: '',
    sshUsername: '',
    sshPassword: '',
    pemFilePath: '',
    pemPassphrase: '',
  });

  const {
    redirect,
    name,
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

  const onChange = (e) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // call redux action!
    onAddServer(name, host, port, pwd);

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

  }

  return redirect ? (
    <Redirect push to="/servers" />
  ) : (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>

        <form className={classes.form} noValidate>
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            autoFocus
            label="Name"
            name="name"
            value={name}
            onChange={onChange}
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

          <Typography component="h1" variant="h6" align="center">
            SSH
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={12} sm={9}>

              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                fullWidth
                label="SSH Host"
                name="sshHost"
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
                onChange={onChange}
              />

            </Grid>
          </Grid>



          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>

              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                fullWidth
                label="SSH Username"
                name="sshUsername"
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
                onChange={onChange}
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
              />
            </Grid>

            <Grid item xs={12} sm={2}>

              <Button
                startIcon={<SearchIcon />}
                variant="contained"
                color="primary"
                component="label"
                className={classes.submit}
              >
                <input
                  type="file"
                  accept=".pem"
                  style={{ display: "none" }}
                  name="pemFilePath"
                  onChange={onAddPemFile}
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
            onChange={onChange}
          />

          <Button
            startIcon={<ReplayOutlinedIcon />}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            component={Link}
            to="/"
          >
            Test
          </Button>


          <Grid container spacing={2}>

            <Grid item xs={12} sm={8}>
              <Button
                startIcon={<AddCircleIcon />}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={onSubmit}
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
              >
                Cancel
              </Button>
            </Grid>

          </Grid>
        </form>
      </div>
    </Container>
  );
}

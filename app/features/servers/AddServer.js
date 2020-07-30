import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CssBaseline from '@material-ui/core/CssBaseline';
import { addServer } from './serversSlice';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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
    name: 'local',
    host: 'localhost',
    port: 6379,
    pwd: '',
    redirect: false,
  });

  const { name, host, port, pwd, redirect } = inputs;

  const onChange = (e) => {
    const { name, value } = e.target;
    // console.log(`${name}=${value}`);

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

  return redirect ? (
    <Redirect push to="/" />
  ) : (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          New Connection
        </Typography>

        <form className={classes.form} noValidate>
          <TextField
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

          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
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

            <Grid item xs={12} sm={4}>
              <TextField
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
            variant="outlined"
            margin="normal"
            fullWidth
            label="Password"
            name="pwd"
            onChange={onChange}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Button
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
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                component={Link}
                to="/"
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

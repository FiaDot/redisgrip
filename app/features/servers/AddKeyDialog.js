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
import PostAddOutlinedIcon from '@material-ui/icons/PostAddOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { Link } from 'react-router-dom';
import Zoom from '@material-ui/core/Zoom';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.background,
  },
  // formControl: {
  //   margin: theme.spacing(1),
  //   minWidth: 240,
  // },
  form: {
    //width: '100%', // Fix IE 11 issue.
    minWidth: 500,
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 1),
  },
}));

export default function AddKeyDialog(props) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const [type, setType] = React.useState('String');

  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onAddKey = () => {

  }

  return (
    <Fragment>
      <Tooltip TransitionComponent={Zoom} title="Add Key">
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={handleClickOpen}
        >
          <PostAddOutlinedIcon color="primary" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-addkey">
          <DialogTitle id="form-dialog-addkey">Add Key</DialogTitle>
          <DialogContent className={classes.form}>
            <DialogContentText>
              {/*New Key...*/}
            </DialogContentText>

            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="name"
              fullWidth
            />

            <InputLabel id="add-key-type">Type</InputLabel>
            <Select
              labelId="add-key-type"
              id="add-key-type"
              value={type}
              onChange={handleChangeType}
              fullWidth
            >
              <MenuItem value={'String'}>String</MenuItem>
              <MenuItem value={'Hash'}>Hash</MenuItem>
              <MenuItem value={'List'}>List</MenuItem>
              <MenuItem value={'Set'}>Set</MenuItem>
              <MenuItem value={'Sorted Set'}>Sorted Set</MenuItem>
            </Select>

          </DialogContent>
          <DialogActions>
            {/*<Button onClick={handleClose} color="primary">*/}
            {/*  Add*/}
            {/*</Button>*/}
            {/*<Button onClick={handleClose} color="primary">*/}
            {/*  Cancel*/}
            {/*</Button>*/}

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  startIcon={<AddCircleIcon />}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={onAddKey}
                >
                  Add
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
};

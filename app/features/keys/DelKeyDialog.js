import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Zoom from '@material-ui/core/Zoom';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { useSelector, useDispatch } from 'react-redux';
import { delKey, scanKeys } from './keysSlice';

const useStyles = makeStyles((theme) => ({
  form: {
    minWidth: 300,
    marginTop: theme.spacing(1),
  },
  formSpecing: {
    marginBottom: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(2, 0, 1),
  },
}));

export default function DelKeyDialog() {
  const classes = useStyles();

  const dispatch = useDispatch();
  const selectKey = useSelector((state) => state.selected.selectKey);

  const [inputs, setInputs] = useState({
    open: false,
  });

  const { open } = inputs;

  const onChange = (e) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleClickOpen = () => {
    setInputs({ ...inputs, open: true });
  };

  const handleClose = () => {
    setInputs({ ...inputs, open: false });
  };

  const onSubmit = async () => {
    await dispatch(delKey({ key: selectKey }));
    handleClose();
    await dispatch(scanKeys());
  };

  return (
    <Fragment>
      <Tooltip TransitionComponent={Zoom} title="Delete Key">
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={handleClickOpen}
        >

          <DeleteOutlineIcon color={selectKey ? 'primary' : 'disabled'} />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-del-key"
      >
        <DialogTitle id="form-dialog-del-key">Delete Key</DialogTitle>
        <DialogContent className={classes.form}>
          <DialogContentText>
            Are you sure you want to delete?
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={onSubmit}
              >
                OK
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
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

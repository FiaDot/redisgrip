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
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Zoom from '@material-ui/core/Zoom';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import DeleteSweepOutlinedIcon from '@material-ui/icons/DeleteSweepOutlined';
import Paper from '@material-ui/core/Paper';
import { useSelector } from 'react-redux';

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

export default function DelKeyDialog(props) {
  const classes = useStyles();

  const { redis, onRefresh } = props;

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
    console.log(`onSubmit`);

    const ret = await redis.del(selectKey);
    console.log(ret);

    if (ret === 1 ) {
      onRefresh();
      handleClose();
    } else {
      // TODO : show error!!!
    }
  };

  return (
    <Fragment>
      <Tooltip TransitionComponent={Zoom} title="Delete Key">
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={handleClickOpen}
        >
          <DeleteSweepOutlinedIcon color={selectKey ? 'primary' : 'disabled'} />
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

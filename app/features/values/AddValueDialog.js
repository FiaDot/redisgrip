import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Zoom from '@material-ui/core/Zoom';
import AddIcon from '@material-ui/icons/Add';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import { addSubKey } from '../servers/selectedSlice';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Popup from '../popup/Popup';
import { showPopup } from '../popup/popupSlice';
import { useSnackbar } from 'notistack';


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
  fab: {
    // position: 'absolute',
    // bottom: theme.spacing(2),
    // right: theme.spacing(2),
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    top: 'auto',
    bottom: 10,
    width: `calc(100% - 80%)`,
    backgroundColor: theme.palette.background.paper,
  },
  // appBarIcon: {
  //   color: 'red',
  // },
}));


export default function AddValueDialog() {
  const classes = useStyles();

  const dispatch = useDispatch();
  const selectKey = useSelector((state) => state.selected.selectKey);
  const selectType = useSelector((state) => state.selected.selectType);
  const selectSubKey = useSelector((state) => state.selected.selectSubKey);

  const { enqueueSnackbar } = useSnackbar();

  const initialState = {
    open: false,
    key: '',
    val: '',
  };

  const [inputs, setInputs] = useState(initialState);
  // const [inputs, setInputs] = useState({
  //   open: false,
  //   key: '',
  //   val: '',
  // });

  const { open, key, val } = inputs;

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
    setInputs({ ...initialState });
    //setInputs({ ...inputs, open: false });
  };

  const onSubmit = async () => {
    if (selectType === 'zset') {
      // console.log(`AddValueDialog type=${selectType},key=${key},val=${val}`);

      if (!Number.isInteger(val)) {
        // console.log('not integer');
        enqueueSnackbar('Score must be a number.', { variant: 'error', autoHideDuration: 2000 });
        return;
      }
    }

    const ret = await dispatch(
      addSubKey({ mainKey: selectKey, type: selectType, key, val })
    );

    console.log(`onSubmit ${key} ${val} ret=${ret}`);

    setInputs({ ...inputs, key: '' });
    setInputs({ ...inputs, val: '' });
    handleClose();
  };

  const getValueName = () => {
    // TODO : memo

    switch (selectType) {
      case 'string':
      case 'list':
      case 'hash':
      case 'set':
        return 'Value';
      case 'zset':
        return 'Score';
      default:
        console.log('type is wrong');
    }
    return 'wrong';
  };

  const needKey = () => {
    // TODO : memo

    switch (selectType) {
      case 'string':
      case 'list':
      case 'set':
        return false;

      case 'hash':
      case 'zset':
        return true;

      default:
        console.log('type is wrong');
    }
    return false;
  };

  const ShowButton = (isDisabled) => {
    return (
      <Tooltip TransitionComponent={Zoom} title="Add">
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={isDisabled ? null : handleClickOpen}
        >
          <AddIcon color={isDisabled ? 'disabled' : 'primary'} />
        </IconButton>
      </Tooltip>
    );
  };

  const ShowTitle = (text) => {
    return <DialogTitle id="form-dialog-add-sub-key">{text}</DialogTitle>;
  };

  return (
    <>
      {ShowButton(selectType === 'string')}

      <Popup />

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-edit-sub-key"
      >
        {ShowTitle(`Add ${selectType} record`)}

        <DialogContent className={classes.form}>
          <DialogContentText>{/* New Key... */}</DialogContentText>

          {needKey() ? (
            <TextField
              autoFocus
              size="small"
              variant="outlined"
              margin="normal"
              label="Name"
              name="key"
              value={key}
              onChange={onChange}
              fullWidth
              autoFocus
              className={classes.formSpecing}
            />
          ) : (
            ''
          )}

          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            label={getValueName()}
            name="val"
            value={val}
            onChange={onChange}
            fullWidth
            autoFocus
            className={classes.formSpecing}
          />
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
    </>
  );
}

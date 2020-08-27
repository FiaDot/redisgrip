import React, { Fragment, useState } from 'react';
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
import RemoveOutlinedIcon from '@material-ui/icons/RemoveOutlined';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { addSubKey, delSubKey, editSubKey } from '../servers/selectedSlice';

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

const initialState = {
  open: false,
  key: '',
  val: '',
};

export default function EditValueDialog() {
  const classes = useStyles();

  const dispatch = useDispatch();
  const selectKey = useSelector((state) => state.selected.selectKey);
  const selectType = useSelector((state) => state.selected.selectType);
  const selectSubKey = useSelector((state) => state.selected.selectSubKey);

  const [inputs, setInputs] = useState(initialState);

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
    // setInputs({ ...inputs, open: false });
  };

  const onSubmit = async () => {
    let ret = '';
    const state = { mainKey: selectKey, type: selectType, key: selectSubKey, val };

    console.log(`EditValueDialog ${selectType} ${JSON.stringify(state)}`);

    switch (selectType) {
      case 'string':
      case 'hash':
        ret = await dispatch(editSubKey(state));
        break;

      case 'list':
        ret = await dispatch(editSubKey(state));
        break;

      case 'set':
        ret = await dispatch(editSubKey(state));
        break;

      case 'zset':
        ret = await dispatch(editSubKey(state));
        break;

      default:
    }

    console.log(`onSubmit ${key} ${val} ret=${ret}`);
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

  // const needKey = () => {
  //   // TODO : memo
  //
  //   switch (selectType) {
  //     case 'string':
  //     case 'list':
  //     case 'set':
  //     case 'zset':
  //       return false;
  //
  //     case 'hash':
  //       return false;
  //
  //     default:
  //       console.log('type is wrong');
  //   }
  //   return false;
  // };

  const ShowButton = (isDisabled) => {
    return (
      <Tooltip TransitionComponent={Zoom} title="Edit">
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={isDisabled ? null : handleClickOpen}
        >
          <EditOutlinedIcon color={isDisabled ? 'disabled' : 'primary'} />
        </IconButton>
      </Tooltip>
    );
  };

  const ShowTitle = (text) => {
    return <DialogTitle id="form-dialog-add-sub-key">{text}</DialogTitle>;
  };

  return (
    <>
      {/* eslint-disable-next-line no-nested-ternary */}
      {selectType === 'string'
        ? ShowButton(false)
        : selectSubKey === null
        ? ShowButton(true)
        : ShowButton(false)}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-edit-sub-key"
      >
        {ShowTitle(
          selectType === 'string' ? 'Edit String' : 'Edit Sub Key/Value'
        )}

        <DialogContent className={classes.form}>
          <DialogContentText>{/* New Key... */}</DialogContentText>

          {/*{needKey() ? (*/}
          {/*  <TextField*/}
          {/*    autoFocus*/}
          {/*    size="small"*/}
          {/*    variant="outlined"*/}
          {/*    margin="normal"*/}
          {/*    label="Name"*/}
          {/*    name="key"*/}
          {/*    value={key}*/}
          {/*    onChange={onChange}*/}
          {/*    fullWidth*/}
          {/*    autoFocus*/}
          {/*    className={classes.formSpecing}*/}
          {/*  />*/}
          {/*) : (*/}
          {/*  ''*/}
          {/*)}*/}

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

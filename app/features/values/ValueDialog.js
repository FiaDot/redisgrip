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
import { addSubKey, delSubKey } from '../servers/selectedSlice';

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
    //position: 'absolute',
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

export default function ValueDialog(props) {
  const classes = useStyles();
  const { redis } = props;

  const dispatch = useDispatch();
  const selectKey = useSelector((state) => state.selected.selectKey);
  const selectType = useSelector((state) => state.selected.selectType);
  const selectSubKey = useSelector((state) => state.selected.selectSubKey);

  const [inputs, setInputs] = useState({
    open: false,
    key: '',
    val: '',
  });

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
    setInputs({ ...inputs, open: false });
  };

  const onDeleteSubKey = async () => {
    console.log(`onDeleteSubKey ${selectKey} ${selectType} ${selectSubKey}`);

    const ret = await dispatch(
      delSubKey({ mainKey: selectKey, type: selectType, key: selectSubKey })
    );

    console.log(`onDeleteSubKey ${ret}`);
    handleClose();

    // let ret = 'OK';
    //
    // // showModel( {
    // //   title: 'delete',
    // //   button: 'Delete',
    // //   content: 'are you sure?'
    // // }).then() => {
    // //   console.log('ok');
    // // }
    // switch (selectType) {
    //   // case 'string':
    //   //   ret = await redis.set(selectKey, val);
    //   //   break;
    //   // case 'list':
    //   //   //ret = await redis.lremindex(selectKey, index);
    //   //   break;
    //   case 'hash':
    //     ret = await redis.hdel(selectKey, selectSubKey);
    //     break;
    //   case 'set':
    //     ret = await redis.srem(selectKey, selectSubKey);
    //     break;
    //   case 'zset':
    //     ret = await redis.zrem(selectKey, selectSubKey);
    //     break;
    //   default:
    //     console.log('type is wrong');
    //     return;
    // }
    //
    // console.log(ret);
    //
    // if (ret > 0 || ret == 'OK') {
    //   // TODO : scan();
    //   // complete
    // } else {
    //   // TODO : show error!!!
    // }
  };

  const onEditSubKey = () => {
    console.log(`onEditSubKey ${selectKey} ${selectType} ${selectSubKey}`);
  };

  const onSubmit = async () => {
    console.log(`onSubmit ${key} ${val}`);

    const ret = await dispatch(
      addSubKey({ mainKey: selectKey, type: selectType, key, val })
    );

    console.log(`onSubmit ${ret}`);

    handleClose();

    // let ret = 'OK';
    //
    // switch (selectType) {
    //   case 'string':
    //     ret = await redis.set(selectKey, val);
    //     break;
    //   case 'list':
    //     ret = await redis.lpush(selectKey, val);
    //     break;
    //   case 'hash':
    //     ret = await redis.hset(selectKey, key, val);
    //     break;
    //   case 'set':
    //     ret = await redis.sadd(selectKey, val);
    //     break;
    //   case 'zset':
    //     ret = await redis.zadd(selectKey, val, key);
    //     break;
    //   default:
    //     console.log('type is wrong');
    //     return;
    // }
    //
    // console.log(ret);

    // if (ret > 0 || ret == 'OK') {
    //   // TODO : scan();
    //   handleClose();
    // } else {
    //   // TODO : show error!!!
    // }
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



  const ValueAppBar = () => {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <AppBar position="fixed" className={classes.appBar}>
        <div>
          {/* Add */}
          <Tooltip TransitionComponent={Zoom} title="Add">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={handleClickOpen}
            >
              <AddIcon color="primary" />
            </IconButton>
          </Tooltip>

          {/* Del */}
          <Tooltip TransitionComponent={Zoom} title="Delete">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={onDeleteSubKey}
            >
              <RemoveOutlinedIcon color="primary" />
            </IconButton>
          </Tooltip>

          {/* Edit */}
          <Tooltip TransitionComponent={Zoom} title="Edit">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={onEditSubKey}
            >
              <EditOutlinedIcon color="primary" />
            </IconButton>
          </Tooltip>
        </div>
      </AppBar>
    );
  }

  return (
    <Fragment>
      {ValueAppBar()}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-add-sub-key"
      >
        <DialogTitle id="form-dialog-add-sub-key">
          Add Sub Key/Value
        </DialogTitle>
        <DialogContent className={classes.form}>
          <DialogContentText>{/* New Key... */}</DialogContentText>

          {needKey() ?
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
              className={classes.formSpecing}
            />
            : ''
          }

          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            label={getValueName()}
            name="val"
            value={val}
            onChange={onChange}
            fullWidth
            className={classes.formSpecing}
          />
        </DialogContent>
        <DialogActions>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                startIcon={<AddCircleIcon/>}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={onSubmit}
              >
                Add
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                startIcon={<CancelIcon/>}
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

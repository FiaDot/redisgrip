import React, { useState } from 'react';
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
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
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
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default function AddKeyValueDialog(props) {
  const classes = useStyles();
  const { redis } = props;

  const selectKey = useSelector((state) => state.selected.selectKey);
  const selectType = useSelector((state) => state.selected.selectType);

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

  const onSubmit = async () => {
    console.log(`onSubmit ${key} ${val}`);

    let ret = 'OK';

    switch (selectType) {
      case 'string':
        ret = await redis.set(selectKey, val);
        break;
      case 'list':
        ret = await redis.lpush(selectKey, val);
        break;
      case 'hash':
        ret = await redis.hset(selectKey, key, val);
        break;
      case 'set':
        ret = await redis.sadd(selectKey, val);
        break;
      case 'zset':
        ret = await redis.zadd(selectKey, val, key);
        break;
      default:
        console.log('type is wrong');
        return;
    }

    console.log(ret);

    if (ret > 0 || ret == 'OK') {
      // TODO : scan();
      handleClose();
    } else {
      // TODO : show error!!!
    }
  };

  const getValueName = () => {
    console.log(selectType);

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

  return (
    <>
      <Tooltip TransitionComponent={Zoom} title="Add Key">
        <Fab
          color="primary"
          aria-label="add"
          className={classes.fab}
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

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

          { needKey() ?
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

import React, { useState } from 'react';
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

export default function AddKeyDialog(props) {
  const classes = useStyles();

  const { redis, onRefresh } = props;

  const [inputs, setInputs] = useState({
    open: false,
    type: 'string',
    key: '',
  });

  const { open, type, key } = inputs;

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
    console.log(`onSubmit ${type} ${key}`);

    let ret;

    switch ( type )
    {
      case 'string':
        ret = await redis.set(key, '');
        break;
      case 'list':
        ret = await redis.lpush(key, '');
        break;
      case 'hash':
        ret = await redis.hset(key, '', '');
        break;
      case 'set':
        ret = await redis.sadd(key, '');
        break;
      case 'zset':
        ret = await redis.zadd(key, 0, '');
        break;
    }

    console.log(ret);

    if (ret === 'OK') {
      onRefresh();
      handleClose();
    } else {
      // TODO : show error!!!
    }
  };

  return (
    <>
      <Tooltip TransitionComponent={Zoom} title="Add Key">
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={handleClickOpen}
        >
          <PostAddOutlinedIcon color="primary" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-addkey"
      >
        <DialogTitle id="form-dialog-addkey">Add Key</DialogTitle>
        <DialogContent className={classes.form}>
          <DialogContentText>{/* New Key... */}</DialogContentText>


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

          <FormControl component="fieldset">
            <FormLabel component="legend">Type</FormLabel>
            <RadioGroup
              aria-label="type"
              name="type"
              value={type}
              onChange={onChange}
            >
              <FormControlLabel value="string" control={<Radio />} label="String"/>
              <FormControlLabel value="hash" control={<Radio />} label="Hash" />
              <FormControlLabel value="list" control={<Radio />} label="List" />
              <FormControlLabel value="set" control={<Radio />} label="Set" />
              <FormControlLabel value="zset" control={<Radio />} label="Sorted Set"/>
            </RadioGroup>
          </FormControl>

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

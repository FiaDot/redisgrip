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

  const [inputs, setInputs] = useState({
    open: false,
    type: 'String',
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

  // const [open, setOpen] = React.useState(false);
  // const [type, setType] = React.useState('String');

  // const handleChange = (event) => {
  //   setType(event.target.value);
  // };

  const handleClickOpen = () => {
    setInputs({ ...inputs, open: true });
  };

  const handleClose = () => {
    setInputs({ ...inputs, open: false });
  };

  const onSubmit = () => {
    console.log(`TODO : add key ${type} ${key}`);
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
              <FormControlLabel
                value="String"
                control={<Radio />}
                label="String"
              />
              <FormControlLabel value="Hash" control={<Radio />} label="Hash" />
              <FormControlLabel value="List" control={<Radio />} label="List" />
              <FormControlLabel value="Set" control={<Radio />} label="Set" />
              <FormControlLabel
                value="Sorted Set"
                control={<Radio />}
                label="Sorted Set"
              />
            </RadioGroup>
          </FormControl>

          {/* <InputLabel id="add-key-type">Type</InputLabel> */}
          {/* <Select */}
          {/*  labelId="add-key-type" */}
          {/*  id="add-key-type" */}
          {/*  value={type} */}
          {/*  onChange={handleChangeType} */}
          {/*  fullWidth */}
          {/* > */}
          {/*  <MenuItem value={'String'}>String</MenuItem> */}
          {/*  <MenuItem value={'Hash'}>Hash</MenuItem> */}
          {/*  <MenuItem value={'List'}>List</MenuItem> */}
          {/*  <MenuItem value={'Set'}>Set</MenuItem> */}
          {/*  <MenuItem value={'Sorted Set'}>Sorted Set</MenuItem> */}
          {/* </Select> */}
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

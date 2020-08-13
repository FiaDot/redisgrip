import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { addString } from './stringContentSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.default,
  },
  button: {
    margin: theme.spacing(0),
    // backgroundColor: '#0000cc',
    // borderColor: '#005cbf',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    fontSize: 14,
  },
  textField: {
    width: '80%',
    margin: theme.spacing(2),
  },
}));

export default function StringContent() {
  const classes = useStyles();

  // const stringContent = useSelector((state) => state.stringContent.content);

  const dispatch = useDispatch();
  const onAddString = (value) => dispatch(addString(value));

  // const [val, setVal] = useState();
  //
  // const onChangeValue = (newVal) => {
  //   setVal(newVal);
  // };

  const addStringTest = (key, value) => {
      dispatch(addString({key, value}));
  };

  return (
    <div>

      {/*<Typography variant="h6" component="h1">*/}
      {/*  Type : String*/}
      {/*</Typography>*/}
      {/*<Typography>Because this is the life you love!</Typography>*/}

      <IconButton
        variant="contained"
        className={classes.button}
        onClick={(e) => addStringTest('ab','ff1')}
      >
        <ClearAllIcon className={classes.buttonIcon} color="secondary" />
      </IconButton>

      <IconButton
        variant="contained"
        className={classes.button}
        onClick={(e) => addStringTest('a','ee2')}
      >
        <ClearAllIcon className={classes.buttonIcon} color="secondary" />
      </IconButton>

      <IconButton
        variant="contained"
        className={classes.button}
        onClick={(e) => addStringTest('b','ww3')}
      >
        <ClearAllIcon className={classes.buttonIcon} color="secondary" />
      </IconButton>

      {/*{!stringContent ? '' :*/}
      {/*  <TextField*/}
      {/*    className={classes.textField}*/}
      {/*    id="outlined-multiline-static"*/}
      {/*    label="String"*/}
      {/*    multiline*/}
      {/*    rows={4}*/}
      {/*    variant="outlined"*/}
      {/*    value={stringContent}*/}
      {/*    // onChange={(e) => {*/}
      {/*    //   onChangeValue(e.target.value);*/}
      {/*    // }}*/}
      {/*  />*/}
      {/*}*/}
    </div>
  );
}

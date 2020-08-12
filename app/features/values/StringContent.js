import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { addString } from './stringContentSlice';
import Typography from '@material-ui/core/Typography';

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

  const stringContent = useSelector((state) => state.stringContent.content);

  const dispatch = useDispatch();
  const onAddString = (value) => dispatch(addString(value));

  // const [val, setVal] = useState();
  //
  // const onChangeValue = (newVal) => {
  //   setVal(newVal);
  // };

  return (
    <div>

      {/*<Typography variant="h6" component="h1">*/}
      {/*  Type : String*/}
      {/*</Typography>*/}
      {/*<Typography>Because this is the life you love!</Typography>*/}

      {!stringContent ? '' :
        <TextField
          className={classes.textField}
          id="outlined-multiline-static"
          label="String"
          multiline
          rows={4}
          variant="outlined"
          value={stringContent}
          // onChange={(e) => {
          //   onChangeValue(e.target.value);
          // }}
        />
      }
    </div>
  );
}

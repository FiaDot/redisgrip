import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import Typography from '@material-ui/core/Typography';
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

  const selectKey = useSelector((state) => state.selected.selectKey);
  const stringRecords = useSelector((state) => state.stringContent.records);

  const dispatch = useDispatch();
  const onAddString = (value) => dispatch(addString(value));

  // const [val, setVal] = useState();
  //
  // const onChangeValue = (newVal) => {
  //   setVal(newVal);
  // };

  const addStringTest = (key, value) => {
    dispatch(addString({ key, value }));
  };

  const showValues = (key, history) => (
    // TODO : key가 들어가야 에러가 안난다... 넣었을때 고유번호 같은걸 하나 넣어야 할듯!!
    <Typography
      className={classes.title}
      color="textSecondary"
      align="center"
      key={`${key}_${history.no}`}
    >
      {history.no} {history.value} {history.time}
    </Typography>
  );

  return (
    <div>
      {/* <Typography variant="h6" component="h1"> */}
      {/*  Type : String */}
      {/* </Typography> */}
      {/* <Typography>Because this is the life you love!</Typography> */}

      <IconButton
        variant="contained"
        className={classes.button}
        onClick={(e) => addStringTest('ab', 'ff1')}
      >
        <ClearAllIcon className={classes.buttonIcon} color="secondary" />
      </IconButton>

      <IconButton
        variant="contained"
        className={classes.button}
        onClick={(e) => addStringTest('a', 'ee2')}
      >
        <ClearAllIcon className={classes.buttonIcon} color="secondary" />
      </IconButton>

      <IconButton
        variant="contained"
        className={classes.button}
        onClick={(e) => addStringTest('string_test', 'ww3')}
      >
        <ClearAllIcon className={classes.buttonIcon} color="secondary" />
      </IconButton>

      {
        stringRecords.map((record) => (

          record.key === selectKey ?
            record.values.map((valueRecord) => (
                showValues(record.key, valueRecord)
            ))
            : ''
        ))
      }
    </div>
  );
}

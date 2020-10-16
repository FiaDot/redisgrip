import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import { addString, clearAllString, clearString } from './stringContentSlice';
import useValueStyles from './ValueStyle';
import TimeNoComponent from './TimeNoComponent';
import ValueDialog from './ValueDialog';
import { UnControlled as CodeMirror } from 'react-codemirror2';


export default function StringContent() {
  const classes = useValueStyles();

  const selectKey = useSelector((state) => state.selected.selectKey);
  const stringRecords = useSelector((state) => state.stringContent.records);

  const dispatch = useDispatch();

  const addStringTest = (key, value) => {
    dispatch(addString({ key, value }));
  };


  const showHistoryValues = (key, value) => (
    <div className={classes.paper} key={`${key}_${value.no}`}>
      <TimeNoComponent time={value.time} no={value.no} />

      <Paper elevation={3}>
        <Typography>{value.value}</Typography>
      </Paper>
    </div>
  );

  const showValues = (key, value) => (
    <div className={classes.paper} key={`${key}_${value.no}`}>
      <TimeNoComponent time={value.time} no={value.no} />

      <Paper elevation={3}>
        <CodeMirror
          value={value.value}
          options={{
            mode: 'jsx',
            theme: 'darcula',
            lint: true,
            gutters: ['CodeMirror-lint-json'],
            lineNumbers: true,
            readOnly: true,
            showCursorWhenSelecting: false,
          }}
          onChange={(editor, data, value) => {
          }}
        />

      </Paper>
    </div>
  );

  return (
    <div>
      {stringRecords.map((record) =>
        record.key === selectKey
          ? record.values.map((valueRecord, index) =>
            index === 0
              ? showValues(record.key, valueRecord)
              : showHistoryValues(record.key, valueRecord)
            )
          : ''
      )}

      <ValueDialog />

      {/* 디버깅용 */}
      {/* <Tooltip TransitionComponent={Zoom} title="clearAllString"> */}
      {/*  <IconButton */}
      {/*    variant="contained" */}
      {/*    className={classes.button} */}
      {/*    onClick={(e) => dispatch(clearAllString())} */}
      {/*  > */}
      {/*    <ClearAllIcon className={classes.buttonIcon} color="secondary" /> */}
      {/*  </IconButton> */}
      {/* </Tooltip> */}

      {/* <Tooltip TransitionComponent={Zoom} title="clearString"> */}
      {/*  <IconButton */}
      {/*    variant="contained" */}
      {/*    className={classes.button} */}
      {/*    onClick={(e) => dispatch(clearString('string_test'))} */}
      {/*  > */}
      {/*    <ClearAllIcon className={classes.buttonIcon} color="secondary" /> */}
      {/*  </IconButton> */}
      {/* </Tooltip> */}

      {/* <Tooltip TransitionComponent={Zoom} title="addString"> */}
      {/*  <IconButton */}
      {/*    variant="contained" */}
      {/*    className={classes.button} */}
      {/*    onClick={(e) => addStringTest('string_test', 'ww3')} */}
      {/*  > */}
      {/*    <ClearAllIcon className={classes.buttonIcon} color="secondary" /> */}
      {/*  </IconButton> */}
      {/* </Tooltip> */}
    </div>
  );
}

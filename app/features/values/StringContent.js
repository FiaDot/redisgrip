import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import Typography from '@material-ui/core/Typography';
import { addString, clearAllString, clearString } from './stringContentSlice';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import useValueStyles from './ValueStyle';
import TimeNoComponent from './TimeNoComponent';
import ValueDialog from './ValueDialog';

export default function StringContent(props) {
  const classes = useValueStyles();
  const { redis } = props;

  const selectKey = useSelector((state) => state.selected.selectKey);
  const stringRecords = useSelector((state) => state.stringContent.records);

  const dispatch = useDispatch();

  const addStringTest = (key, value) => {
    dispatch(addString({ key, value }));
  };


  const showValues = (key, value) => (
    // TODO : key가 들어가야 에러가 안난다... 넣었을때 고유번호 같은걸 하나 넣어야 할듯!!
    // <Typography
    //   className={classes.title}
    //   color="textSecondary"
    //   align="center"
    //   key={`${key}_${history.no}`}
    // >
    //   {history.no} {history.value} {history.time}
    // </Typography>
    <div className={classes.paper} key={`${key}_${value.no}`}>
      <TimeNoComponent time={value.time} no={value.no} />

      <Paper elevation={3}>
          <Typography>{value.value}</Typography>
        </Paper>
    </div>
  );

  return (
    <div>

      {
        stringRecords.map((record) => (

          record.key === selectKey ?
            record.values.map((valueRecord) => (
                showValues(record.key, valueRecord)
            ))
            : ''
        ))
      }

      <ValueDialog redis={redis} />


      {/* 디버깅용 */}
      <Tooltip TransitionComponent={Zoom} title="clearAllString">
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={(e) => dispatch(clearAllString())}
        >
          <ClearAllIcon className={classes.buttonIcon} color="secondary" />
        </IconButton>
      </Tooltip>

      <Tooltip TransitionComponent={Zoom} title="clearString">
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={(e) => dispatch(clearString('string_test'))}
        >
          <ClearAllIcon className={classes.buttonIcon} color="secondary" />
        </IconButton>
      </Tooltip>

      <Tooltip TransitionComponent={Zoom} title="addString">
        <IconButton
          variant="contained"
          className={classes.button}
          onClick={(e) => addStringTest('string_test', 'ww3')}
        >
          <ClearAllIcon className={classes.buttonIcon} color="secondary" />
        </IconButton>
      </Tooltip>

    </div>
  );
}

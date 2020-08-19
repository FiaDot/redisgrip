import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import useValueStyles from './ValueStyle';
import TimeNoComponent from './TimeNoComponent';
import ValueDialog from './ValueDialog';
import { selectSubKey } from '../servers/selectedSlice';

export default function ZsetContent(props) {
  const classes = useValueStyles();
  const { redis } = props;

  const records = useSelector((state) => state.zsetContent.records);

  const dispatch = useDispatch();
  const selectedSubKey = useSelector((state) => state.selected.selectSubKey);

  const handleClick = (event, name) => {
    dispatch(selectSubKey(name));
  };

  const isSelected = (name) => {
    return selectedSubKey === name;
  };

  const showHistoryRecord = (key, value) => (
    <TableRow key={key}>
      <TableCell component="th" scope="row">
        {key}
      </TableCell>

      <TableCell align="left">{value}</TableCell>
    </TableRow>
  );

  // {key, values:[{no, time, hash:[{key,value}]}]
  const showRecord = (key, value) => (
    <TableRow
      hover
      onClick={(event) => handleClick(event, key)}
      key={key}
      selected={isSelected(key)}
    >
      <TableCell component="th" scope="row">
        {key}
      </TableCell>

      <TableCell align="left">{value}</TableCell>
    </TableRow>
  );

  const showKey = (key, value, showTableRecord) => (
    <div key={value.time} className={classes.paper}>
      <Divider className={classes.divider} />

      <TimeNoComponent time={value.time} no={value.no} />

      <TableContainer component={Paper} key={`${key}_${value.no}`}>
        <Table
          stickyHeader
          className={classes.table}
          size="small"
          aria-label="zset table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell align="left">Score</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {value.table.map((kv) => showTableRecord(kv.key, kv.value))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  return (
    <div className={classes.root}>
      {records.map((record) =>
        record.values.map((value, index) =>
          showKey(
            record.key,
            value,
            index === 0 ? showRecord : showHistoryRecord
          )
        )
      )}

      <ValueDialog />
    </div>
  );
}

import React from 'react';
import { useSelector } from 'react-redux';
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

export default function ListContent(props) {
  const classes = useValueStyles();
  const { redis } = props;
  const records = useSelector((state) => state.listContent.records);

  // {key, values:[{no, time, hash:[{key,value}]}]
  const showRecord = (index, value) => (
    <TableRow key={`${index}_${value}`}>
      <TableCell component="th" scope="row">
        {index}
      </TableCell>
      <TableCell align="left">
        {value}
      </TableCell>
    </TableRow>
  );

  const showKey = (key, value) => (
    <div key={value.time} className={classes.paper}>
      <Divider className={classes.divider} />

      <TimeNoComponent time={value.time} no={value.no} />

      <TableContainer component={Paper} key={`${key}_${value.no}`}>

        <Table stickyHeader className={classes.table} size="small" aria-label="list table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell align="left">Value</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {value.table.map((kv, index) => showRecord(index, kv.value))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );

  return (
    <div className={classes.root}>
      { records.map((record) =>
          record.values.map((value) =>
            showKey(record.key, value)
          )
      )}

      <ValueDialog redis={redis} />
    </div>
  );
}

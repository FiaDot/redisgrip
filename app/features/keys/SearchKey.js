import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    padding: '3px',
    display: 'flex',
    alignItems: 'center',
    width: '95%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 2,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function SearchKey() {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      {/*<IconButton className={classes.iconButton} aria-label="menu">*/}
      {/*  <VpnKeyOutlinedIcon />*/}
      {/*</IconButton>*/}
      <InputBase
        className={classes.input}
        placeholder="Search key"
        inputProps={{ 'aria-label': 'search key' }}
      />
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

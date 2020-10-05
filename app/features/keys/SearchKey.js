import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import BackspaceOutlinedIcon from '@material-ui/icons/BackspaceOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { scanKeys } from './keysSlice';
import Zoom from '@material-ui/core/Zoom';
import Tooltip from '@material-ui/core/Tooltip';

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
  const dispatch = useDispatch();

//  const pattern = useSelector((state) => state.selectdSlice.matchPattern);

  const initialState = {
    matchPattern: '*',
  };

  const [inputs, setInputs] = useState(initialState);
  const { matchPattern } = inputs;

  const search = () => {
    console.log(`search ${matchPattern}`);

    // TODO : fetch search field
    // TODO : store match pattern
    // run scan pattern
    dispatch(scanKeys(matchPattern));
  };

  const clear = () => {
    setInputs({ ...initialState });
    console.log(`clear ${matchPattern}`);

    dispatch(scanKeys());
  };


  const onChange = (e) => {
    const { name, value } = e.target;

    console.log(`onChange ${value}`);

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const keyPress = (e) => {
    // enter
    if(e.keyCode === 13){
      e.preventDefault();
      console.log('enter key value', e.target.value);
      setInputs({ ...inputs, matchPattern: e.target.value });
      search();
      return;
    }

    // esc
    if ( e.keyCode === 27 ) {
      e.preventDefault();
      console.log('esc key value', e.target.value);
      clear();
      return;
    }
  };

  return (
    <Paper component="form" className={classes.root}>
      {/* 앞에 흰색 키 아이콘 */}
      {/*<IconButton className={classes.iconButton} aria-label="menu">*/}
      {/*  <VpnKeyOutlinedIcon />*/}
      {/*</IconButton>*/}
      <Tooltip TransitionComponent={Zoom} title="glob-style pattern">
        <InputBase
          className={classes.input}
          placeholder="Search key"
          inputProps={{ 'aria-label': 'search key' }}
          name="matchPattern"
          value={matchPattern}
          onChange={onChange}
          onKeyDown={keyPress}
        />
      </Tooltip>

      <Divider className={classes.divider} orientation="vertical" />
      <Tooltip TransitionComponent={Zoom} title="Search">
        <IconButton
          // type="submit"
          className={classes.iconButton}
          aria-label="search"
          onClick={search}
        >
          <SearchIcon color='primary' />
        </IconButton>
      </Tooltip>

      <Divider className={classes.divider} orientation="vertical" />
      <Tooltip TransitionComponent={Zoom} title="Reset pattern">
        <IconButton
          className={classes.iconButton}
          aria-label="clear"
          onClick={clear}
        >
          <BackspaceOutlinedIcon color='primary' />
        </IconButton>
      </Tooltip>
    </Paper>
  );
}

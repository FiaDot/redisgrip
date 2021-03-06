import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import { exportKeys, importKeys, scanKeys } from './keysSlice';
import { selectKey } from '../servers/selectedSlice';
import SearchKey from './SearchKey';
import AddKeyDialog from './AddKeyDialog';
import DelKeyDialog from './DelKeyDialog';
import Badge from '@material-ui/core/Badge';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import GroupKeys from './GroupKeys';
import MigrationToolbar from './MigrationToolbar';
import SystemUpdateAltOutlinedIcon from '@material-ui/icons/SystemUpdateAltOutlined';
import BackupOutlinedIcon from '@material-ui/icons/BackupOutlined';
import Box from '@material-ui/core/Box';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import VGroupKeys from './VGroupKeys';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // width: 500,
    //maxWidth: 360,
    backgroundColor: theme.palette.background.default,
    //overflowY: 'scroll',
  },
  //button: {
  //   margin: theme.spacing(0),
  //   // backgroundColor: '#0000cc',
  //   // borderColor: '#005cbf',
  // },
  // paper: {
  //   display: 'flex',
  //   flexWrap: 'wrap',
  //   '& > *': {
  //     margin: theme.spacing(1),
  //     width: theme.spacing(32),
  //     height: theme.spacing(6),
  //     //minWidth: 250,
  //     backgroundColor: theme.palette.background.paper,
  //   },
  // },
  // title: {
  //   fontSize: 14,
  // },
  paper: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    // display: 'flex',
    // flexWrap: 'wrap',
    // '& > *': {
    //   margin: theme.spacing(1),
    //   width: theme.spacing(32),
    //   height: theme.spacing(6),
    //   minWidth: 300,
    //   backgroundColor: theme.palette.background.paper,
    // },
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 25,
    top: 1,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);
//
// const NormalItem = (key, onSelectKey, selectedKey) = (
//   <ListItem
//     button
//     selected={selectedKey === key.key}
//     key={key.key}
//     onClick={(event) => onSelectKey(key.key)}
//   >
//     <StyledBadge badgeContent={key.count} max={9} color="secondary">
//       {/*<Badge color="primary" variant="dot" invisible={false}>*/}
//       <VpnKeyOutlinedIcon
//         color={key.delete ? 'secondary' : 'primary'}
//         style={{ paddingRight: 10, fontSize: 32 }}
//       />
//       {/*</Badge>*/}
//     </StyledBadge>
//     <ListItemText primary={key.key} />
//   </ListItem>
// );




const KeysMemo = React.memo(function keys({ keys, onSelectKey, selectedKey }) {
  return (
    <div>
      {keys.map((key) => (
        <Grid container spacing={0} key={key.key}>
          <Grid item xs={12}>
            {/*{NormalItem(key, onSelectKey, selectedKey)}*/}

            {key.deleted ?
              <ListItem
                key={key.key}
              >
                <StyledBadge badgeContent={0} max={9} color="secondary">
                  {/*<Badge color="primary" variant="dot" invisible={false}>*/}
                  <DeleteForeverOutlinedIcon
                    color={"secondary"}
                    style={{ paddingRight: 10, fontSize: 32 }}
                  />
                  {/*</Badge>*/}
                </StyledBadge>
                <ListItemText primary={key.key + ' [DELETED]'} />
              </ListItem>
              :
              <ListItem
                button
                selected={selectedKey === key.key}
                key={key.key}
                onClick={(event) => onSelectKey(key.key)}
              >
                <StyledBadge badgeContent={key.count} max={9} color="secondary">
                  {/*<Badge color="primary" variant="dot" invisible={false}>*/}
                  <VpnKeyOutlinedIcon
                    color={key.delete ? 'secondary' : 'primary'}
                    style={{ paddingRight: 10, fontSize: 32 }}
                  />
                  {/*</Badge>*/}
                </StyledBadge>
                <ListItemText primary={key.key}/>
              </ListItem>
            }
            {/*<Divider variant="middle" component="li" />*/}
          </Grid>
        </Grid>
      ))}
    </div>
  );
});

export default function Keys() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const keys = useSelector((state) => state.keys);
  const selectedKey = useSelector((state) => state.selected.selectKey);
  const countKey = useSelector((state) => state.selected.countKey);

  const initialState = {
    group: false,
  };

  const [inputs, setInputs] = useState(initialState);

  const { group } = inputs;

  const handleChange = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.checked });
    console.log(`group=${group}`);
  };


  const onSelectKey = async (key) => {
    await dispatch(selectKey({ key }));
  };

  // const onExportKeysTest = async () => {
  //   dispatch(
  //     exportKeys({
  //       filename: '/Users/newtrocode/Downloads/dump.txt',
  //       match: '*',
  //     })
  //   );
  // };
  //
  // const onImportKeysTest = async () => {
  //   dispatch(
  //     importKeys({
  //       filename: '/Users/newtrocode/Downloads/dump.txt'
  //     })
  //   );
  // };

  const scan = async () => {
    await dispatch(scanKeys());
  };

  // const Row = memo(({ data, index, style }) => {
  // });

  const renderKeys = React.memo(({ data, index, style }) => {
  // function renderKeys(props) {
  // const { index, style } = props;
    const { wrapKeys } = data;
    const key = wrapKeys[index];
    // const key = keys[index];

    return (
      <ListItem
        button
        style={style}
        key={key.key}
        selected={key.deleted ? false : selectedKey === key.key}
        onClick={(event) => {
          key.deleted ? null : onSelectKey(key.key)
        }}
      >
        <StyledBadge badgeContent={key.deleted ? 0 : key.count} max={9} color="secondary">
          { key.deleted ?
              <DeleteForeverOutlinedIcon
                color={"secondary"}
                style={{ paddingRight: 10, fontSize: 32 }}
              />
              :
              <VpnKeyOutlinedIcon
                color={'primary'}
                style={{ paddingRight: 10, fontSize: 32 }}
              />
          }
        </StyledBadge>
        <ListItemText
          primary={`${key.key}${key.deleted ? " [DELETED]" : ""}`} />
      </ListItem>
    );
  });

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Typography
        className={classes.title}
        color="textSecondary"
        gutterBottom
        align="center"
      >
        Keys ({countKey})
      </Typography>

      <div className={classes.paper}>
        <Paper elevation={3}>

          {/* Export */}
          {/*<Tooltip TransitionComponent={Zoom} title="Export">*/}
          {/*  <IconButton*/}
          {/*    variant="contained"*/}
          {/*    className={classes.button}*/}
          {/*    onClick={(event) => onExportKeys()}*/}
          {/*  >*/}
          {/*    <BackupOutlinedIcon color="primary" />*/}
          {/*  </IconButton>*/}
          {/*</Tooltip>*/}

          {/* Import */}
          {/*<Tooltip TransitionComponent={Zoom} title="Import">*/}
          {/*  <IconButton*/}
          {/*    variant="contained"*/}
          {/*    className={classes.button}*/}
          {/*    onClick={(event) => onImportKeys()}*/}
          {/*  >*/}
          {/*    <SystemUpdateAltOutlinedIcon color="primary" />*/}
          {/*  </IconButton>*/}
          {/*</Tooltip>*/}



          {/* Refresh */}
          <Tooltip TransitionComponent={Zoom} title="Refresh">
            <IconButton
              variant="contained"
              className={classes.button}
              onClick={(event) => scan()}
            >
              <RefreshOutlinedIcon color="primary" />
            </IconButton>
          </Tooltip>

          {/* Add Key */}
          <AddKeyDialog />


          {/* Del key */}
          <DelKeyDialog />

          {/* Trace key : TODO : IMPL */}
          {/*<Tooltip TransitionComponent={Zoom} title="Trace Key">*/}
          {/*  <IconButton*/}
          {/*    variant="contained"*/}
          {/*    className={classes.button}*/}
          {/*    onClick={null}*/}
          {/*  >*/}
          {/*    <TrackChangesOutlinedIcon color={'disabled'} />*/}
          {/*  </IconButton>*/}
          {/*</Tooltip>*/}

          <FormControlLabel
            control={
              <Switch
                checked={group}
                onChange={handleChange}
                color="primary"
                name="group"
              />
            }
            label={
              <Box component="div" fontSize={12}>
                Group
              </Box>
            }
            labelPlacement="start"
          />
        </Paper>
      </div>

      {/* Search bar */}
      <SearchKey />

      {/* Key List */}
      {/*{group*/}
      {/*  ?*/}
      {/*    <GroupKeys />*/}
      {/*  :*/}
      {/*    <List component="nav" aria-label="keys">*/}
      {/*      {*/}
      {/*        keys.length <= 0*/}
      {/*          ? ''*/}
      {/*          : <KeysMemo keys={keys} onSelectKey={onSelectKey} selectedKey={selectedKey} />*/}
      {/*      }*/}
      {/*    </List>*/}
      {/*}*/}

      { group ?
          <VGroupKeys />
          :
          keys.length <= 0 ?
            ''
            :
            <div style = {{height:'70vh'}}>
              <AutoSizer>
                {({ height, width }) => (
                  <FixedSizeList
                    height={height}
                    width={width}
                    itemSize={40}
                    itemCount={keys.length}
                    itemData={{ wrapKeys: keys }}
                  >
                    {renderKeys}
                  </FixedSizeList>
                )}
              </AutoSizer>
            </div>
      }



      <MigrationToolbar />
    </div>
  );
}

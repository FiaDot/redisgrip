import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import SystemUpdateAltOutlinedIcon from '@material-ui/icons/SystemUpdateAltOutlined';
import BackupOutlinedIcon from '@material-ui/icons/BackupOutlined';
import fs from 'fs';
const {dialog} = require('electron').remote;

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 'auto',
    bottom: 10,
    width: `calc(100% - 50%)`,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function MigrationToolbar() {
  const classes = useStyles();

  const onExport = () => {
    console.log('onExport');

    // try {
    //   fs.writeFileSync('myfile.txt', 'the text to write in the file', 'utf-8');
    // }
    // catch(e) {
    //   console.log(`write file error=${e}`);
    //   //alert('Failed to save the file !');
    // }
    //

    // TODO : file name generator
    var options = {
      title: 'Save Dump File',
      defaultPath: 'my_filename',
      buttonLabel: 'Save',
      filters: [
        { 'name': 'RedisGrip Dump', extensions: ['rgd',]},
      ],
    };

    dialog.showSaveDialog(options).then(file => {
      if ( !file.canceled ) {
        console.log(file.filePath.toString());
        fs.writeFileSync(file.filePath.toString(), 'hello world', 'utf-8');
      }
    });
  };

  const onImport = () => {
    console.log('onImport');
  };


  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <AppBar position="fixed" className={classes.appBar}>
      <div>
        <Tooltip TransitionComponent={Zoom} title="Export">
          <IconButton
            variant="contained"
            className={classes.button}
            onClick={onExport}
          >
            <BackupOutlinedIcon color={'primary'} />
          </IconButton>
        </Tooltip>

        <Tooltip TransitionComponent={Zoom} title="Import">
          <IconButton
            variant="contained"
            className={classes.button}
            onClick={onImport}
          >
            <SystemUpdateAltOutlinedIcon color={'primary'} />
          </IconButton>
        </Tooltip>
      </div>
    </AppBar>
  );
}

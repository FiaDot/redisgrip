import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import IconButton from '@material-ui/core/IconButton';
import SystemUpdateAltOutlinedIcon from '@material-ui/icons/SystemUpdateAltOutlined';
import BackupOutlinedIcon from '@material-ui/icons/BackupOutlined';
import fs from 'fs';
import { useDispatch } from 'react-redux';
import { exportKeys, importKeys } from './keysSlice';
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
  const dispatch = useDispatch();

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
      defaultPath: '',
      buttonLabel: 'Save',
      filters: [
        { 'name': 'RedisGrip Dump', extensions: ['rgd',]},
      ],
    };

    dialog.showSaveDialog(options).then(async (file) => {
      if ( !file.canceled ) {
        console.log(file.filePath.toString());
        //fs.writeFileSync(file.filePath.toString(), 'hello world', 'utf-8');

        dispatch(
          exportKeys({ filename: file.filePath.toString(), match: '*' })
        );
      }
    });
  };

  const onImport = () => {
    console.log('onImport');

    // TODO : file name generator
    var options = {
      title: 'Load Dump File',
      defaultPath: '',
      buttonLabel: 'Load',
      filters: [
        { 'name': 'RedisGrip Dump', extensions: ['rgd',]},
      ],
    };

    // TODO : load file path, overwrite option!
    dialog.showOpenDialog(options).then(file => {
      // fileNames is an array that contains all the selected
      if(file === undefined){
        console.log('No file selected');
        return;
      }

      // fs.readFile(file.filePaths[0].toString(), 'utf-8', (err, data) => {
      //   if(err){
      //     alert('An error ocurred reading the file :' + err.message);
      //     return;
      //   }
      //
      //   // Change how to handle the file content
      //   console.log('The file content is : ' + data);
      // });

      dispatch(
        importKeys({
          filename: file.filePaths[0].toString()
        })
      );

    });

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

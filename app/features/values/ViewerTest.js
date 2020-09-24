import React from 'react';
//import {Controlled as CodeMirror} from 'react-codemirror2'
import {UnControlled as CodeMirror} from 'react-codemirror2'
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('codemirror/addon/lint/json-lint');
require('codemirror/addon/lint/lint');


export default function ViewerTest() {

  return (
    <CodeMirror
      value='<h1>I ♥ react-codemirror2</h1>'
      options={{
        mode: 'xml',
        theme: 'material',
        lineNumbers: true,
        readOnly: true,
        showCursorWhenSelecting: false,
      }}
      onChange={(editor, data, value) => {
      }}
    />
  );
}

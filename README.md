# bpmn-js-native-copy-paste

[![CI](https://github.com/nikku/bpmn-js-native-copy-paste/actions/workflows/CI.yml/badge.svg)](https://github.com/nikku/bpmn-js-native-copy-paste/actions/workflows/CI.yml)

Copy and paste for [bpmn-js](https://github.com/bpmn-io/bpmn-js) implemented using the native operating system clipboard. Also, works across browser and application windows.


## Features

* copy and paste using the system clipboard
* works between different BPMN modeler instances
* works across browser windows
* disables built-in `clipboard`
* works in modern browsers


## Usage

```javascript
import NativeCopyPaste from 'bpmn-js-native-copy-paste';

const modeler = new BpmnModeler({
  additionalModules: [
    NativeCopyPasteModule
  ]
});

await modeler.importXML(require('./ticket-booking.bpmn'));
```


## How it Works

It relies on the bpmn-js copy tree to be serializable to JSON. When re-creating the tree from JSON we use a [reviver](https://github.com/nikku/bpmn-js-native-copy-paste/blob/main/lib/PasteUtil.js#L15) to re-construct the model types.


## Build and Run

```sh
# install dependencies
npm install

# run development setup
npm run dev
```

Open multiple instances of the [test site](http://localhost:9876/debug.html) and copy/paste across.


## License

MIT

:heart:

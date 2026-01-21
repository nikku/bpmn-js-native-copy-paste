# bpmn-js-native-copy-paste

[![CI](https://github.com/nikku/bpmn-js-native-copy-paste/actions/workflows/CI.yml/badge.svg)](https://github.com/nikku/bpmn-js-native-copy-paste/actions/workflows/CI.yml)

Copy and paste for [bpmn-js](https://github.com/bpmn-io/bpmn-js) implemented using the native operating system clipboard. As a result, copy and paste works across browser tabs, windows and applications that build on top of the web platform.


## Features

* copy and paste using the [system clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
* works between different BPMN modeler instances
* works across browser windows
* works in modern browsers
* disables built-in `clipboard`


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

We use the [clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) to read from and write to the operating system clipboard.

During copy we serialize the copy tree to JSON, when re-creating the tree from JSON we use a [reviver](https://github.com/nikku/bpmn-js-native-copy-paste/blob/main/lib/PasteUtil.js#L15) to re-construct the model types.

The standard paste mechanics implemented by [bpmn-js](https://github.com/bpmn-io/bpmn-js) discard [BPMN moddle](https://github.com/bpmn-io/bpmn-moddle) extensions unknown in the target context. This is _by design_, to prevent polution of users diagrams. 

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

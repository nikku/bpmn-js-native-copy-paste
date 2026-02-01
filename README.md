# bpmn-js-native-copy-paste

[![CI](https://github.com/nikku/bpmn-js-native-copy-paste/actions/workflows/CI.yml/badge.svg)](https://github.com/nikku/bpmn-js-native-copy-paste/actions/workflows/CI.yml)

Copy and paste for [bpmn-js](https://github.com/bpmn-io/bpmn-js) implemented using the native operating system clipboard. As a result, copy and paste works across browser tabs, windows and applications that build on top of the web platform.


## Features

* copy and paste using the [system clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
* works in [modern browsers](https://caniuse.com/async-clipboard)
* works between different BPMN modeler instances
* works across browser windows
* disables built-in `clipboard`


## Usage

> [!NOTE]
> Interaction with the clipboard requires user interaction/confirmation, cf. [security considerations](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#security_considerations). You can [fallback to the local clipboard](#graceful-fallback) if access is rejected.

Include [bpmn-js-native-copy-paste](https://github.com/nikku/bpmn-js-native-copy-paste) as a module to use the system clipboard:

```javascript
import NativeCopyPasteModule from 'bpmn-js-native-copy-paste';

const modeler = new BpmnModeler({
  additionalModules: [
    NativeCopyPasteModule
  ]
});

await modeler.importXML(require('./ticket-booking.bpmn'));
```

#### Graceful fallback

When access to the system clipboard is rejected you can fallback to local copy and paste:

```javascript
const eventBus = modeler.get('eventBus');
const nativeCopyPaste = modeler.get('nativeCopyPaste');

eventBus.on('native-copy-paste:error', ({ message, error }) => {

  // toggle off
  nativeCopyPaste.toggle(false);
});
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

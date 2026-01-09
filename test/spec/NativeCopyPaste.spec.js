import TestContainer from 'mocha-test-container-support';

import {
  domify,
  query as domQuery
} from 'min-dom';

import fileDrop from 'file-drops';

import fileOpen from 'file-open';

import download from 'downloadjs';

import BpmnModeler from 'bpmn-js/lib/Modeler';

import ZeebeBehaviors from 'camunda-bpmn-js-behaviors/lib/camunda-cloud';

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  ZeebePropertiesProviderModule
} from 'bpmn-js-properties-panel';

import ZeebeModdlePackage from 'zeebe-bpmn-moddle/resources/zeebe';

import NativeCopyPasteModule from '../..';

import { insertCSS } from '../helper';

import diagramCSS from 'bpmn-js/dist/assets/diagram-js.css';
import bpmnCSS from 'bpmn-js/dist/assets/bpmn-js.css';
import fontCSS from 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import propertiesPanelCSS from '@bpmn-io/properties-panel/dist/assets/properties-panel.css';
import fileDropsCSS from './file-drops.css';

insertCSS('diagram-js.css', diagramCSS);

insertCSS('bpmn-js.css', bpmnCSS);

insertCSS('bpmn-font.css', fontCSS);

insertCSS('properties.css', propertiesPanelCSS);

insertCSS('file-drops.css', fileDropsCSS);

insertCSS('test', `
.test-container {
  height: auto !important;
  position: relative;
}

.test-container .test-content-container {
  height: 600px !important;
  display: flex;
}

.test-buttons {
  position: absolute;
  bottom: 20px;
  left: 20px;
}

.bio-properties-panel-container {
  width: 300px;
  order: 1;
  border-left: solid 1px hsl(225, 10%, 75%);
}
`);


describe('NativeCopyPaste', function() {

  it('should copy and paste manually', async function() {

    // given
    const container = TestContainer.get(this);

    const modeler = new BpmnModeler({
      container,
      additionalModules: [
        NativeCopyPasteModule,
        ZeebeBehaviors,
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        ZeebePropertiesProviderModule
      ],
      moddleExtensions: {
        zeebe: ZeebeModdlePackage
      },
      propertiesPanel: {
        parent: container
      }
    });

    const {
      openDiagram
    } = setupTest(modeler);

    const {
      copyButton,
      pasteButton
    } = createButtons(container);

    copyButton.addEventListener('click', function() {
      modeler.get('editorActions').trigger('copy');
    });

    pasteButton.addEventListener('click', function() {
      modeler.get('editorActions').trigger('paste');
    });

    await openDiagram('./ticket-booking.bpmn', require('./ticket-booking.bpmn'));
  });

});


// helpers ///////////

function createButtons(container) {

  const buttonsHtml = domify(`<div class="test-buttons">
    <button data-test-id="copy-button">copy</button>
    <button data-test-id="paste-button">paste</button>
  </div>`);

  const copyButton = domQuery('[data-test-id=copy-button]', buttonsHtml);
  const pasteButton = domQuery('[data-test-id=paste-button]', buttonsHtml);

  container.appendChild(buttonsHtml);

  return {
    copyButton,
    pasteButton
  };
}


function setupTest(modeler) {

  let currentFileName;

  function openDiagram(fileName, diagram) {

    currentFileName = fileName;

    return modeler.importXML(diagram)
      .then(({ warnings }) => {
        if (warnings.length) {
          console.warn(warnings);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  function openFile(files) {

    // files = [ { name, contents }, ... ]

    if (!files.length) {
      return;
    }

    openDiagram(files[0].name, files[0].contents);
  }

  document.body.addEventListener('dragover', fileDrop('Open BPMN diagram', openFile), false);

  function downloadDiagram() {
    modeler.saveXML({ format: true }, function(err, xml) {
      if (!err) {
        download(xml, currentFileName, 'application/xml');
      }
    });
  }

  document.body.addEventListener('keydown', function(event) {
    if (event.code === 'KeyS' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();

      downloadDiagram();
    }

    if (event.code === 'KeyO' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();

      fileOpen().then(openFile);
    }
  });

  return {
    openDiagram
  };
}
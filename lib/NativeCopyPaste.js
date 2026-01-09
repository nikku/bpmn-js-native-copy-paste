import {
  createReviver
} from './PasteUtil.js';


const HIGHER_PRIORITY = 2050;

const PREFIX = 'bpmn-js-clip----';

/**
 * An extension that adds browser native copy + paste
 * to an existing bpmn-js instance.
 *
 * Contents of the diagram will be pushed into the
 * system clipboard instead of the local clipboard and read from the
 * system clipboard during paste.
 *
 * Integrates with both API (triggered through user actions, following
 * standard browser security practices) and keyboard shortcuts.
 */
export default class NativeCopyPaste {

  constructor(
      eventBus, copyPaste, moddle
  ) {

    if (typeof navigator.clipboard === 'undefined') {
      return;
    }

    eventBus.on('copyPaste.elementsCopied', HIGHER_PRIORITY, function(context) {

      if (context.hints?.clip !== false) {

        // populate global clipboard
        navigator.clipboard.writeText(PREFIX + JSON.stringify(context.tree)).then(() => {
          console.log('[native-copy-paste]', 'clipboard', 'written');
        }).catch(err => {
          console.error('[native-copy-paste]', 'failed to populate global clipboard', err);
        });

        // prevent further clipboard integration
        context.hints.clip = false;
      }
    });

    eventBus.on('copyPaste.pasteElements', HIGHER_PRIORITY, function(context) {
      if (context.tree) {
        return;
      }

      const contextCopy = { ...context };

      // (1) restore from global clipboard,
      // (3) then re-trigger paste (with context)
      navigator.clipboard.readText().then(text => {

        if (!text?.startsWith(PREFIX)) {
          return;
        }

        console.log('[native-copy-paste]', 'clipboard', 'read');

        const tree = JSON.parse(text.substring(PREFIX.length), createReviver(moddle));

        copyPaste.paste({
          ...contextCopy,
          tree
        });
      }).catch(err => {
          console.error('[native-copy-paste]', 'failed to paste from global clipboard', err);
      });

      // (2) prevent the first paste attempt
      return false;
    });
  }
}

NativeCopyPaste.$inject = [
  'eventBus',
  'copyPaste',
  'moddle'
];
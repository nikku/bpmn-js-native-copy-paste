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

    this._eventBus = eventBus;

    this._handleCopied = (context) => {
      if (context.hints?.clip !== false) {

        // populate global clipboard
        navigator.clipboard.writeText(PREFIX + JSON.stringify(context.tree)).catch(err => {
          this._handleError('failed to populate clipboard', err);
        });

        // prevent further clipboard integration
        context.hints.clip = false;
      }
    };

    this._handlePaste = (context) => {
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

        const tree = JSON.parse(text.substring(PREFIX.length), createReviver(moddle));

        copyPaste.paste({
          ...contextCopy,
          tree
        });
      }).catch(err => {
        this._handleError('failed to paste from clipboard', err);
      });

      // (2) prevent the first paste attempt
      return false;
    };

    this._handleError = (message, error) => {
      console.error('[native-copy-paste]', message, error);

      this._eventBus.fire('native-copy-paste:error', { message, error });
    }

    // enable depending on `navigator.clipboard` availability
    this.toggle(typeof navigator.clipboard !== 'undefined');
  }

  /**
   * Enable or disable native copy and paste.
   *
   * @param {boolean} active
   */
  toggle(active) {

    if (this._active === active) {
      return;
    }

    if (active) {
      this._eventBus.on('copyPaste.elementsCopied', HIGHER_PRIORITY, this._handleCopied);
      this._eventBus.on('copyPaste.pasteElements', HIGHER_PRIORITY, this._handlePaste);
    } else {
      this._eventBus.off('copyPaste.elementsCopied', this._handleCopied);
      this._eventBus.off('copyPaste.pasteElements', this._handlePaste);
    }

    this._active = active;
  }

}

NativeCopyPaste.$inject = [
  'eventBus',
  'copyPaste',
  'moddle'
];
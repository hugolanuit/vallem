/**
 * Barba plugin : Dom-Controller
 *
 * Handles UI and Modules classes init-destroy-restart
 * with Barba available hooks
 *
 * Example :
 *
 * <div data-ui="site-nav"></div>
 * <div data-module="my-module"></div>
 *
 * Eelement can cast 1 or multiple class, each seperated by a coma.
 *
 * <div data-ui="site-nav,foo-bar"></div>
 *
 * The data-module or data-ui value `my-module-name` is transformed to PascalCase `MyModuleName`, this should match your class static name
 *
 * Example :
 *
 * <div data-module="my-module-name"></div>
 *
 * Located in /src/modules/my-module-name/index.js
 *
 * Inside this class, you must use the PascalCase format or the class won't init :
 *
 * get name() {
 *  return `MyModuleName`;
 * }
 *
 * @module barba-plugin
 * @preferred
 */

import EventEmitter2 from "eventemitter2";

import { STATE } from "./core/state";
// import { PascalCase } from "./utils/string";

const VERSION = `0.0.1`;

const MODULES_SELECTOR = `[data-module]`;
const UI_SELECTOR = `[data-ui]`;

export class DomController {
  constructor(init = true) {
    this.name = "@mill3/dom-controller";
    this.version = VERSION;
    this.barba;
    this.logger;

    this._parser;

    // holder for all future class initialisation
    this._chunks = [];

    // global emitter sent to class on initialisation
    this._emitter = null;

    if(init) this.init();
  }

  /**
  * Plugin installation.
  */
  init() {
    this._parser = new DOMParser();
    this._emitter = new EventEmitter2({
      wildcard: true,
    });

    // attach emitter globally to browser Window
    window._emitter = this._emitter;
  }

  run(source) {
    this._importChunks(source).then(() => {
      this._initModules();
      this._startModules();
    })
  }

  /**
  * after run() has imported all modules
  */
  _initModules() {
    // Run init() func from all chunks
    Object.keys(this._chunks).forEach((m) => {
      if (typeof this._chunks[m].start === `function`) this._chunks[m].init();
    });
  }

  _stopModules() {
    // Stop all chunks with a stop() func
    Object.keys(this._chunks).forEach((m) => {
      if (typeof this._chunks[m].stop === `function`) this._chunks[m].stop();
    });

    // reset state to defaults
    STATE.dispatch("RESET");
  }

  _destroyModules() {
    // Remove and destroy all chunks with a destroy() func
    Object.keys(this._chunks).forEach((m) => {
      if (typeof this._chunks[m].destroy !== `function`) return;
      this._chunks[m].destroy();
      delete this._chunks[m];
    });
  }

  _startModules() {
    // Run start() func from all chunks
    Object.keys(this._chunks).forEach((m) => {
      if (typeof this._chunks[m].start === `function`) this._chunks[m].start();
    });
  }

  /**
   * the module importer, look for data-module entries in DOM source
   */
   _importChunks(source) {
    let elements = [...source.querySelectorAll(MODULES_SELECTOR), ...source.querySelectorAll(UI_SELECTOR)];

    const promises = [];

    // import each module as a webpack chunk
    elements.forEach((el) => {
      // for storing each chunk attached to element
      let chunks = [];

      // get data and module or ui chunk type
      // element should be : <div data-module="my-module"> or <div data-ui="my-ui-js-thing">
      const { initialized, module, ui } = el.dataset;

      // stop here if already initialized
      if (initialized === `true`) return;

      // set element initialized
      el.dataset.initialized = true;

      // element can cast 1 or multiple chunk module, each seperated by a coma
      if (module) chunks = chunks.concat(module.split(",").map((m) => m));
      if (ui) chunks = chunks.concat(ui.split(",").map((m) => m));

      // try to load each module attached
      chunks.forEach((chunk) => {
        const promise = this._importChunk(chunk);
        if (promise) promises.push(promise);
      });
    });

    return Promise.all(promises);
  }

  _importChunk(name) {
    // return if module already loaded
    if (this._chunks[name]) return;

    // create a dummy object during module loading to prevent multiple request for the same module
    // that way, we also assure key names ordering is preserve in this._chunks
    this._chunks[name] = {};

    // import module with webpack
    // console.log(name);

    const promise = import(`./ui/site-scroll`);

    // when loading is completed
    promise.then((chunk) => {
      const { instance } = chunk.default;

      // push instance to all modules
      if (instance) this._chunks[name] = instance;

      // attach emitter to instance
      instance.emitter = this._emitter;

      // attach state
      instance.state = STATE;

      // attach state
      instance.dispatcher = this._dispatcher;
    });

    promise.catch((e) => {
      console.error("Error loading webpack chunk :", e);
    });

    return promise;
  }


}

export default DomController;

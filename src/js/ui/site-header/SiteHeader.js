import { $ } from "../../utils/dom";
import EventEmitter2 from "eventemitter2";

import { on, off } from "../../utils/listener";

export const SELECTOR = "[data-site-header]";

class SiteHeader extends EventEmitter2 {
  constructor() {
    super();
    
    this.initialized = false;
    this.el = $(SELECTOR);


    this._headerInvert = this._headerInvert.bind(this);

    this.init();
  }

  get name() {
    return `SiteHeader`;
  }

  init() {
    // this.initialized = true;

    this._bindEvents();
  }

  _bindEvents(){
    on(`SiteScroll.header-invert`, this. _headerInvert);
  }

  _unbindEvents(){
    off(`SiteScroll.header-invert`, this. _headerInvert);
  }

  _headerInvert(){
    debugger;
  }

  destroy() {
    this._unbindEvents();

    this.el = null;
    this.initialized = false;
  }
}

export default SiteHeader;

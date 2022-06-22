import { $, $$, rect } from "../../utils/dom";
import { on, off } from "../../utils/listener";
import { sleep } from '../../utils/sleep';

const SELECTOR_CLOSE_BUTTON = `.trailer-player__closeButton`;
const SELECTOR_VIDEO = `.trailer-player__wrap__video`;

class TrailerPlayer {
  constructor(el, emitter) {
    this.emitter = emitter;
    this.el = el;

    this.closeButton = $(SELECTOR_CLOSE_BUTTON, this.el);
    this.video = $(SELECTOR_VIDEO, this.el);
    this.triggers = [...$$(`[aria-controls="${this.el.id}"]`)];

    this.videoCreated = false;

    this._open = this._open.bind(this);
    this._close = this._close.bind(this);
    this._createVideo = this._createVideo.bind(this);
    this._removeVideo = this._removeVideo.bind(this);

    this.init();
  }

  init() {
    // stop here if no embed
    if(!this.video) return;

    this._bindEvents();
  }

  destroy() {
    this._unbindEvents();

    this.el = null;
  }

  _bindEvents() {
    if( this.triggers ) on(this.triggers, 'click', this._open);
    if( this.closeButton ) on(this.closeButton, 'click', this._close);
  }
  _unbindEvents() {
    if( this.triggers ) off(this.triggers, 'click', this._open);
    if( this.closeButton ) off(this.closeButton, 'click', this._close);
  }

  _open(){
    this._createVideo();
    this.el.setAttribute("aria-hidden", false);
    this.emitter.emit('SiteScroll.stop');
  }

  _close(){
    this.el.setAttribute("aria-hidden", true);

    sleep(650).then(() => { 
      this._removeVideo();
      this.emitter.emit('SiteScroll.start');
    });
  }

  // search for a script containing iframe markup code
  _createVideo() {
    this._videoCreated = true;

    const target = this.video;
    const template = $('script[name="video-embeded"]', this.element);

    target.innerHTML = template.innerHTML;
  }

  _removeVideo() {
    this._videoCreated = false;
    this.video.innerHTML = "";
  }

}

export default TrailerPlayer;

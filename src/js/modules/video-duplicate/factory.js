import { $$ } from "../../utils/dom";

import Module from "../module/Module";
import VideoDuplicate from "./VideoDuplicate";

export const SELECTOR = `canvas[data-video-duplicate]`;

class Factory extends Module {
  constructor(init = false) {
    super();

    this.initialized = false;
    this.items = null;

    this._onScrollCall = this._onScrollCall.bind(this);
    this._onOutroEnter = this._onOutroEnter.bind(this);
    this._onMaskAnimationReady = this._onMaskAnimationReady.bind(this);
    this._onHeroExit = this._onHeroExit.bind(this);

    init ? this.init() : null;
  }

  get name() {
    return "VideoDuplicate";
  }

  init() {
    // set initialized
    this.initialized = true;
    this.items = [...$$(SELECTOR)].map(el => new VideoDuplicate(el, this.emitter));

    this._bindEvents();
  }
  destroy() {
    this._unbindEvents();

    if (this.items) this.items.forEach(el => el.destroy());

    this.initialized = false;
    this.items = null;
  }

  _bindEvents() {
    if (this.emitter) {
      this.emitter.on(`SiteScroll.video-duplicate`, this._onScrollCall);
      this.emitter.on(`SiteScroll.video-duplicate-outro-enter`, this._onOutroEnter);
      this.emitter.on(`SiteScroll.video-duplicate-mask-animation-ready`, this._onMaskAnimationReady);
      this.emitter.on(`SiteScroll.video-duplicate-hero-exit`, this._onHeroExit);
    }
  }
  _unbindEvents() {
    if (this.emitter) {
      this.emitter.off(`SiteScroll.video-duplicate`, this._onScrollCall);
      this.emitter.off(`SiteScroll.video-duplicate-outro-enter`, this._onOutroEnter);
      this.emitter.off(`SiteScroll.video-duplicate-mask-animation-ready`, this._onMaskAnimationReady);
      this.emitter.off(`SiteScroll.video-duplicate-hero-exit`, this._onHeroExit);
    }
  }
  _onScrollCall(direction, { el }) {
    if (!this.items) return;

    const video = this.items.find(video => video.el === el);
    if (!video) return;

    // TODO: check if video is visible before calling is method (for responsive viewports)
    video[direction === "enter" ? "play" : "pause"]();
  }
  _onOutroEnter(direction) {
    if (this.items) this.items.forEach(video => video.mask = direction === 'enter');
  }
  _onMaskAnimationReady(direction) {
    if (this.items && direction === 'enter') this.items.forEach(video => video.animateMask());
  }
  _onHeroExit(direction) {
    if (this.items && direction === 'exit') this.items.forEach(video => video.mask = false);
  }
}

export default Factory;

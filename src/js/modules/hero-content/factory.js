import { $$ } from "../../utils/dom";

import { mobile } from "../../utils/mobile";
import Module from "../module/Module";
import HeroContent from "./HeroContent";

export const SELECTOR = `[data-hero-content]`;

class Factory extends Module {
  constructor(init = false) {
    super();

    this.initialized = false;
    this.items = null;

    this._skipOutroExit = false;
    this._siteReady = false;
    this._siteReadyHeroContent = null;

    this._onSiteReady = this._onSiteReady.bind(this);
    this._onHero = this._onHero.bind(this);
    this._onOutro = this._onOutro.bind(this);
    this._onOutroMobile = this._onOutroMobile.bind(this);
    this._onLoop = this._onLoop.bind(this);

    init ? this.init() : null;
  }

  get name() {
    return "HeroContent";
  }

  init() {
    // set initialized
    this.initialized = true;
    this.items = [...$$(SELECTOR)].map(el => new HeroContent(el));

    this.emitter.on('SITE_READY', this._onSiteReady);
    this.emitter.on('SiteScroll.loop', this._onLoop);
    this.emitter.on('SiteScroll.hero-content-hero', this._onHero);

    if( !mobile ) this.emitter.on('SiteScroll.hero-content-outro', this._onOutro);
    else this.emitter.on('SiteScroll.hero-content-outro-mobile', this._onOutroMobile);
  }

  _onSiteReady() {
    this._siteReady = true;
    
    if( this._siteReadyHeroContent ) this._siteReadyHeroContent.enter();
    this._siteReadyHeroContent = null;
  }
  _onHero(direction, obj) {
    // if not entering viewport, do nothing
    if( direction !== 'enter' ) return;

    // if event is related to this child, start animation
    this.items.forEach(heroContent => {
      if( heroContent.el === obj.el ) {
        if( this._siteReady ) heroContent.enter();
        else this._siteReadyHeroContent = heroContent;
      }
    });
  }
  _onOutro(direction) {
    if( direction === 'enter' ) this.items.forEach(heroContent => heroContent.enter());
    else {
      if( !this._skipOutroExit ) this.items.forEach(heroContent => heroContent.exit());
      this._skipOutroExit = false;
    }
  }
  _onOutroMobile(direction, obj) {
    // if not entering viewport, do nothing
    if( direction !== 'enter' ) return;

    // if event is related to this child, start animation
    this.items.forEach(heroContent => {
      if( heroContent.el === obj.el ) heroContent.enter();
    });
  }
  _onLoop() {
    this._skipOutroExit = true;
  }
}

export default Factory;

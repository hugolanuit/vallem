import anime from "animejs";

import { $, rect } from "../../utils/dom";
import { on, off } from "../../utils/listener";
import ResizeOrientation from "../../utils/resize";

const MASK_ANIMATION_DURATION = 1250;

class VideoDuplicate {
  constructor(el, emitter) {
    this.el = el;
    this.emitter = emitter;
    this.video = $(this.el.dataset.videoDuplicate);

    this._animation = { y: 1, radius: 1 };
    this._ctx = this.el.getContext('2d', {alpha: false});
    this._data = null;
    this._mask = null;
    this._playing = false;
    this._playPromise = null;
    this._raf = null;
    this._videoPlaying = false;

    this._onResize = this._onResize.bind(this);
    this._onMetadata = this._onMetadata.bind(this);
    this._onVideoPlay = this._onVideoPlay.bind(this);
    this._onVideoPause = this._onVideoPause.bind(this);
    this._onAnimationCompleted = this._onAnimationCompleted.bind(this);
    this._onRAF = this._onRAF.bind(this);

    this.init();
  }

  init() {
    this.ro = new ResizeOrientation(this._onResize);
    this.ro.run();

    this.tween = anime({
      targets: this._animation,
      y: [1, 0],
      radius: {
        value: [1, 0],
        duration: MASK_ANIMATION_DURATION + 300,
      },
      duration: MASK_ANIMATION_DURATION,
      easing: 'easeInOutCubic',
      autoplay: false,
      complete: this._onAnimationCompleted,
    });

    this._bindEvents();
  }
  destroy() {
    this._unbindEvents();

    if( this.ro ) this.ro.dispose();

    this.el = null;
    this.emitter = null;
    this.video = null;
    this.ro = null;

    this._ctx = null;
    this._data = null;
    this._mask = null;
    this._playing = null;
    this._playPromise = null;
    this._raf = null;
    this._videoPlaying = null;

    this._onResize = null;
    this._onMetadata = null;
    this._onVideoPlay = null;
    this._onVideoPause = null;
    this._onRAF = null;
  }
  play(force = false) {
    // if module is already playing, do nothing
    if( this._playing && !force ) return;
    this._playing = true;

    // if video does'nt exist, do nothing
    if( !this.video ) return;

    // start playback, if playback not already requested, and clear promise when done
    if( this.video && !this._playPromise) {
      this._playPromise = this.video.play().finally(() => {
        this._playPromise = null;
      });
    }

    // start updating canvas
    if( !this._raf ) this._onRAF();
  }
  pause() {
    // if module is not playing, do nothing
    if( !this._playing ) return;
    this._playing = false;

    // if video does'nt exist, do nothing
    if( !this.video ) return;

    // if a play promise exists, wait promise.resolve to pause playback
    // otherwise, pause immediatly
    if (this._playPromise) {
      this._playPromise.then(() => {
        if( this.video ) this.video.pause();
      });
    } else {
      if( this.video ) this.video.pause();
    }

    // stop updating canvas
    if( this._raf ) cancelAnimationFrame(this._raf);
    this._raf = null;
  }
  animateMask() {
    this.tween.restart();
  }

  _bindEvents() {
    on(this.video, 'loadedmetadata', this._onMetadata);
    on(this.video, 'playing', this._onVideoPlay);
    on(this.video, 'pause', this._onVideoPause);

    this.ro.on();
  }
  _unbindEvents() {
    off(this.video, 'loadedmetadata', this._onMetadata);
    off(this.video, 'playing', this._onVideoPlay);
    off(this.video, 'pause', this._onVideoPause);

    this.ro.off();

    // stop updating canvas
    if( this._raf ) cancelAnimationFrame(this._raf);
    this._raf = null;
  }

  _onResize() {
    const canvasRect = rect(this.el);
    const dpr = window.devicePixelRatio || 1;

    this._data = {
      canvas: {
        width: canvasRect.width,
        height: canvasRect.height,
        dpr: dpr,
      },
      video: {
        width: this.video.width,
        height: this.video.height,
        ratio: this.video.width / this.video.height,
      },
      mask: {
        //y: canvasRect.height - 124,
        y: canvasRect.height * 0.5,
        height: Math.round(canvasRect.height * 1.2),
        radius: Math.min(485, canvasRect.height * 0.5),
        progress: 0,
      },
    };

    //--------------
    // calculate math for recreating background-size: cover; when drawing video into canvas
    const { canvas, video } = this._data;
    let ratio = canvas.width / canvas.height, 
        sx = 0, 
        sy = 0, 
        sw = video.width, 
        sh = video.width / ratio;

    // if capture's height is smaller than video's height, crop video vertically
    if( sh < video.height ) sy = (video.height - sh) * 0.5;
    else {
      // otherwise, it means capture's height is bigger than video's height
      // so, we need to set capture's height to video's height
      sh = video.height;

      // then, calculate capture's width relative to ratio
      sw = video.height * ratio;

      // then, crop video horizontally
      sx = (video.width - sw) * 0.5;
    }

    this._data.cover = {
      x: sx,
      y: sy,
      width: sw,
      height: sh,
    };
    //--------------

    // resize canvas element
    this.el.width = canvas.width * dpr;
    this.el.height = canvas.height * dpr;

    // scale canvas depending on screen resolution
    this._ctx.scale(dpr, dpr);
  }
  _onMetadata() { if( this._playing ) this.play(true); }
  _onVideoPlay() { this._videoPlaying = true; }
  _onVideoPause() { this._videoPlaying = false; }
  _onAnimationCompleted() {
    // reset mask
    this._mask = false;

    // reset animation
    this._animation.y = 1;
    this._animation.radius = 1;
  }
  _onRAF() {
    if( this._videoPlaying ) {
      const { canvas, cover, mask } = this._data;

      this._ctx.drawImage(
        this.video, 
        cover.x, cover.y, cover.width, cover.height, 
        0, 0, canvas.width, canvas.height
      );

      if( this._mask ) {
        const { width } = canvas;
        const { height } = mask;

        const y = mask.y * this._animation.y;
        const radius = mask.radius * this._animation.radius;

        this._ctx.beginPath();
        this._ctx.fillStyle = '#181B1D';
        //this._ctx.fillStyle = '#ff0000'; // for debugging

        // start from bottom left of canvas
        this._ctx.moveTo(0, y + height);

        // rounded rectangle's left edge
        this._ctx.lineTo(0, y + radius);

        // rounded rectangle's top-left corner
        this._ctx.bezierCurveTo(
          0, y + radius * 0.5, 
          radius * 0.5, y,
          radius, y
        );
        
        // rounded rectangle's top edge
        this._ctx.lineTo(width - radius, y);

        // rounded rectangle's top right corner
        this._ctx.bezierCurveTo(
          width - radius * 0.5, y, 
          width, y + radius * 0.5, 
          width, y + radius
        );

        // rounded rectangle's right edge        
        this._ctx.lineTo(width, y + height);

        this._ctx.lineTo(width, 0);
        this._ctx.lineTo(0, 0);
        this._ctx.closePath();
        this._ctx.fill();
      }
    }

    this._raf = requestAnimationFrame(this._onRAF);
  }

  // getter - setter
  get mask() { return this._mask; }
  set mask(value) {
    // if value has not changed, do nothing
    if( value === this._mask ) return;

    this._mask = value;
    if( this._mask ) this.video.currentTime = 0;
  }
}

export default VideoDuplicate;

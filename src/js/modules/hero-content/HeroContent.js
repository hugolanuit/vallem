import anime from "animejs";

import { $, $$ } from "../../utils/dom";
import { mobile } from "../../utils/mobile";
import Viewport from "../../utils/viewport";

class HeroContent {
  constructor(el) {
    this.el = el;

    this.title = $('.heroContent__title__text', this.el);
    this.subtitle = $('.heroContent__subtitle', this.el);
    this.credits = $$('.heroContent__credits__line', this.el);
    this.creditsMobile = $('.heroContent__creditsMobile', this.el);
    this.footer = $$('.heroContent__footer > *', this.el);
    this.synopsisIconPath = $('.heroContent__synopsisBtn__icon path', this.el);

    this._inViewEnabled = true;

    this.init();
  }

  init() {
    const synopsisPathLength = getComputedStyle(this.synopsisIconPath).getPropertyValue('--length');
    const delay = mobile ? 1000 : 0;

    this.inView = anime.timeline({ autoplay: false });

    this.inView.add({
      targets: this.title,
      startOffset: {
        value: ['45%','0%'],
        easing: 'easeOutQuad',
        duration: 1700,
      },
      opacity: {
        value: [0,1],
        easing: 'linear',
        duration: 500
      },
    }, delay);

    this.inView.add({
      targets: this.subtitle,
      opacity: {
        value: [0, 1],
        duration: 1250,
        easing: 'linear',
      },
      translateY: [180, 0],
      duration: 1500,
      easing: 'easeOutQuart',
    }, delay + 500);

    if( Viewport.width >= 992 ) {
      this.inView.add({
        targets: this.credits,
        opacity: {
          value: [0, 1],
          duration: 1250,
          easing: 'linear',
        },
        translateY: [180, 0],
        delay: anime.stagger(25, {start: 550}),
        duration: 1500,
        easing: 'easeOutQuart',
      }, delay + 550);
    } else {
      this.inView.add({
        targets: this.creditsMobile,
        opacity: {
          value: [0, 1],
          duration: 1250,
          easing: 'linear',
        },
        translateY: [180, 0],
        duration: 1500,
        easing: 'easeOutQuart',
      }, delay + 650);
    }

    this.inView.add({
      targets: this.footer,
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(150, {start: 950}),
      easing: 'linear',
    }, delay + 950);

    this.inView.add({
      targets: this.synopsisIconPath,
      strokeDashoffset: [synopsisPathLength, 0],
      duration: 1350,
      easing: 'easeOutCubic',
    }, '-=600');
  }

  enter() { this.inView.restart(); }
  exit() {
    this.inView.seek(0);
    this.inView.pause();
  }
}


export default HeroContent;

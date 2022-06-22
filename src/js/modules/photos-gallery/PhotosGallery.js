import SwiperCore, { Swiper, Navigation } from 'swiper';

import { $ } from "../../utils/dom";

// configure Swiper to use modules
SwiperCore.use([Navigation]);

const SWIPER_OPTIONS = {
  centeredSlides: true,
  freeMode: false,
  loop: true,
  resistance: false,
  slidesPerView: 'auto',
  spaceBetween: 20,
  speed: 650,
  breakpoints: {
    992: {
      spaceBetween: 100,
    }
  }
};

class PhotosGallery {
  constructor(el) {
    this.el = el;
    this.slider = $(".photos-gallery__slider", this.el);

    this.init();
  }

  init() {
    if( this.slider ) this.swiper = new Swiper(this.slider, SWIPER_OPTIONS);

    this._bindEvents();
  }
  destroy() {
    this._unbindEvents();

    if( this.swiper ) this.swiper.destroy();

    this.el = null;
    this.slider = null;
    this.swiper = null;
  }

  _bindEvents() {}
  _unbindEvents() {}
}

export default PhotosGallery;

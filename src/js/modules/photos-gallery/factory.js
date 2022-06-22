import { $$ } from "../../utils/dom";

import Module from "../module/Module";
import PhotosGallery from "./PhotosGallery";

export const SELECTOR = `[data-photos-gallery]`;

class Factory extends Module {
  constructor(init = false) {
    super();

    this.initialized = false;
    this.items = null;

    init ? this.init() : null;
  }

  get name() {
    return "PhotosGallery";
  }

  init() {
    // set initialized
    this.initialized = true;
    this.items = [...$$(SELECTOR)].map(el => new PhotosGallery(el, this.emitter));
  }
  destroy() {
    if (this.items) this.items.forEach(el => el.destroy());

    this.initialized = false;
    this.items = null;
  }
}

export default Factory;
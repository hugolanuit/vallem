import { $, $$ } from "../../utils/dom";
import { on, off } from '../../utils/listener';
import Breakpoint from '../../utils/breakpoint';

class Condos {
  constructor(el, emitter) {
    this.el = el;
    this.emitter = emitter;

    this.sections = [ ...$$('[data-section]', this.el) ];
    this.togglers = [ ...$$('[data-toggle-section]', this.el) ];

    this._changeSection = this._changeSection.bind(this);

    this.init();
  }

  init() {
    this._bindEvents();
  }

  _bindEvents() {
    if( this.togglers ) on(this.togglers,'click',this._changeSection);
  }
  _unbindEvents() {
    if( this.togglers ) off(this.togglers,'click',this._changeSection);
  }

  _changeSection(event){
    if(event){
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    const sectionValue = event.currentTarget.getAttribute('data-toggle-section');

    this.sections.forEach(section => {
      if(section.getAttribute('data-section') == sectionValue){
        section.setAttribute("aria-hidden", false);
      } else {
        section.setAttribute("aria-hidden", true);
      }
    });

    this.togglers.forEach(toggler => {
      if(toggler.getAttribute('data-toggle-section') == sectionValue){
        toggler.setAttribute("aria-expanded", true);
      } else {
        toggler.setAttribute("aria-expanded", false);
      }
    });

    this.emitter.emit('SiteScroll.update');
  }
}


export default Condos;

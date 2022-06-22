import "./core/hello";
import { STATE } from "./core/state";
import { EMITTER } from "./core/emitter";
import splitting from "./core/splitting";
import MobileViewportUnit from "./core/mobile-vh";
import { mobile } from "./utils/mobile";
import { body, html } from "./utils/dom";
import ImagesLoaded from "./utils/imagesloaded";
import VideosLoaded from "./utils/videosloaded";

/*
 * Main app
 */
class App {

  constructor() {
    this._emitter = null;
    this._modules = [];

    this.init();
  }

  init() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    // if mobile, create mobile vh fix
    if (mobile) new MobileViewportUnit.init();
    html.classList.add(mobile ? 'will-scroll-native' : 'will-scroll-smooth');

    this.loadImages();
  }
  loadImages() {
    new ImagesLoaded(body, this.loadVideo.bind(this));
  }
  loadVideo() {
    new VideosLoaded(body, this.loadModules.bind(this));
  }
  loadModules() {
    // load all required modules
    let promises = [];
    // promises.push(import(`./modules/svg-path-length`));
    promises.push(import(`./modules/accordions`));
    promises.push(import(`./modules/condos`));
    promises.push(import(`./modules/photos-gallery`));
    promises.push(import(`./modules/scroll-timeline`));
    promises.push(import(`./modules/newsletter`));
    // promises.push(import(`./modules/video`));
    // if( !mobile ) promises.push(import(`./modules/video-duplicate`));

    // more examples :
    promises.push(import(`./ui/site-scroll`));
    // promises.push(import(`./ui/site-header`));
    promises.push(import(`./ui/site-nav`));

    // when all modules promises are done, bootstap it all
    Promise.all(promises).then((modules) => {
      modules.forEach((m) => {
        this._modules.push(DynamicModuleBootstrap(m));
      });
      
      this.start();
    });
  }
  start() {
    // start text splitting
    splitting();

    // dispatch global event
    EMITTER.emit('SITE_READY');

    // start all modules
    this._modules.forEach(instance => {
      if (typeof instance.start === `function`) instance.start();
    });

    // hide site-loader
    body.classList.add('--js-ready');
  }
}

const DynamicModuleBootstrap = (m) => {
  const { instance } = m.default;

  // push instance to all modules
  if (!instance) return null;

  // attach Emitter and State to instance
  instance.emitter = EMITTER;
  instance.state = STATE;

  // bootstrap init
  if (typeof instance.init === `function`) instance.init();

  return instance;
};

export default App;

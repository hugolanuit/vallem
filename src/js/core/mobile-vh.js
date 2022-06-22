import { html } from "../utils/dom";
import { on } from "../utils/listener";
import Viewport from "../utils/viewport";

/**
 * Fix VH calculation issue in iOS Safari when scroll is at the top
 *
 * How to use :
 *
 * Init in main application and add the following to a selector
 *
 * .selector {
 *    height: calc(var(--vh) * 100);
 * }
 *
 */

const MobileViewportUnit = (() => {
  let canResize = true;

  const onResize = () => {
    if( !canResize ) return;
    canResize = false;

    html.style.setProperty("--vh", `${Viewport.height * 0.01}px`);
  };
  const onOrientationChange = () => {
    canResize = true;
  };

  const ctx = {
    init: () => {
      onResize();

      on(window, "orientationchange", onOrientationChange);
      on(window, "resize", onResize);
    }
  };

  return ctx;
})();

export default MobileViewportUnit;

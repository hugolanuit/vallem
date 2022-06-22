import EventEmitter2 from "eventemitter2";

const Emitter = () => {
  return new EventEmitter2({
    wildcard: true
  });
}

export const EMITTER = Emitter();
export default Emitter;

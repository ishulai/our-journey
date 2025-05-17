const ANIMATION_TIME = 200;

const id = _ => document.getElementById(_);

const hide = _ => {
  _.style.opacity = 0;
  setTimeout(() => {
    _.style.display = "none";
  }, ANIMATION_TIME);
};

const show = _ => {
  setTimeout(() => {
    _.style.display = "block";
    _.style.opacity = 1;
  }, ANIMATION_TIME);
};

const reset = (_, isVisible) => {
  _.style.display = isVisible ? "block" : "none";
  _.style.opacity = isVisible ? 1 : 0;
};

const wait = async (time = 400) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), time);
  });
};
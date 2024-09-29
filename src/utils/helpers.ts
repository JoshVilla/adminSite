import { store } from "../store/store";

export const isSuperAdmin = () => {
  console.log(store.getState().userInfo.userInfo?.isSuperAdmin);

  return store.getState().userInfo.userInfo?.isSuperAdmin === 1 ? true : false;
};

export const delayTimer = (timer: number, Func: Function) => {
  let timerCount = timer;
  const timerId = setInterval(formatCountdown, 1000);
  function formatCountdown() {
    if (timerCount === -1) {
      clearInterval(timerId);
      Func();
    } else {
      timerCount--;
    }
  }
};

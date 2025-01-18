import { useNavigate } from "react-router-dom";
import { AppDispatch, store } from "../store/store";
import { getUserInfo } from "@/store/slice/userInfoSlice";
import { useDispatch } from "react-redux";

export const isSuperAdmin = () => {
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

export const combineClassNames = (arrClass: (string | null)[]) => {
  return arrClass?.join(" ");
};

export const handleLogOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  navigate("/");
  dispatch(getUserInfo(null));
  localStorage.removeItem("status");
};

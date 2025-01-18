import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUserInfo } from "@/store/slice/userInfoSlice";
import { AppDispatch } from "../store/store";

export const useHandleLogOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogOut = () => {
    navigate("/");
    dispatch(getUserInfo(null));
    localStorage.removeItem("status");
  };

  return handleLogOut;
};

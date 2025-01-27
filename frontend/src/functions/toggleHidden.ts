import { useState } from "react";
import {
  hiddenDadosSensiveis,
  setHiddenFalse,
  setHiddenTrue,
} from "../redux/hiddenDadosSensiveis";
export function hiddenDados() {
  const store = hiddenDadosSensiveis;
  const [isHidden, setIsHidden] = useState<boolean>(store.getState().hidden);
  const toggleHidden = () => {
    store.dispatch(isHidden ? setHiddenFalse() : setHiddenTrue());
    setIsHidden(store.getState().hidden);
  };
  return { isHidden, toggleHidden };
}

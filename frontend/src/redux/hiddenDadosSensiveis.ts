import { createSlice, configureStore } from "@reduxjs/toolkit";

interface InitialState {
  hidden: boolean;
}

const initialState: InitialState = {
  hidden: true,
};

const config = createSlice({
  name: "hiddenDadosSensiveis",
  initialState,
  reducers: {
    setHiddenTrue: () => {
      return {
        hidden: true,
      };
    },
    setHiddenFalse: () => {
      return {
        hidden: false,
      };
    },
  },
});
export const { setHiddenTrue, setHiddenFalse } = config.actions;
export const hiddenDadosSensiveis = configureStore({
  reducer: config.reducer,
});

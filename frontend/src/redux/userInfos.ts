import { createSlice, configureStore } from "@reduxjs/toolkit";
export interface DadosBancarios {
  id: string;
  type: string;
  accountCreated: null;
  accountType: string;
  name: string;
  taxId: string;
  ownerType: null;
  bankName: string;
  ispb: string;
  branchCode: string;
  accountNumber: string;
  status: string;
}
interface InitialState {
  username: string;
  role: string;
  saldo: number;
  dadosBancarios: DadosBancarios[];
}

const initialState: InitialState = {
  username: "",
  role: "",
  saldo: 0,
  dadosBancarios: [],
};

const config = createSlice({
  name: "userInfos",
  initialState,
  reducers: {
    setUserInfos: (before, { payload }) => {
      return {
        ...before,
        username: payload.username,
        role: payload.role,
        dadosBancarios: payload.dadosBancarios,
      };
    },
    setBalance: (before, { payload }) => {
      return { ...before, saldo: payload.saldo };
    },
    clearUserInfos: () => initialState,
  },
});
export const { setUserInfos, clearUserInfos, setBalance } = config.actions;
export const userInfos = configureStore({
  reducer: config.reducer,
});

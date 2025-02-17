import { useLocation, useNavigate, useParams } from "react-router-dom";
import $ from "jquery";
import "jquery-mask-plugin/dist/jquery.mask.min";
import { useEffect, useState } from "react";
import { CgAdd, CgClose } from "react-icons/cg";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import { MdDelete } from "react-icons/md";
import { HiArrowUpTray } from "react-icons/hi2";
import axios from "axios";
import tempoExpiracaoToken from "../../../functions/tempoExpiracaoToken";
import { toast } from "react-toastify";
import { HiArrowLeft } from "react-icons/hi";
import { IoMdArrowRoundBack } from "react-icons/io";
export interface Data {
  cashin_fixo: string;
  cashin_porcent: string;
  cashout_fixo: string;
  cashout_porcent: string;
  comprovante: null;
  cpfCnpj: string;
  created_at: string;
  email: string;
  id_logins: number;
  nome: string;
  password: string;
  required_2fa: number;
  role: string;
  secret: string;
  taxas_representante: string;
  user: string;
  valor: string;
}
export interface Request {
  cashin_fixo: string;
  cashin_porcent: string;
  cashout_fixo: string;
  cashout_porcent: string;
  cpfCnpj: string;
  id_logins: number;
  nome: string;
  role: string;
  taxas_representante: string;
}

function EditConta() {
  const location = useLocation();
  const [data, setData] = useState<Data>({
    cashin_fixo: "",
    cashin_porcent: "",
    cashout_fixo: "",
    cashout_porcent: "",
    comprovante: null,
    cpfCnpj: "",
    created_at: "",
    email: "",
    id_logins: 0,
    nome: "",
    password: "",
    required_2fa: 0,
    role: "",
    secret: "",
    taxas_representante: "",
    user: "",
    valor: "",
  });
  const params = useParams();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const id: string = params.id as string;
  useEffect(() => {
    if (!tempoExpiracaoToken(localStorage.getItem("x-access-token") as string))
      navigate("/login");

    setData(location.state.data);

    $("#cpfCnpj").mask("000.000.000-000", {
      onKeyPress: function (cpf, e, field, options) {
        const masks = ["000.000.000-000", "00.000.000/0000-00"];
        const mask = cpf.length > 14 ? masks[1] : masks[0];
        $("#cpfCnpj").mask(mask, options);
      },
    });
  }, []);
  const headers = {
    headers: {
      "x-access-token": localStorage.getItem("x-access-token"),
    },
  };

  const request: Request = {
    cashin_fixo: data.cashin_fixo,
    cashin_porcent: data.cashin_porcent,
    cashout_fixo: data.cashout_fixo,
    cashout_porcent: data.cashout_porcent,
    cpfCnpj: data.cpfCnpj,
    id_logins: data.id_logins,
    nome: data.nome,
    role: data.role,
    taxas_representante: data.taxas_representante,
  };

  function salvar() {
    setIsLoading(true);
    axios
      .put(
        `https://api.binbank.com.br/contas/atualizar/${data.id_logins}`,
        request,
        headers
      )
      .then((res) => {
        console.log(res.data);
        toast.success("Conta atualizada com sucesso!");
        navigate("/contas");
      })
      .catch((err) => {
        console.error(err);
        return toast.warn(err.response.data.status);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <div className="w-full h-screen overflow-y-scroll bg-[var(--background-primary-color)]">
        {modalVisible && (
          <dialog className="z-20 bg-[var(--background-secound-color)] backdrop-blur-xl flex justify-center items-center lg:bg-transparent h-full w-full absolute py-20 top-0 overflow-y-auto">
            <div className="flex flex-col   items-center justify-center bg-[var(--background-secound-color)] border-2 border-[var(--border-color2)]">
              <div className="flex w-full justify-between items-center p-2 border-b border-gray-400/50">
                <div></div>
                <CgClose
                  onClick={() => {
                    setModalVisible(false);
                  }}
                  className="text-white cursor-pointer"
                />
              </div>
              <div className="w-full flex flex-col items-center ">
                <div className="w-[90%] flex flex-col py-4 gap-4 border-b-2 border-[var(--border-color)] ">
                  <span className=" text-[var(--title-primary-color)] text-[18px] font-semibold">
                    Atualizar Conta
                  </span>
                  <span className="text-[15px] text-[var(--title-primary-color)]">
                    Tem certeza que deseja atualizar essa conta?
                  </span>
                </div>
                <div className="w-[90%] flex justify-end py-5 gap-4">
                  <button
                    onClick={() => {
                      salvar();
                    }}
                    className=" transition flex gap-2 items-center justify-center h-10 text-[var(--white-color2)]  focus:outline-none  font-medium rounded-lg text-sm w-[140px]  py-2 text-center bg-[var(--primary-color)] hover:bg-transparent hover:border-[var(--primary-color)] hover:border-2 hover:text-[var(--primary-color)]"
                  >
                    {isLoading ? "Atualizando..." : "Atualizar"}
                  </button>
                </div>
              </div>
            </div>
          </dialog>
        )}
        <main className="my-12 gap-10 flex flex-col">
          <div className="flex justify-between items-center px-16">
            <button
              onClick={() => {
                navigate("/contas");
              }}
              className="border border-[var(--primary-color)] text-[var(--primary-color)] text-sm hover:opacity-[0.90] transition cursor-pointer  py-2 px-4 rounded uppercase font-semibold  flex gap-1 hover:bg-[var(--primary-color)] hover:text-white transition duration-500"
            >
              <HiArrowLeft size={20} className=" " />
              Voltar
            </button>
            <button
              onClick={() => {
                setModalVisible(true);
              }}
              className="bg-[var(--primary-color)] text-sm hover:opacity-[0.90] transition cursor-pointer  py-2 px-4 rounded uppercase font-semibold text-gray-200 flex gap-1 hover:bg-transparent hover:text-[var(--primary-color)] hover:border hover:border-[var(--primary-color)] transition duration-500"
            >
              Atualizar
              <HiArrowUpTray size={20} className="ml-2 " />
            </button>
          </div>
          <div className="bg-[var(--background-secound-color)] py-4 mx-[5%] rounded-lg px-10 flex gap-1 flex-col">
            <h1 className="text-xl text-[var(--title-primary-color)] font-semibold mt-6 divide-y divide-gray-200/10 capitalize">
              {data.nome}
            </h1>
            <div className="flex flex-col  divide-y divide-gray-200/10">
              <div className=" py-10 grid gap-32 max-[1000px]:gap-10 grid-cols-4 max-[1000px]:grid-cols-1 max-[1300px]:grid-cols-2">
                <div className="gap-2 flex flex-col text-sm">
                  <span className="relative text-lg text-[var(--title-primary-color)] font-semiboldafter:content-[''] after:block after:w-0 after:h-[1px] after:bg-[var(--primary-color)] after:transition-all after:duration-300 after:mt-1 after:ml-[-5px] after:w-[40%]">
                    Nome
                  </span>
                  <input
                    onInput={(e) => {
                      const value = e.currentTarget.value;

                      setData({ ...data, nome: value });
                    }}
                    defaultValue={data.nome}
                    className="bg-transparent text-[var(--text-secound-color)] pl-2 focus:border-b focus:border-[var(--title-primary-color)] rounded py-2 outline-none transition-all duration-300"
                  />
                </div>
                <div className="gap-2 flex flex-col text-sm">
                  <span className="relative text-lg text-[var(--title-primary-color)] font-semiboldafter:content-[''] after:block after:w-0 after:h-[1px] after:bg-[var(--primary-color)] after:transition-all after:duration-300 after:mt-1 after:ml-[-5px] after:w-[40%]">
                    Role
                  </span>
                  <select
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      setData({ ...data, role: value });
                    }}
                    className="bg-transparent py-2 text-[var(--text-secound-color)] pl-2 focus:border-b outline-none transition-all duration-300"
                  >
                    <option value={data.role}>{data.role}</option>
                    <option value="admin">Admin</option>
                    <option value="representante">Representante</option>
                    <option value="cliente">Cliente</option>
                  </select>
                </div>
                <div className="gap-2 flex flex-col text-sm">
                  <span className="relative text-lg text-[var(--title-primary-color)] font-semiboldafter:content-[''] after:block after:w-0 after:h-[1px] after:bg-[var(--primary-color)] after:transition-all after:duration-300 after:mt-1 after:ml-[-5px] after:w-[40%]">
                    Doc
                  </span>
                  <input
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      setData({ ...data, cpfCnpj: value });
                    }}
                    defaultValue={data.cpfCnpj}
                    id="cpfCnpj"
                    className="bg-transparent text-[var(--text-secound-color)] pl-2 focus:border-b focus:border-[var(--title-primary-color)] rounded py-2 outline-none transition-all duration-300"
                  />
                </div>
                <div className="gap-2 flex flex-col text-sm">
                  <span className="relative text-lg text-[var(--title-primary-color)] font-semiboldafter:content-[''] after:block after:w-0 after:h-[1px] after:bg-[var(--primary-color)] after:transition-all after:duration-300 after:mt-1 after:ml-[-5px] after:w-[40%]">
                    Taxas Rep
                  </span>
                  <input
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      setData({ ...data, taxas_representante: value });
                    }}
                    defaultValue={data.taxas_representante}
                    className="bg-transparent text-[var(--text-secound-color)] pl-2 focus:border-b focus:border-[var(--title-primary-color)] rounded py-2 outline-none transition-all duration-300"
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full justify-center divide-y divide-gray-200/10">
              <h2 className="text-2xl text-[var(--title-primary-color)] font-semibold">
                Taxas Base
              </h2>
            </div>
            <div className=" flex flex-col gap-2 w-full rounded-lg bg-[var(--background-secound-color)]">
              <div className="lg:grid grid-cols-2 gap-14 pb-16 pt-6">
                <div className="flex flex-col items-center     w-full ">
                  <div className="  rounded-lg shadow  md:mt-0 xl:p-0 w-full h-full">
                    <div className=" space-y-4 md:space-y-6">
                      <h3 className="text-xl font-bold leading-tight tracking-tight text-[var(--title-primary-color)] md:text-2xl">
                        Cash-In
                      </h3>
                      <div className="space-y-4 md:space-y-6">
                        <div className="flex flex-col gap-10 w-full max-[1000px]:flex-col">
                          <div className="grid  gap-5 w-full">
                            <div>
                              <label className="block mb-2 text-sm font-medium text-[var(--title-primary-color)] ">
                                Pix
                              </label>
                              <div className="flex gap-3">
                                <div className="bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] flex justify-between w-full p-2.5 max-[1000px]:bg-transparent  max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)] gap-2">
                                  <span>R$</span>
                                  <input
                                    type="text"
                                    className="MONEY flex  w-full bg-transparent"
                                    required
                                    defaultValue={data.cashin_fixo}
                                    onInput={(e) => {
                                      const value = e.currentTarget.value;
                                      setData({
                                        ...data,
                                        cashin_fixo: value,
                                      });
                                    }}
                                  />
                                </div>
                                <div className="bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] flex justify-between w-full p-2.5 max-[1000px]:bg-transparent  max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)] gap-2">
                                  <input
                                    type="text"
                                    className="PORCENTAGEM flex text-end w-full bg-transparent"
                                    required
                                    defaultValue={data.cashin_porcent}
                                    onInput={(e) => {
                                      const value = e.currentTarget.value;
                                      setData({
                                        ...data,
                                        cashin_porcent: value,
                                      });
                                    }}
                                  />
                                  <span>%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center  w-full ">
                  <div className="  rounded-lg shadow  md:mt-0 xl:p-0 w-full h-full">
                    <div className=" space-y-4 md:space-y-6 ">
                      <h3 className="text-xl text-end font-bold leading-tight tracking-tight text-[var(--title-primary-color)] md:text-2xl">
                        Cash-Out
                      </h3>
                      <div className="space-y-4 md:space-y-6">
                        <div className="flex flex-col gap-10 w-full max-[1000px]:flex-col">
                          <div className="grid  gap-5 w-full">
                            <div>
                              <label className="block mb-2 text-sm font-medium text-[var(--title-primary-color)] ">
                                Pix
                              </label>
                              <div className="flex gap-3">
                                <div className="bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] flex justify-between w-full p-2.5 max-[1000px]:bg-transparent  max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)] gap-2">
                                  <span>R$</span>
                                  <input
                                    type="text"
                                    className="MONEY flex  w-full bg-transparent"
                                    defaultValue={data.cashout_fixo}
                                    required
                                    onInput={(e) => {
                                      const value = e.currentTarget.value;
                                      setData({
                                        ...data,
                                        cashout_fixo: value,
                                      });
                                    }}
                                  />
                                </div>
                                <div className="bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] flex justify-between w-full p-2.5 max-[1000px]:bg-transparent  max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)] gap-2">
                                  <input
                                    type="text"
                                    className="PORCENTAGEM flex text-end w-full bg-transparent"
                                    required
                                    defaultValue={data.cashout_porcent}
                                    onInput={(e) => {
                                      const value = e.currentTarget.value;
                                      setData({
                                        ...data,
                                        cashout_porcent: value,
                                      });
                                    }}
                                  />
                                  <span>%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default EditConta;

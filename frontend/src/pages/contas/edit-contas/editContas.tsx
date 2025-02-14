import { useLocation, useNavigate, useParams } from "react-router-dom";
import $ from "jquery";
import "jquery-mask-plugin/dist/jquery.mask.min";
import { useEffect, useState } from "react";
import { CgAdd } from "react-icons/cg";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import { MdDelete } from "react-icons/md";
import { HiArrowUpTray } from "react-icons/hi2";
import axios from "axios";
import tempoExpiracaoToken from "../../../functions/tempoExpiracaoToken";
import { toast } from "react-toastify";
export interface Data {
  cashin_fixo: number;
  cashin_porcent: number;
  cashout_fixo: number;
  cashout_porcent: number;
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
  taxas_representante: any[];
  user: string;
  valor: number;
}
export interface Request {
  cashin_fixo: number;
  cashin_porcent: number;
  cashout_fixo: number;
  cashout_porcent: number;
  cpfCnpj: string;
  id_logins: number;
  nome: string;
  role: string;
  taxas_representante: any[];
}

function EditConta() {
  const location = useLocation();
  const data: Data = location.state.data;
  const params = useParams();
  const navigate = useNavigate();
  const id: string = params.id as string;
  useEffect(() => {
    if (!tempoExpiracaoToken(localStorage.getItem("x-access-token") as string))
      navigate("/login");
    console.log(location);
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
    axios
      .put(`http://localhost:2312/contas/atualizar`, request, headers)
      .then((res) => {
        console.log(res.data);
        toast.success("Conta atualizada com sucesso!");
        navigate("/contas");
      })
      .catch((err) => {
        console.error(err);
        return toast.warn(err.response.data.status);
      });
  }

  return (
    <>
      <div className="w-full h-screen overflow-y-scroll bg-[var(--background-primary-color)]">
        <main className="my-12 gap-10 flex flex-col">
          <div className="flex justify-between items-center px-16">
            <div></div>
            <button
              onClick={() => {}}
              className="bg-[var(--primary-color)] text-sm hover:opacity-[0.90] transition cursor-pointer  py-2 px-4 rounded uppercase font-semibold text-gray-200 flex gap-1"
            >
              Atualizar
              <HiArrowUpTray size={20} className="text-white ml-2 " />
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
                    }}
                    defaultValue={data.role}
                    className="bg-transparent py-2 text-[var(--text-secound-color)] pl-2 focus:border-b outline-none transition-all duration-300"
                  >
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
                    }}
                    defaultValue={data.cpfCnpj}
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
                                    defaultValue={data.cashin_fixo.toString()}
                                  />
                                </div>
                                <div className="bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] flex justify-between w-full p-2.5 max-[1000px]:bg-transparent  max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)] gap-2">
                                  <input
                                    type="text"
                                    className="PORCENTAGEM flex text-end w-full bg-transparent"
                                    required
                                    defaultValue={data.cashin_porcent.toString()}
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
                                    defaultValue={data.cashout_fixo.toString()}
                                    required
                                  />
                                </div>
                                <div className="bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] flex justify-between w-full p-2.5 max-[1000px]:bg-transparent  max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)] gap-2">
                                  <input
                                    type="text"
                                    className="PORCENTAGEM flex text-end w-full bg-transparent"
                                    required
                                    defaultValue={data.cashout_porcent.toString()}
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

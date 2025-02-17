import { NavLink, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tempoExpiracaoToken from "../../../functions/tempoExpiracaoToken";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CiUser } from "react-icons/ci";
import { HiIdentification } from "react-icons/hi";
import { BiInfoCircle, BiSearch } from "react-icons/bi";
import $ from "jquery";
import { IoReload } from "react-icons/io5";

export interface Conta {
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

function ListContas() {
  const navigate = useNavigate();

  const [pagina, setPagina] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [data, setData] = useState<Conta[]>([
    {
      cashin_fixo: 0,
      cashin_porcent: 0,
      cashout_fixo: 0,
      cashout_porcent: 0,
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
      taxas_representante: [],
      user: "",
      valor: 0,
    },
  ]);

  const headers = {
    headers: {
      "x-access-token": localStorage.getItem("x-access-token"),
    },
  };

  useEffect(() => {
    if (!tempoExpiracaoToken(localStorage.getItem("x-access-token") as string))
      navigate("/login");
    if (localStorage.getItem("role") === "representante") {
      axios
        .get("https://api.binbank.com.br/listcontas/representante", headers)
        .then(({ data }) => {
          console.log(data);

          setData(data);
        })
        .catch((err) => {
          console.error(err);
          if (err.response.status === 404)
            return toast.warn("Nenhum cliente encontrado");
          toast.error("ocorreu um erro");
        })
        .finally(() => {
          setIsLoading(false);
        });
      return;
    }
    axios
      .get(
        "https://api.binbank.com.br/contas",

        headers
      )
      .then(({ data }) => {
        setData(data);
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 404)
          return toast.warn("Nenhum cliente encontrado");
        toast.error("ocorreu um erro");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <div className="gap-10 overflow-y-auto pb-10 px-[5%] flex-col w-full h-screen flex  bg-[var(--background-primary-color)]">
        <div className="max-[1000px]:hidden flex bg-[var(--background-secound-color)]  flex-col  rounded-xl  shadow mt-10">
          <div className="flex px-5 py-5 flex-col gap-2 text-[var(--title-primary-color)]">
            <div className="flex gap-4 items-end">
              <input
                type="text"
                id="search"
                placeholder="pesquisar nome..."
                onInput={(e) => {
                  // filtrarPagina(parseInt(e.target.value));
                  setSearch(e.currentTarget.value);
                }}
                className="w-full py-2 px-5 text-sm bg-transparent border-b border-gray-200 rounded"
              />

              <BiSearch
                size={20}
                className="hover:text-[var(--primary-color)] cursor-pointer transition"
                onClick={() => {
                  if (!data) return;
                  const value = $("#search").val()?.toString() || "";
                  setSearch(value);
                }}
              />
            </div>
          </div>
        </div>
        {isLoading && (
          <div>
            <span className="flex gap-2 items-center">
              <IoReload /> Atualizando...
            </span>
          </div>
        )}

        {data ? (
          data
            .filter((conta) =>
              conta.nome.toLowerCase().includes(search.toLowerCase())
            )
            .map((item, i) => {
              return (
                <div
                  key={i}
                  className={` px-12 flex justify-between items-center text-[var(--title-primary-color)] py-8 rounded  w-full bg-[var(--background-secound-color)] `}
                >
                  <div className="flex items-center gap-12  transition ">
                    <div className="flex flex-col  gap-2  ">
                      <div className="flex gap-2" title="name">
                        <CiUser size={20} />
                        <span className="font-bold">
                          {item.nome} - {item.role}
                        </span>
                      </div>
                      <div className="flex gap-2" title=" Id">
                        <HiIdentification size={20} />
                        <span className="text-sm">{item.id_logins}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <NavLink
                      to={`/edit-contas`}
                      state={{ data: item }}
                      className="flex flex-col gap-2  transition "
                    >
                      <BiInfoCircle size={30} />
                    </NavLink>{" "}
                  </div>
                </div>
              );
            })
        ) : (
          <Skeleton
            className=" h-20  rounded my-3"
            count={5}
            highlightColor="#e5e5e5"
            baseColor="#dedede"
          />
        )}
        <div className="flex gap-5 flex-wrap">
          {/* {Array.from({ length: data.total_de_paginas }, (_, i) => i + 1).map(
            (key, i) => {
              return (
                <button
                  onClick={() => {
                    filtrarPagina(key);
                    setPagina(key);
                  }}
                  className={`hover:opacity-70 ${
                    pagina === key && "text-[var(--primary-color)]"
                  }`}
                  key={i}
                >
                  {key}
                </button>
              );
            }
          )} */}
        </div>
      </div>
    </>
  );
}
export default ListContas;

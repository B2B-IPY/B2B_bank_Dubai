import { NavLink, useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tempoExpiracaoToken from "../../../functions/tempoExpiracaoToken";
import { useEffect, useState } from "react";

import { Cartoes } from "../../../interfaces/cartoes";
import axios from "axios";
import { toast } from "react-toastify";
import normalizeTimeStamp from "../../../functions/normalizeTimeStamp";

function ViewCartoes() {
  const navigate = useNavigate();
  const params = useParams();
  const id: string = params.id as string;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<Cartoes>({
    numero: "",
    id_user: 0,
    validade: "",
    cvv: "",
    user: "",
    data: "",
    endereco: "",
    id: 0,
  });
  const headers = {
    headers: {
      "x-access-token": localStorage.getItem("x-access-token"),
    },
  };
  useEffect(() => {
    if (!tempoExpiracaoToken(localStorage.getItem("x-access-token") as string))
      navigate("/login");

    axios
      .get("https://api.binbank.com.br/cartoes/" + id, headers)
      .then((res) => {
        const data: Cartoes = res.data;
        setData(data);
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 401) return toast.warn("sem permissão");
        if (err.response.status === 404)
          return toast.warn("Nenhum cartão encontrado");
        toast.error("ocorreu um erro");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  function copyToClipboard(data: string) {
    navigator.clipboard.writeText(data);
    toast.success("Copiado para a área de transferência");
  }
  return (
    <>
      <div className="gap-10 overflow-y-auto pb-10 px-[5%] flex-col w-full h-screen flex  bg-[var(--background-primary-color)]">
        {isLoading ? (
          <div className=" px-[5%] w-full my-10 flex flex-col gap-3">
            <Skeleton
              className=" h-[190px] rounded my-3"
              count={1}
              highlightColor="#e5e5e5"
              baseColor="#dedede"
            />
            <Skeleton
              className="  h-[280px] rounded my-3"
              count={3}
              highlightColor="#e5e5e5"
              baseColor="#dedede"
            />
          </div>
        ) : (
          <>
            {" "}
            <div className="mt-5 ">
              <div>
                <h1 className="font-bold">{normalizeTimeStamp(data.data)}</h1>
                <span>ID: {data.id}</span>
              </div>
            </div>
            <div className="flex flex-wrap w-full my-6">
              <div className=" flex flex-col gap-3">
                <span className="text-[22px]  ">
                  Cartão Virtual Tokenizado:
                </span>
                <div className="flex flex-col max-w-[500px]">
                  <div className="h-20 bg-[var(--background-secound-color)]  rounded-t-[16px] border border-black "></div>
                  <div className="  justify-between items-center  flex   px-6 py-8 rounded-b-[16px] border border-black">
                    <div className="flex flex-col gap-8">
                      <span className="text-[19px] font-semibold ">
                        {data.user}
                      </span>
                      <span
                        className="text-[24px] cursor-pointer hover:text-[var(--primary-color)] transition"
                        onClick={() => {
                          copyToClipboard(data.numero);
                        }}
                      >
                        {data.numero}
                      </span>

                      <div className="flex w-full gap-10">
                        <span
                          className="text-[19px]  cursor-pointer hover:text-[var(--primary-color)] transition"
                          onClick={() => {
                            copyToClipboard(data.validade);
                          }}
                        >
                          Exp: {data.validade}
                        </span>
                        <span
                          className="text-[19px]  cursor-pointer hover:text-[var(--primary-color)] transition"
                          onClick={() => {
                            copyToClipboard(data.cvv);
                          }}
                        >
                          CVV: {data.cvv}
                        </span>
                      </div>
                    </div>
                    <img src="/assets/logo.png" alt="" className="w-32 " />
                  </div>
                </div>
                <span
                  className="text-[18px] cursor-pointer hover:text-[var(--primary-color)] transition"
                  onClick={() => {
                    copyToClipboard(data.endereco);
                  }}
                >
                  <b>Endereço de cobrança</b>: {data.endereco}
                </span>
              </div>
              <div className="my-28">
                <ul className="flex gap-3 flex-col">
                  <li>
                    <span className="flex flex-col gap-2">
                      <p>
                        <b className="text-gray-900">
                          Como Funciona o Nosso Cartão de Crédito Vinculado a
                          Investimentos
                        </b>
                      </p>

                      <p className="text-gray-700 ml-5">
                        Nosso cartão de crédito oferece uma maneira inovadora de
                        gerenciar suas finanças, combinando o uso de crédito com
                        um investimento garantido.
                      </p>
                    </span>
                  </li>
                  <li>
                    <span className="flex flex-col gap-2">
                      <p>
                        <b className="text-gray-900">Investimento Inicial</b>
                      </p>

                      <p className="text-gray-700 ml-5">
                        Para começar a usar o cartão de crédito, é necessário
                        fazer um{" "}
                        <NavLink
                          to="/investimentos"
                          className="hover:opacity-75 text-[var(--primary-color)]"
                        >
                          investimento
                        </NavLink>{" "}
                        inicial mínimo de R$ 1.000. Esse valor será
                        automaticamente convertido em saldo no seu cartão de
                        crédito.{" "}
                      </p>
                    </span>
                  </li>
                  <li>
                    <span className="flex flex-col gap-2">
                      <p>
                        <b className="text-gray-900">
                          Crédito Baseado no Investimento
                        </b>
                      </p>

                      <p className="text-gray-700 ml-5">
                        O valor que você investe se torna seu limite de crédito.
                        Por exemplo, se você investir R$ 1.500, esse será o
                        saldo disponível no seu cartão.
                      </p>
                    </span>
                  </li>
                  <li>
                    <span className="flex flex-col gap-2">
                      <p>
                        <b className="text-gray-900">Prazo do Investimento</b>
                      </p>

                      <p className="text-gray-700 ml-5">
                        O investimento possui um prazo de 720 dias (cerca de 2
                        anos). Durante esse período, você poderá utilizar o
                        limite do cartão normalmente, com a segurança de que seu
                        dinheiro está rendendo.
                      </p>
                    </span>
                  </li>
                  <li>
                    <span className="flex flex-col gap-2">
                      <p>
                        <b className="text-gray-900">Expiração</b>
                      </p>

                      <p className="text-gray-700 ml-5">
                        Ao final dos 720 dias, o valor investido é resgatado e
                        retorna para a sua conta. Consequentemente, o saldo
                        retirado do investimento será descontado do limite
                        disponível no cartão de crédito.
                      </p>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default ViewCartoes;

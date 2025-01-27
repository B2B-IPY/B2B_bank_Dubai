import $ from "jquery";
import { useEffect, useState } from "react";
import { BiCalendar, BiHome, BiInfoCircle, BiLoader } from "react-icons/bi";
import { CiUser } from "react-icons/ci";
import { GrStatusCritical, GrStatusGood } from "react-icons/gr";
import { HiIdentification } from "react-icons/hi2";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdArrowForwardIos } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { NavLink, useNavigate } from "react-router-dom";
import tempoExpiracaoToken from "../../functions/tempoExpiracaoToken";
interface data {
  ID: number;
  ID_EX: number;
  marketplace: string;
  nome: string;
  documento: string;
  tipo: string;
  etapa: string;
  status: string;
  criadoEm: string;
}

function Estabelecimentos() {
  $(() => {
    $(".MONEY").mask("000.000.000,00", { reverse: true });
  });
  const [pages, setPages] = useState<{ current: number; total: number }>({
    current: 1,
    total: 10,
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (
      !tempoExpiracaoToken(localStorage.getItem("x-access-token") as string)
    ) {
      navigate("/login");
    }
  }, []);
  const [data] = useState<data[]>([
    {
      ID: 2121,
      ID_EX: 229412,
      marketplace: "B2B IPY",
      nome: "Murilo de Souza Vilela",
      documento: "08307387116",
      tipo: "Individual",
      etapa: "Concluído",
      status: "Credenciamento Finalizado",
      criadoEm: "05/06/23 15:49",
    },
    {
      ID: 2223,
      ID_EX: 32322,
      marketplace: "B2B IPY",
      nome: "William ME",
      documento: "22018914863",
      tipo: "Individual",
      etapa: "Concluído",
      status: "Credenciamento Finalizado",
      criadoEm: "06/06/23 17:03",
    },
    {
      ID: 2224,
      ID_EX: 228002,
      marketplace: "B2B IPY",
      nome: "Sivas",
      documento: "06543875593",
      tipo: "Individual",
      etapa: "Concluído",
      status: "Credenciamento Finalizado",
      criadoEm: "06/06/23 17:03",
    },
    {
      ID: 2225,
      ID_EX: 338006,
      marketplace: "B2B IPY",
      nome: "Sivas",
      documento: "04432561106",
      tipo: "Individual",
      etapa: "Domicílio Bancário",
      status: "Reprovado",
      criadoEm: "06/06/23 17:03",
    },
    {
      ID: 2226,
      ID_EX: 240107,
      marketplace: "B2B IPY",
      nome: "Desativado",
      documento: "29173203000161",
      tipo: "Empresa",
      etapa: "Concluído",
      status: "Credenciamento Finalizado",
      criadoEm: "06/06/23 17:03",
    },
    {
      ID: 2227,
      ID_EX: 240106,
      marketplace: "B2B IPY",
      nome: "CHIPOU STORE",
      documento: "48173509000162",
      tipo: "Empresa",
      etapa: "Concluído",
      status: "Credenciamento Finalizado",
      criadoEm: "06/06/23 17:03",
    },
    {
      ID: 2228,
      ID_EX: 240104,
      marketplace: "B2B IPY",
      nome: "B2B IPY",
      documento: "4146661000194",
      tipo: "Empresa",
      etapa: "Concluído",
      status: "Credenciamento Finalizado",
      criadoEm: "06/06/23 17:03",
    },
    {
      ID: 2361,
      ID_EX: 338007,
      marketplace: "B2B IPY",
      nome: "Guilherme",
      documento: "09466141562",
      tipo: "Individual",
      etapa: "Domicílio Bancário",
      status: "Reprovado",
      criadoEm: "15/06/23 09:40",
    },
  ]);
  return (
    <>
      <main className="pt-12 px-[5%] h-full overflow-y-auto bg-[var(--background-primary-color)]">
        <div className="grid md:grid-cols-5 gap-10 w-full ">
          <div className="flex flex-col">
            <span className="capitalize font-sm font-semibold after:h-0.5 after:left-[-7px] after:relative after:flex after:bg-[var(--primary-color)] after:w-8">
              estabelecimento
            </span>
            <select
              id="estabelecimento"
              className="bg-transparent appearance-none cursor-pointer px-2 py-1"
            >
              <option value="todos">Todos</option>
            </select>
          </div>
          <div className="flex flex-col">
            <span className="capitalize font-sm font-semibold after:h-0.5 after:left-[-7px] after:relative after:flex after:bg-[var(--primary-color)] after:w-8">
              modelo
            </span>
            <select
              id="modelo"
              className="bg-transparent appearance-none cursor-pointer px-2 py-1"
            >
              <option value="todos">Todos</option>
            </select>
          </div>
          <div className="flex flex-col">
            <span className="capitalize font-sm font-semibold after:h-0.5 after:left-[-7px] after:relative after:flex after:bg-[var(--primary-color)] after:w-8">
              serial
            </span>
            <select
              id="serial"
              className="bg-transparent appearance-none cursor-pointer px-2 py-1"
            >
              <option value="todos">Todos</option>
            </select>
          </div>
          <div className="flex flex-col">
            <span className="capitalize font-sm font-semibold after:h-0.5 after:left-[-7px] after:relative after:flex after:bg-[var(--primary-color)] after:w-8">
              inventario
            </span>
            <select
              id="inventario"
              className="bg-transparent appearance-none cursor-pointer px-2 py-1"
            >
              <option value="todos">Todos</option>
            </select>
          </div>
          <div className="flex flex-col">
            <span className="capitalize font-sm font-semibold after:h-0.5 after:left-[-7px] after:relative after:flex after:bg-[var(--primary-color)] after:w-8">
              situação
            </span>
            <select
              id="situacao"
              className="bg-transparent appearance-none cursor-pointer px-2 py-1"
            >
              <option value="todos">Todos</option>
              <option value="em uso">em uso</option>
              <option value="bloqueado">bloqueado</option>
              <option value="manuntencao">manuntenção</option>
              <option value="danificado">danificado</option>
              <option value="recolhimento">recolhimento</option>
              <option value="sem uso">sem uso</option>
              <option value="nao localizado">não localizado</option>
              <option value="a venda">à venda</option>
              <option value="disponivel">disponivel</option>
            </select>
          </div>
          <div className="flex flex-col">
            <span className="capitalize font-sm font-semibold after:h-0.5 after:left-[-7px] after:relative after:flex after:bg-[var(--primary-color)] after:w-8">
              Representante
            </span>
            <select
              id="status"
              className="bg-transparent appearance-none cursor-pointer px-2 py-1"
            >
              <option value="Todos">Todos</option>
            </select>
          </div>
          <div className="flex flex-col">
            <span className="capitalize font-sm font-semibold after:h-0.5 after:left-[-7px] after:relative after:flex after:bg-[var(--primary-color)] after:w-8">
              status
            </span>
            <select
              id="status"
              className="bg-transparent appearance-none cursor-pointer px-2 py-1"
            >
              <option value="Todos">Todos</option>
              <option value="ativos">ativos</option>
              <option value="inativos">inativos</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-10 my-20">
          {data ? (
            data.map((item, i) => {
              return (
                <div
                  key={i}
                  className={` px-12 flex justify-between items-center text-[var(--title-primary-color)] py-8 rounded  w-full bg-[var(--background-secound-color)] border-l-8 ${
                    item.status == "Credenciamento Finalizado"
                      ? "border-green-600"
                      : "border-red-500"
                  }`}
                >
                  <NavLink
                    to={`/estabelecimentos/${item.ID}`}
                    className="flex items-center gap-12  transition "
                  >
                    <div className="flex flex-col  gap-2  ">
                      <div className="flex gap-2">
                        <CiUser size={20} />
                        <span className="font-bold">{item.nome}</span>
                      </div>
                      <div className="flex gap-2">
                        <HiIdentification size={20} />
                        <span className="text-sm">{item.documento}</span>
                      </div>
                    </div>
                    <MdArrowForwardIos size={25} />
                    <div className="flex flex-col gap-2 max-[1000px]:hidden">
                      <div className="flex gap-2">
                        {item.status == "Credenciamento Finalizado" ? (
                          <GrStatusGood size={20} />
                        ) : (
                          <BiLoader size={20} />
                        )}

                        <span className="font-bold">{item.etapa}</span>
                      </div>
                      <div className="flex gap-2">
                        {item.status == "Credenciamento Finalizado" ? (
                          <GrStatusGood size={20} />
                        ) : (
                          <GrStatusCritical size={20} />
                        )}

                        <span className="text-sm">{item.status}</span>
                      </div>
                    </div>
                    <MdArrowForwardIos size={25} />
                    <div className="flex flex-col gap-2 max-[1000px]:hidden">
                      <div className="flex gap-2">
                        <BiHome size={20} />
                        <span className="font-bold">{item.marketplace}</span>
                      </div>
                      <div className="flex gap-2">
                        <BiCalendar size={20} />
                        <span className="text-sm">{item.criadoEm}</span>
                      </div>
                    </div>
                  </NavLink>
                  <div className="flex gap-3">
                    <NavLink
                      to={`/Estabelecimentos/${item.ID}`}
                      className="flex flex-col gap-2  transition "
                    >
                      <BiInfoCircle size={30} />
                    </NavLink>
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
          <div className="flex gap-2 w-full justify-center">
            <IoIosArrowBack
              size={25}
              onClick={() => {
                setPages((prev) => {
                  if (prev.current > 1)
                    return { ...prev, current: prev.current - 1 };
                  return { ...prev };
                });
              }}
              cursor="pointer"
            />
            <span>{pages.current}</span>
            <IoIosArrowForward
              size={25}
              onClick={() => {
                setPages((prev) => {
                  if (prev.current < pages.total)
                    return { ...prev, current: prev.current + 1 };
                  return { ...prev };
                });
              }}
              cursor="pointer"
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default Estabelecimentos;

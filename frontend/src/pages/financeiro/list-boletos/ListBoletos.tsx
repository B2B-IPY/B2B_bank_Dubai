import axios from "axios";
import $ from "jquery";
import { useEffect, useState } from "react";
import { BiCalendar, BiLinkExternal } from "react-icons/bi";
import { CiBellOn, CiDollar, CiTrash, CiUser } from "react-icons/ci";
import { HiEye, HiEyeOff } from "react-icons/hi";

import { IoIosArrowForward } from "react-icons/io";
import { MdArrowForwardIos, MdOutlineCurrencyExchange } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import tempoExpiracaoToken from "../../../functions/tempoExpiracaoToken";
import { hiddenDados } from "../../../functions/toggleHidden";

import { TbPigMoney } from "react-icons/tb";
import boletoPdf from "../../../functions/createBoletoPDF";
import normalizeTimeStamp from "../../../functions/normalizeTimeStamp";
import { formatarNumeroParaBRL } from "../../../functions/moeda";

function convertDate(isoDateString: string): string {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  return `${formattedDate} ${formattedTime}`;
}
interface Boleto {
  data: {
    application_ids: string[];
    auto_close: boolean;
    batch_id_with_returns: string | null;
    cancel_requested_at: string | null;
    closed_date: string;
    company_id: string;
    created_at: string;
    created_by_id: string;
    finish_date: string | null;
    id: number;
    is_withdraw: boolean;
    name: string;
    number: string;
    processed: boolean;
    receipt_file_name: string | null;
    received_bank_account_id: string;
    received_date: string | null;
    received_observations: string | null;
    reconciled: boolean;
    returned_date: string | null;
    returned_receipt_file_name: string | null;
    sent_to_cancel_at: string | null;
    source: string;
    spreadsheet_file_name: string | null;
    status: string;
    transfers_list_report_file: string | null;
    type: string;
    updated_at: string;
    value: number;
  }[];
}
function ListBoletos() {
  $(() => {
    $(".MONEY").mask("000.000.000,00", { reverse: true });
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const headers = {
    headers: {
      "x-access-token": localStorage.getItem("x-access-token"),
    },
  };
  const navigate = useNavigate();
  const [data, setData] = useState<Boleto>({ data: [] });
  useEffect(() => {
    setIsLoading(true);

    axios
      .get(
        "https://api.binbank.com.br/billing/boleto",

        headers
      )
      .then(({ data }) => {
        console.log(data);

        setData(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Ocorreu um erro ao buscar os dados");
      })
      .finally(() => {
        setIsLoading(false);
      });
    if (
      !tempoExpiracaoToken(localStorage.getItem("x-access-token") as string)
    ) {
      navigate("/login");
    }
  }, []);
  const { isHidden, toggleHidden } = hiddenDados();
  function dataVencimento(created_at: string) {
    const dueDate = new Date(created_at);
    dueDate.setDate(dueDate.getDate() + 2);
    const formattedDueDate = dueDate.toISOString().split("T")[0];
    return formattedDueDate;
  }

  return (
    <>
      <main className="pt-12 px-[5%] h-full overflow-y-auto bg-[var(--background-primary-color)]">
        <div className="flex justify-between items-center gap-10 w-full ">
          <div className="flex flex-col  w-[350px]"></div>
          <div className="flex gap-2 items-center flex-wrap">
            <div className="flex">
              {isHidden ? (
                <HiEyeOff
                  className="cursor-pointer hover:opacity-80 transition"
                  onClick={toggleHidden}
                />
              ) : (
                <HiEye
                  className="cursor-pointer hover:opacity-80 transition"
                  onClick={toggleHidden}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10 my-20">
          {data ? (
            data.data.map((obj, i) => {
              return (
                <div
                  key={i}
                  className="flex gap-3 items-center justify-between border-b border-[var(--primary-color)] ml-[2%] pl-[2%] pr-[5%] py-4 rounded-lg"
                >
                  <div className="flex gap-3 items-center">
                    <span
                      className={`flex rounded-full p-1 bg-${
                        obj.status === "PENDING"
                          ? "yellow"
                          : obj.status === "CONFIRMED" ||
                            obj.status === "RECEIVED"
                          ? "green"
                          : "red"
                      }-500`}
                    ></span>

                    <div className="flex gap-2 items-center ">
                      <div className="flex gap-2  items-center">
                        <span>Status :</span>
                        <span className="capitalize">
                          {obj.status.toLocaleLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-8 items-center max-[1000px]:hidden">
                    <div className="flex-col flex gap-3 text-sm">
                      <span className="font-semibold">Criado em</span>
                      <span>{obj.created_at.split("T")[0]}</span>
                    </div>
                    <div className="flex-col flex gap-3 text-sm">
                      <span className="font-semibold">Vencimento</span>
                      <span>{dataVencimento(obj.created_at)}</span>
                    </div>
                  </div>
                  <span>
                    {isHidden
                      ? "R$ ********"
                      : `R$ ${formatarNumeroParaBRL(obj.value)}`}
                  </span>
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
        </div>
      </main>
    </>
  );
}

export default ListBoletos;

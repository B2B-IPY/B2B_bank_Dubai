import axios from "axios";
import $ from "jquery";
import "jquery-mask-plugin";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import tempoExpiracaoToken from "../../../functions/tempoExpiracaoToken";
import { useNavigate } from "react-router-dom";
import { BiKey, BiUser } from "react-icons/bi";
import { HiCash } from "react-icons/hi";
import { GrClose } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ComprovantePix } from "../../../functions/createPixPDF";
import io from "socket.io-client";

interface data {
  amount: number;
  key: string;
  code: string;
}
export interface PixResponse {
  statusCode: number;
  transactionId: string;
  data: {
    account: string;
    amount: string;
    bankName: string;
    branch: string;
    createdAt: string;
    documentNumber: string;
    externalId: string;
    isbp: string;
    key: string;
    name: string;
    remittanceInformation: string;
    status: string;
    subType: string;
    type: string;
    typeKey: string;
    uuid: string;
  };
}

interface BankData {
  documentNumber: string;
  endtoendId: string;
  originalendtoendId: string | null;
  key: string;
  name: string | null;
  tspb: string;
  account: string;
}

interface Transaction {
  transactionId: string;
  uuid: string;
  externalId: string;
  amount: number;
  subType: string;
  type: string;
  tspb: string;
  account: string;
}

interface FinancialEvent {
  uuid: string;
  bankData: BankData;
  transaction: Transaction;
  status: string;
  event: string;
}

function BRLtoNumber(brl: string) {
  return parseFloat(brl.replace(".", "").replace(",", "."));
}

function formatarNumeroParaBRL(numero: number): string {
  const formatoMoeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return formatoMoeda.format(numero).replace("R$", "").trim();
}

const TransferirPix: React.FC = () => {
  const [data, setData] = useState<data>({
    amount: 0,
    key: "",
    code: "",
  });
  const [res, setRes] = useState<PixResponse>({
    statusCode: 0,
    transactionId: "",
    data: {
      account: "",
      amount: "",
      bankName: "",
      branch: "",
      createdAt: "",
      documentNumber: "",
      externalId: "",
      isbp: "",
      key: "",
      name: "",
      remittanceInformation: "",
      status: "",
      subType: "",
      type: "",
      typeKey: "",
      uuid: "",
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [totpModal, setTotpModal] = useState<boolean>(false);

  const [webhook_response, setWebhook_response] = useState<any>(null);

  $(() => {
    $(".MONEY").mask("###.000,00", { reverse: true });
    $(".TOTP").mask("000 000");
  });
  const headers = {
    headers: {
      "x-access-token": localStorage.getItem("x-access-token"),
    },
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!tempoExpiracaoToken(localStorage.getItem("x-access-token") as string))
      navigate("/login");
  }, []);

  function transfer() {
    axios
      .post(
        "https://api.binbank.com.br/pix/transfer",
        {
          key: data.key,
          amount: data.amount,
        },

        headers
      )
      .then((res) => {
        setIsLoading(true);
        setRes(res.data);
        const currentTime = new Date().toLocaleTimeString();
        toast.warn("Aguarde, a transferência está sendo processada...", {
          autoClose: 13000,
        });
        const datenow = new Date().toLocaleDateString("pt-BR").split("T")[0];
        const socket = io("https://api.binbank.com.br", {
          path: "/socket.io/", // Certifique-se de que o caminho está correto
          transports: ["websocket"], // Força o uso de WebSockets
        });

        socket.on("webhook-data", (data) => {
          console.log("Dados recebidos do webhook:", data);
          setWebhook_response(data);
          if (data.event === "PIX_PAY_OUT") {
            const blob = ComprovantePix(
              data.bankData.key,
              data.bankData.name,
              data.bankData.documentNumber,
              data.transaction.ispb,
              formatarNumeroParaBRL(data.transaction.amount),
              data.transaction.transactionId,
              datenow,
              currentTime
            );
            setIframeUrl(blob);
            toast.success("Transferência realizada com sucesso");
          }
        });

        return () => {
          socket.disconnect();
        };
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 400)
          return toast.warn(err.response.data.message);
        toast.error("Ocorreu um erro na transferência");
      })
      .finally(() => {
        setIsLoading(false);
        setModalVisible(false);
      });
  }
  return (
    <>
      <div className="gap-10 flex-col w-full h-screen overflow-y-auto flex items-center  bg-[var(--background-primary-color)] max-[1000px]:bg-[var(--background-secound-color)]">
        {iframeUrl && (
          <dialog className="backdrop-blur-xl flex flex-col justify-center items-center bg-transparent h-full w-full absolute p-2 top-0 overflow-y-auto">
            <iframe src={iframeUrl} className="w-[700px] h-full" />
            <div
              onClick={() => {
                setIframeUrl(null);
              }}
              className="w-[700px] text-center bg-[var(--active-color)] text-white p-2 cursor-pointer font-semibold"
            >
              Fechar
            </div>
          </dialog>
        )}
        {totpModal && (
          <dialog className="backdrop-blur-xl flex justify-center items-center bg-transparent h-full w-full absolute py-20 top-0 overflow-y-auto">
            <div className="flex flex-col   items-center justify-center bg-[var(--background-secound-color)] border-2 border-[var(--border-color2)]">
              <div className="flex w-full text-[var(--title-primary-color)] items-center justify-between px-4 py-6 border-b border-[var(--border-color2)]">
                <span className="text-[18px] font-semibold">
                  Confirme o TOTP
                </span>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setTotpModal(false);
                  }}
                >
                  <MdClose className="text-[26px] " />
                </div>
              </div>

              <div className="w-full flex flex-col items-center ">
                <div className="w-[90%] flex flex-col py-4 gap-4 border-b-2 border-[var(--border-color)] ">
                  <span className=" text-[var(--title-primary-color)] text-[18px] font-semibold">
                    Digite o código de autenticação digital
                  </span>
                  <span className="text-[15px] text-[var(--title-primary-color)]">
                    Enviamos o código de autenticação para seu GOOGLE
                    AUTHENTICATOR.
                  </span>
                  <div className="flex">
                    <input
                      type="text"
                      id="totpCode"
                      onInput={(e) => {
                        const value = e.currentTarget.value;
                        setData({
                          ...data,
                          code: value,
                        });
                      }}
                      className="TOTP text-[var(--white-color2)]  border-2 border-[var(--border-color2)] rounded-lg px-4 w py-2 w-[80%] focus:border-[var(--active-color)] focus:border-2 bg-transparent"
                      placeholder="000000"
                    />
                  </div>
                  <div className="flex">
                    <div
                      onClick={() => {
                        setTotpModal(false);
                      }}
                      className="flex w-[full] gap-2 cursor-pointer items-center text-[#2c80ff]"
                    >
                      <IoMdArrowRoundBack /> Voltar
                    </div>
                  </div>
                </div>
                <div className="w-[90%] flex justify-end py-5 gap-4">
                  <button
                    onClick={() => {
                      if (isLoading) return;
                      if (!data.code) return toast.warn("digite o TOTP");
                      setIsLoading(true);
                      axios
                        .post(
                          "https://api.binbank.com.br/pix/transfer",
                          {
                            key: data.key,
                            amount: data.amount,
                            code: data.code,
                          },

                          headers
                        )
                        .then((res) => {
                          setTotpModal(false);
                          setIsLoading(true);
                          setRes(res.data);
                          const currentTime = new Date().toLocaleTimeString();
                          toast.warn(
                            "Aguarde, a transferência está sendo processada...",
                            {
                              autoClose: 13000,
                            }
                          );
                          const datenow = new Date()
                            .toLocaleDateString("pt-BR")
                            .split("T")[0];
                          const socket = io("https://api.binbank.com.br", {
                            path: "/socket.io/", // Certifique-se de que o caminho está correto
                            transports: ["websocket"], // Força o uso de WebSockets
                          });

                          socket.on("webhook-data", (data) => {
                            console.log("Dados recebidos do webhook:", data);
                            setWebhook_response(data);
                            if (data.event === "PIX_PAY_OUT") {
                              const blob = ComprovantePix(
                                data.bankData.key,
                                data.bankData.name,
                                data.bankData.documentNumber,
                                data.transaction.ispb,
                                formatarNumeroParaBRL(data.transaction.amount),
                                data.transaction.transactionId,
                                datenow,
                                currentTime
                              );
                              setIframeUrl(blob);
                              toast.success(
                                "Transferência realizada com sucesso"
                              );
                            }
                          });

                          return () => {
                            socket.disconnect();
                          };
                        })
                        .catch((err) => {
                          console.error(err);
                          if (err.response.status === 400)
                            return toast.warn(err.response.data.message);
                          toast.error("Ocorreu um erro na transferência");
                        })
                        .finally(() => {
                          setIsLoading(false);
                          setModalVisible(false);
                        });
                    }}
                    className=" transition flex gap-2 items-center justify-center h-10 text-[var(--white-color2)]  focus:outline-none  font-medium rounded-lg text-sm w-[140px]  py-2 text-center bg-[var(--primary-color)] hover:bg-transparent hover:border-[var(--primary-color)] hover:border-2 hover:text-[var(--primary-color)]"
                  >
                    {isLoading ? "carregando..." : "Transferir"}
                  </button>
                </div>
              </div>
            </div>
          </dialog>
        )}

        <dialog
          open={modalVisible}
          className="backdrop-blur-xl	 bg-transparent h-full w-full absolute top-0"
        >
          <div className="h-full w-full bg-transparent flex items-center justify-center ">
            <form
              className="bg-[var(--background-secound-color)] max-[1000px]:border max-[1000px]:border-gray-500/50 max-[1000px]:px-10 max-[1000px]:py-5 rounded-xl  flex flex-col justify-between"
              onSubmit={(e) => {
                e.preventDefault();
                setModalVisible(false);
              }}
            >
              <div className="pl-3 pt-3">
                <GrClose
                  className="text-gray-200 cursor-pointer"
                  onClick={() => {
                    setModalVisible(false);
                  }}
                />
              </div>
              <div className="flex  w-full max-[1000px]:items-center max-[1000px]:px-20 min-[1000px]:px-40 mt-20 flex-col gap-4">
                <div className="flex-col gap-4 flex">
                  <div className="text-gray-300 flex items-center gap-4">
                    <BiKey size={25} />
                    <span className="text-bold text-sm">{data.key}</span>
                  </div>
                  <div className="text-gray-300 flex items-center gap-4">
                    <HiCash size={25} />
                    <span className="text-bold text-sm">
                      R$ {formatarNumeroParaBRL(data.amount || 0)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-10 w-full justify-center mb-10  mt-10 items-center ">
                <button
                  type="button"
                  disabled={!isLoading ? false : true}
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setModalVisible(false);
                      setTotpModal(true);
                      setIsLoading(false);
                    }, 500);
                  }}
                  className={`max-[1000px]:w-[90%] transition min-[1000px]:px-20 text-white focus:outline-none font-medium rounded-lg text-sm py-2.5 text-center bg-[var(--primary-color)]  ${
                    !isLoading ? "cursor-pointer" : ""
                  }  ${
                    !isLoading ? "hover:bg-[var(--hover-primary-color)]" : ""
                  }`}
                >
                  {isLoading ? "carregando..." : "Pagar"}
                </button>
              </div>
            </form>
          </div>
        </dialog>

        <section className="max-[1000px]:w-full max-[1000px]:h-full w-[800px] my-10">
          <div className="flex flex-col items-center  px-6 py-8 mx-auto max-[1000px]:px-0 max-[1000px]:py-0  lg:py-0 w-full h-full">
            {!modalVisible && (
              <div className="w-full  min-[1000px]:bg-[var(--background-secound-color)] rounded-lg shadow  md:mt-0 xl:p-0 w-full h-full">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-[var(--title-primary-color)] md:text-2xl">
                    Transferir Pix
                  </h1>
                  <form
                    className="space-y-4 md:space-y-6"
                    id="form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (isLoading) return;
                      setIsLoading(true);

                      if (!data.amount) {
                        setIsLoading(false);
                        return toast.warning("valor invalido");
                      }
                      setModalVisible(true);
                      setIsLoading(false);
                    }}
                  >
                    <div className="flex flex-col gap-10 w-full max-[1000px]:flex-col">
                      <div className="grid md:grid-cols-1 gap-5 w-full">
                        <div>
                          <label
                            htmlFor="chave"
                            className="block mb-2 text-sm font-medium text-[var(--title-primary-color)] "
                          >
                            chave
                          </label>

                          <div className="flex w-full gap-5 justify-between">
                            <input
                              type="text"
                              id="key"
                              className="w-full bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block  p-2.5 max-[1000px]:bg-transparent  max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)]"
                              required
                              onInput={(e) => {
                                const value = e.currentTarget.value;

                                setData({
                                  ...data,
                                  key: value,
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <h2 className="text-[var(--title-primary-color)] text-xl font-bold">
                        Dados da Transferência
                      </h2>
                      <div className="grid gap-5 w-full">
                        <div>
                          <label
                            htmlFor="valor"
                            className="block mb-2 text-sm font-medium text-[var(--title-primary-color)] "
                          >
                            valor
                          </label>
                          <input
                            type="text"
                            id="valor"
                            placeholder="0"
                            className="MONEY bg-transparent border border-gray-300 text-[var(--title-primary-color)] sm:text-sm rounded-lg focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block w-full p-2.5 max-[1000px]:bg-transparent max-[1000px]:focus:outline-none max-[1000px]:focus:ring-1 max-[1000px]:focus:border-[var(--primary-color)]"
                            onInput={(e) => {
                              setData({
                                ...data,
                                amount: BRLtoNumber(e.currentTarget.value),
                              });
                            }}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">
                      Será cobrado uma taxa fixa adicional no valor de R$ 0,15
                    </span>
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="w-full   transition text-white focus:outline-none hover:bg-[var(--hover-primary-color)] font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[var(--primary-color)]"
                    >
                      {isLoading ? "carregando..." : "continuar"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};
export default TransferirPix;

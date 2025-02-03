import { Response } from "express";
import { UserRequest } from "../../interfaces/UserRequest";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

interface DashboardClienteResponse {
   total: {
      cashin: number;
      cashout: number;
      taxas: number;
   };
   tpv: {
      mes_atual: number;
      mes_anterior: number;
      relatorio_ultimo_ano: { valor: number }[];
   };
   cashin: {
      mes_atual: number;
      mes_anterior: number;
      relatorio_ultimo_ano: { valor: number }[];
   };
   cashout: {
      mes_atual: number;
      mes_anterior: number;
      relatorio_ultimo_ano: { valor: number }[];
   };
   ticket_medio: {
      mes_atual: number;
      mes_anterior: number;
      relatorio_ultimo_ano: { valor: number }[];
   };
   quantidade_de_transacoes: {
      mes_atual: number;
      mes_anterior: number;
      relatorio_ultimo_ano: { valor: number }[];
   };
   tarifas: {
      mes_atual: number;
      mes_anterior: number;
   };
   users: {}[];
   transacoes: {}[];
}

export default async function dashboardCliente(
   req: UserRequest,
   res: Response
) {
   const SDK = new SDK_DubaiCash_B2B();

   const transactions = await SDK.Transactions.Extrato();
   console.log(transactions.data.extract[1]);
   const transactionsFiltered = transactions.data.extract.filter(
      (transaction: any) => {
         if (!transaction.data.externalId) return;
         return transaction.data.externalId.split("/")[0] == req.id_logins;
      }
   );

   const total: DashboardClienteResponse = {
      total: {
         cashin: 0,
         cashout: 0,
         taxas: 0,
      },
      tpv: {
         mes_atual: 0,
         mes_anterior: 0,
         relatorio_ultimo_ano: [],
      },
      cashin: {
         mes_atual: 0,
         mes_anterior: 0,
         relatorio_ultimo_ano: [],
      },
      cashout: {
         mes_atual: 0,
         mes_anterior: 0,
         relatorio_ultimo_ano: [],
      },
      ticket_medio: {
         mes_atual: 0,
         mes_anterior: 0,
         relatorio_ultimo_ano: [],
      },
      quantidade_de_transacoes: {
         mes_atual: 0,
         mes_anterior: 0,
         relatorio_ultimo_ano: [],
      },
      tarifas: {
         mes_atual: 0,
         mes_anterior: 0,
      },
      users: [],
      transacoes: [],
   };

   // // Calcular o TPV (Total Payment Volume)
   // const TPV = transactionsFiltered
   //    .filter(
   //       (transaction: any) =>
   //          transaction.data.type === "DEBIT" ||
   //          transaction.data.type === "CREDIT"
   //    )
   //    .reduce(
   //       (total: number, transaction: any) =>
   //          total + parseFloat(transaction.data.amount),
   //       0
   //    );

   // console.log(TPV);

   let cashout = 0;
   for (let transaction of transactionsFiltered) {
      if (transaction.data.type === "DEBIT") {
         cashout = total.total.cashout += parseFloat(transaction.data.amount);
      }
   }

   const tpvPorMes = transactionsFiltered
      .filter(
         (transaction: any) =>
            transaction.data.type === "DEBIT" ||
            transaction.data.type === "CREDIT"
      )
      .reduce((acc: any, transaction: any) => {
         const month = new Date(transaction.data.createdAt).getMonth();
         const year = new Date(transaction.data.createdAt).getFullYear();
         const key = `${year}-${month + 1}`;
         if (!acc[key]) {
            acc[key] = 0; // Inicializa a chave caso ainda não exista
         }

         acc[key] += parseFloat(transaction.data.amount);
         return acc;
      }, {});

   const currentMonth = new Date().getMonth() + 1;
   const currentYear = new Date().getFullYear();
   const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
   const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

   const TPVAtual = tpvPorMes[`${currentYear}-${currentMonth}`] || 0;
   const TPVAnterior = tpvPorMes[`${lastMonthYear}-${lastMonth}`] || 0;

   const cashoutPorMes = transactionsFiltered
      .filter((transaction: any) => transaction.data.type === "DEBIT")
      .reduce((acc: any, transaction: any) => {
         const month = new Date(transaction.data.createdAt).getMonth();
         const year = new Date(transaction.data.createdAt).getFullYear();
         const key = `${year}-${month + 1}`;
         if (!acc[key]) {
            acc[key] = { total: 0, count: 0 }; // Inicializa a chave caso ainda não exista
         }

         acc[key].total += parseFloat(transaction.data.amount);
         acc[key].count += 1;
         return acc;
      }, {});

   const cashoutAtual = cashoutPorMes[`${currentYear}-${currentMonth}`] || {
      total: 0,
      count: 0,
   };
   const cashoutAnterior = cashoutPorMes[`${lastMonthYear}-${lastMonth}`] || {
      total: 0,
      count: 0,
   };

   return res.status(200).json({
      ...total,
      total: {
         cashin: 0,
         cashout: cashout,
         taxas: 0,
      },
      quantidade_de_transacoes: {
         mes_atual: cashoutAtual.count,
         mes_anterior: cashoutAnterior.count,
         relatorio_ultimo_ano: [],
      },
      cashout: {
         mes_atual: cashoutAtual.total,
         mes_anterior: cashoutAnterior.total,
         relatorio_ultimo_ano: [],
      },
      tpv: {
         mes_atual: TPVAtual,
         mes_anterior: TPVAnterior,
         relatorio_ultimo_ano: [],
      },
      ticket_medio: {
         mes_atual: 0,
         mes_anterior: 0,
         relatorio_ultimo_ano: [],
      },
   });
}

# API PIX 📜

Com API você pode integrar o PIX ao seu sistema.
obs: Alguns valores devem ser tratados como centavos

## URL BASE

 `https://api.bank.bancastro.com.br`

## Rotas 


 `post` **/login**
<br>
body:
```
{
	"user":"usuario_do_gustavo",
	"password":"senha_do_gustavo"
}
```

<br>
<br>
<br>

 `get` **/balance**
<br>
Verifica o saldo disponivel em conta

Headers:
```
{
	"x-access-token":"token recebido pela rota /login",
}
```
<br>
<br>
<br>

 `post` **/dashboard**
<br>
Verifica todos os dados da conta

Headers:
```
{
	"x-access-token":"token recebido pela rota /login",
}
```
<br>
<br>
<br>

## CASHOUT
<br>

 `post` **/transferir/pix**


Headers:
```
{
	"x-access-token":"token recebido pela rota /login",
}
```

<br>

Body:
```
{
  "amount": 10000,
  "name": "Fatimah Ardrey",
  "taxId": "***.871.260-**",
  "bankCode": "05222094",
  "branchCode": "*0dATnPHFMD36u0MrAr2DuA15jzOL2ubkhFe4qqGEO74Gf82s231kg+YYhjU4Fr7v",
  "accountNumber": "*+GRQf/fWMTmcBOcqDpTrk1TkuKvBbxQ4oDJAv7GA4cUyzU6U2c2CXT2qFQe9r4kYhQoKjkKFbcCWuo7bfMh3zm68xuNMRuwxbxCBfB1zW8w/ZiZIdBz7ZQXwXJONl9S3"
}
```

<br>
<br>
<br>


 `post` **/transferir/boleto**


Headers:
```
{
	"x-access-token":"token recebido pela rota /login",
}
```

<br>

Body:
```
{  
  "line": "26090387873966093725124200000008198000000002000",
  "taxId": "33.435.177/0001-22"  
}
```

<br>
<br>
<br>


 `get` **/transferir/extrato**


Headers:
```
{
	"x-access-token":"token recebido pela rota /login",
}
```

<br>
<br>
<br>









## CASHIN
<br>

 `post` **/transferir/pix/qr-code**


Headers:
```
{
	"x-access-token":"token recebido pela rota /login",
}
```

<br>

Body:
```
{  
  "amount": "100"
  
}
```

<br>
<br>
<br>


 `post` **/boleto**


Headers:
```
{
	"x-access-token":"token recebido pela rota /login",
}
```
<br>

Body:
```
{
  "amount": 1000,
  "name": "Iron Bank S.A.",
  "taxId": "20.048.153/6001-80",
  "streetLine1": "Av. Faria Lima, 1844",
  "streetLine2": "CJ 13",
  "district": "Itaim Bibi",
  "city": "São Paulo",
  "stateCode": "SP",
  "zipCode": "01500-000"
}
```

<br>
<br>
<br>


 `get` **/boleto/pdf/:id**

Exemplo: /boleto/pdf/6068705911898112

Headers:
```
{
	"x-access-token":"token recebido pela rota /login",
}
```

<br>
<br>
<br>




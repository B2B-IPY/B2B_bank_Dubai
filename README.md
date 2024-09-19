# API PIX 📜

Com API você pode integrar o PIX ao seu sistema.
obs: Alguns valores devem ser tratados como centavos

## URL BASE

 `https://api.bank.bancastro.com.br`

## Rotas 


 `post` **/login**
<br>
body:
```json
{
	"user":		"usuario_do_gustavo",
	"password":	"senha_do_gustavo"
}
```
<br>

Response:
```typescript
export interface Login {
    dadosBancarios: DadosBancario[];
    balance:        Balance;
    role:           string;
    secret: 	    boolean;
    new_secret:     string;
    qr_code:        string;
}

export interface Balance {
    id:       string;
    amount:   number;
    currency: string;
    updated:  string;
}

export interface DadosBancario {
    id:             string;
    type:           string;
    accountCreated: null;
    accountType:    string;
    name:           string;
    taxId:          string;
    ownerType:      null;
    bankName:       string;
    ispb:           string;
    branchCode:     string;
    accountNumber:  string;
    status:         string;
}
```

<br>
<br>
<br>

 `post` **/ativar2fa**
<br>
body:
```json
{
	"user":		"usuario_do_gustavo",
	"password":	"senha_do_gustavo",
	"new_secret":	"new_secret",
	"code":		"codigo_do_authenticator_do_gustavo"
}
```
<br>

Response:
```json
{
	"status": "autenticação de dois fatores ativada com sucesso!"
}
```

<br>
<br>
<br>

 `post` **/login2fa**
<br>
body:
```json
{
	"user":		"usuario_do_gustavo",
	"password":	"senha_do_gustavo"
	"code":		"codigo_do_authenticator_gustavo"
}
```
<br>

Response:
```typescript
export interface Login {
    	isLogged:       boolean;
    	token:          string;
}
```

<br>
<br>
<br>

 `get` **/delete-secret/:user**
<br>
Exemplo: /delete-secret/gustavo123

Headers:
```json
{
	"x-access-token":"token recebido pela rota /login",
}
```
<br>

Response:
```json
{
	"status": "Autenticação de dois fatores removida "
}
```

<br>
<br>
<br>

 `get` **/balance**
<br>
Verifica o saldo disponivel em conta

Headers:
```json
{
	"x-access-token":"token recebido pela rota /login",
}
```
<br>

Response:
```typescript
export interface Balance {
    id:       string;
    amount:   number;
    currency: string;
    updated:  string;
}
```


<br>
<br>
<br>

 `post` **/dashboard**
<br>
Verifica todos os dados da conta

Headers:
```json
{
	"x-access-token":"token recebido pela rota /login",
}
```
<br>

Response:
```typescript
export interface Dashboard {
    tpv:                      Cashin;
    cashin:                   Cashin;
    cashout:                  Cashin;
    quantidade_de_transacoes: Cashin;
    ticket_medio:             TicketMedio;
}

export interface Cashin {
    mes_atual:            number;
    mes_anterior:         number;
    relatorio_ultimo_ano: RelatorioUltimoAno[];
}

export interface RelatorioUltimoAno {
    name: string;
    uv:   number;
    pv:   number;
    amt:  number;
}

export interface TicketMedio {
    mes_atual:    number;
    mes_anterior: number;
}
```


<br>
<br>
<br>

`GET` **/transferir/pix/verificar/:chavePix**

Exemplo: /transferir/pix/verificar/+5577991922123


Headers:
```json
{
	"x-access-token":"token recebido pela rota /login",
}
```

<br>


Response:
```typescript
export interface ChavePix {
    id:             string;
    type:           string;
    accountCreated: null;
    accountType:    string;
    name:           string;
    taxId:          string;
    ownerType:      null;
    bankName:       string;
    ispb:           string;
    branchCode:     string;
    accountNumber:  string;
    status:         string;
}
```


<br>
<br>
<br>

## CASHOUT
<br>

 `post` **/transferir/pix**


Headers:
```json
{
	"x-access-token":"token recebido pela rota /login",
}
```

<br>

Body:
```json
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

Response:
```typescript
export interface Pix {
    id:                 string;
    amount:             number;
    name:               string;
    taxId:              string;
    bankCode:           string;
    branchCode:         string;
    accountNumber:      string;
    accountType:        string;
    externalId:         string;
    scheduled:          string;
    description:        string;
    displayDescription: string;
    tags:               string[];
    rules:              any[];
    fee:                number;
    status:             string;
    transactionIds:     any[];
    metadata:           Metadata;
    created:            string;
    updated:            string;
}

export interface Metadata {
}
```


<br>
<br>
<br>


 `post` **/transferir/boleto**


Headers:
```json
{
	"x-access-token":"token recebido pela rota /login",
}
```

<br>

Body:
```json
{  
  "line": "26090387873966093725124200000008198000000002000",
  "taxId": "33.435.177/0001-22"  
}
```
<br>

Response base64:
```
string
```


<br>
<br>
<br>


 `get` **/transferir/extrato**


Headers:
```json
{
	"x-access-token":"token recebido pela rota /login",
}
```
<br>

Response:
```typescript
export interface Extrato {
    cashout: Cashout[];
    cashin:  Cashin[];
}

export interface Cashin {
    id:          string;
    amount:      number;
    description: string;
    externalId:  string;
    receiverId:  string;
    senderId:    string;
    tags:        string[];
    fee:         number;
    source:      string;
    balance:     number;
    created:     string;
}



export interface Cashout {
    id:                 string;
    amount:             number;
    name:               string;
    taxId:              string;
    bankCode:           string;
    branchCode:         string;
    accountNumber:      string;
    accountType:        string;
    externalId:         string;
    scheduled:          string;
    description:        string;
    displayDescription: string;
    tags:               string[];
    rules:              any[];
    fee:                number;
    status:             string;
    transactionIds:     string[];
    metadata:           Metadata;
    created:            string;
    updated:            string;
}

export interface Metadata {
    authentication?: string;
}
```


<br>
<br>
<br>









## CASHIN
<br>

 `post` **/transferir/pix/qr-code**


Headers:
```json
{
	"x-access-token":"token recebido pela rota /login",
}
```

<br>

Body:
```json
{  
  "amount": "100"
  
}
```
<br>

Response:
```typescript
export interface PixQRcode {
    id:         string;
    amount:     number;
    expiration: number;
    tags:       any[];
    uuid:       string;
    pictureUrl: string;
    updated:    string;
    created:    string;
}
```


<br>
<br>
<br>


 `post` **/boleto**


Headers:
```json
{
	"x-access-token":"token recebido pela rota /login",
}
```
<br>

Body:
```json
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

Response:
```typescript
export interface Boleto {
    id:             string;
    amount:         number;
    name:           string;
    taxId:          string;
    streetLine1:    string;
    streetLine2:    string;
    district:       string;
    city:           string;
    stateCode:      string;
    zipCode:        string;
    due:            string;
    fine:           number;
    interest:       number;
    overdueLimit:   number;
    receiverName:   string;
    receiverTaxId:  string;
    tags:           any[];
    descriptions:   any[];
    discounts:      any[];
    fee:            number;
    line:           string;
    barCode:        string;
    status:         string;
    transactionIds: any[];
    workspaceId:    string;
    created:        string;
    ourNumber:      string;
    splits:         any[];
}
```


<br>
<br>
<br>


 `get` **/boleto/pdf/:id**

Exemplo: /boleto/pdf/6068705911898112

Headers:
```json
{
	"x-access-token":"token recebido pela rota /login",
}
```
<br>

Response base64:
```
string
```


<br>
<br>
<br>




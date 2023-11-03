
let jsonGlobalIncome={
    "date":"2023/10/31",
    "incomes":[
        {
            "date":"2023/10/01",
            "income":200.00,
            "currency":"THB",
            "source":"Arise Condo",
            "class":"Rental",
            "status":"collected"
          },{
            "date":"2023/10/01",
            "income":200.00,
            "currency":"USD",
            "source":"PGX",
            "class":"Devidend",
            "status":"scheduled"
          }
    ]
} ;

let jsonGlobalPortfolio={
    "date":"2023/10/31",
    "totalPL":3400,
    "accounts":[
        {
            "account":"海通证券1234",
            "equityTTM":2000000,
            "currency_e":"CNY",
            "debtTTM":320000,
            "currency_d":"HKD",
            "cashTTM":1000,
            "currency_c":"CNY",
            "pl_cash":320000,
            "pl_percent":0.1235,
            "pl_day":-1230,
            "pl_day_percent":-0.012
        },{
            "account":"IBKR0095",
            "equityTTM":2000000,
            "currency_e":"CNY",
            "debtTTM":320000,
            "currency_d":"HKD",
            "cashTTM":1000,
            "currency_c":"CNY",
            "pl_cash":320000,
            "pl_percent":0.1235,
            "pl_day":2715,
            "pl_day_percent":0.031
        }
    ]
} ;


const jsonGlobalAccount={
    "date":"2023/10/31",
    "account":"海通证券" ,
    "pl_total":1000.21,
    "holdings":[
        {
            "ticker":"HK00010",
            "company":"恒隆集团",
            "shares":10000,
            "cost":12.31,
            "price":10.20,
            "pl_total":-2100.0,
            "pl_total_percent":-0.09,
            "value":102000.0
        }
    ]
} ; 

const jsonGlobalExpenditure={
    "date":"2023/10/31",
    "expenditures":[
        {
            "date":"2023/10/04",
            "pay_for":"Gasline",
            "class":"transportation",
            "regular":"no",
            "amount":"1000",
            "currency":"THB"
        }
    ]
} ;

const puppeteer = require('puppeteer'); // v 1.1.0
const { URL } = require('url');
const fse = require('fs-extra'); // v 5.0.0
const path = require('path');
var fs = require('fs');
const fetch = require('node-fetch') ;
const Decimal = require('decimal.js');

const portfolioDB = require('better-sqlite3')('./public/SQLiteDB/PortfolioDB.db', { verbose: console.log });
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

let globalBrowwer = null ;
let globalPage = null ;


function cleanFloat(cFloat){
    return cFloat.replace(',','') ;
}

function _logJSON(jsonData){
    console.log(JSON.stringify(jsonData,null,3)) ;
}

function _log(title,cMessage){
    let cDate = new Date() ;
    let cLogMessage=`${cDate.toLocaleString()}:${cMessage}` ;
    logger.info(title, { message: cLogMessage });
}

async function _initBrowser(){
    globalBrowwer = await puppeteer.launch({headless:"new"});
    globalPage = await globalBrowwer.newPage();
    await globalPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36');

}

async function _exitBrowser(){
    await globalBrowwer.close(); 
    globalBrowwer = null ;
    globalPage = null ;
}




async function tryPuppeteerJSON(){
    await _initBrowser() ;
    let jsonData = await _fetchXQJSONAPI('00010') ;
    //console.log(JSON.stringify(jsonData,null,3)) ;
    _logJSON(jsonData) ;
    await _exitBrowser() ;
}



//https://finance.yahoo.com/quote/BN
async function _fetchQuoteYahoo_US(cTicker){

    let cURL = `https://finance.yahoo.com/quote/${cTicker}/` ;
    //await page.setJavaScriptEnabled(false) ;
    await globalPage.goto(cURL, {waitUntil: 'domcontentloaded'});
    let jsonQuote = await globalPage.evaluate(_parseQuoteYahoo_US);
    jsonQuote.ticker = cTicker ;
    //console.log(JSON.stringify(jsonQuote,null,3)) ;
    return jsonQuote ;
}

async function _parseQuoteYahoo_US(){
    let cssRemove=[] ;
    
    let tagQuoteHeaderInfo=document.querySelector('#quote-header-info') ;
    let tagFinStreamers = tagQuoteHeaderInfo.querySelectorAll('fin-streamer') ;

    if(tagFinStreamers.length>=3){
        let cChange= tagFinStreamers[2].innerText ;
        let cCleanChange = cChange.replace("(",'').replace(")",'') ;
        let jsonQuote={
            "ticker":'',
            "Quote":parseFloat(tagFinStreamers[0].innerText.replace(',','')),
            "change":tagFinStreamers[1].innerText,
            "changePer":parseFloat(cCleanChange)
        }
        return jsonQuote ;   
    }
    return {} ;
}

//https://finance.yahoo.com/quote/0010.HK
async function _fetchQuoteYahoo_HK(cTicker){

    let cURL = `https://finance.yahoo.com/quote/${cTicker}.hk` ;
    //await page.setJavaScriptEnabled(false) ;
    await globalPage.goto(cURL, {waitUntil: 'domcontentloaded'});
    let jsonQuote = await globalPage.evaluate(_parseQuoteYahoo_HK);
    jsonQuote.ticker = cTicker ;

    return jsonQuote ;
}

async function _parseQuoteYahoo_HK(){
    let cssRemove=[] ;
    
    let tagQuoteHeaderInfo=document.querySelector('#quote-header-info') ;
    let tagFinStreamers = tagQuoteHeaderInfo.querySelectorAll('fin-streamer') ;

    if(tagFinStreamers.length>=3){
        let cChange= tagFinStreamers[2].innerText ;
        let cCleanChange = cChange.replace("(",'').replace(")",'') ;
        let jsonQuote={
            "ticker":'',
            "Quote":parseFloat(tagFinStreamers[0].innerText.replace(',','')),
            "change":parseFloat(tagFinStreamers[1].innerText),
            "changePer":parseFloat(cCleanChange)
        }
        return jsonQuote ;   
    }
    
    return {} ;
}


//https://finance.yahoo.com/quote/HICL.L
async function _fetchQuoteYahoo_LSE(cTicker){

    let cURL = `https://finance.yahoo.com/quote/HICL.L?p=${cTicker}.L` ;
    //await page.setJavaScriptEnabled(false) ;
    await globalPage.goto(cURL, {waitUntil: 'domcontentloaded'});
    let jsonQuote = await globalPage.evaluate(_parseQuoteYahoo_LSE);
    jsonQuote.ticker = cTicker ;

    return jsonQuote ;
}

async function _parseQuoteYahoo_LSE(){
    let cssRemove=[] ;
    
    let tagQuoteHeaderInfo=document.querySelector('#quote-header-info') ;
    let tagFinStreamers = tagQuoteHeaderInfo.querySelectorAll('fin-streamer') ;

    if(tagFinStreamers.length>=3){
        let cChange= tagFinStreamers[2].innerText ;
        let cCleanChange = cChange.replace("(",'').replace(")",'') ;
        let jsonQuote={
            "ticker":'',
            "Quote":parseFloat(tagFinStreamers[0].innerText.replace(',','')),
            "change":parseFloat(tagFinStreamers[1].innerText),
            "changePer":parseFloat(cCleanChange)
        }
        return jsonQuote ;   
    }
    
    return {} ;
}

//https://finance.yahoo.com/quote/000002.SZ
async function _fetchQuoteYahoo_SZ(cTicker){

    let cURL = `https://finance.yahoo.com/quote/${cTicker}.SZ` ;
    //await page.setJavaScriptEnabled(false) ;
    await globalPage.goto(cURL, {waitUntil: 'domcontentloaded'});
    let jsonQuote = await globalPage.evaluate(_parseQuoteYahoo_SZ);
    jsonQuote.ticker = cTicker ;

    return jsonQuote ;
}

async function _parseQuoteYahoo_SZ(){
    let cssRemove=[] ;
    
    let tagQuoteHeaderInfo=document.querySelector('#quote-header-info') ;
    let tagFinStreamers = tagQuoteHeaderInfo.querySelectorAll('fin-streamer') ;

    if(tagFinStreamers.length>=3){
        let cChange= tagFinStreamers[2].innerText ;
        let cCleanChange = cChange.replace("(",'').replace(")",'') ;
        let jsonQuote={
            "ticker":'',
            "Quote":parseFloat(tagFinStreamers[0].innerText.replace(',','')),
            "change":parseFloat(tagFinStreamers[1].innerText),
            "changePer":parseFloat(cCleanChange)
        }
        return jsonQuote ;   
    }
    
    return {} ;
}


//https://finance.yahoo.com/quote/600900.SS
async function _fetchQuoteYahoo_SH(cTicker){

    let cURL = `https://finance.yahoo.com/quote/${cTicker}.SS` ;
    //await page.setJavaScriptEnabled(false) ;
    await globalPage.goto(cURL, {waitUntil: 'domcontentloaded'});
    let jsonQuote = await globalPage.evaluate(_parseQuoteYahoo_SH);
    jsonQuote.ticker = cTicker ;

    return jsonQuote ;
}

async function _parseQuoteYahoo_SH(){
    let cssRemove=[] ;
    
    let tagQuoteHeaderInfo=document.querySelector('#quote-header-info') ;
    let tagFinStreamers = tagQuoteHeaderInfo.querySelectorAll('fin-streamer') ;

    if(tagFinStreamers.length>=3){
        let cChange= tagFinStreamers[2].innerText ;
        let cCleanChange = cChange.replace("(",'').replace(")",'') ;
        let jsonQuote={
            "ticker":'',
            "Quote":parseFloat(tagFinStreamers[0].innerText.replace(',','')),
            "change":parseFloat(tagFinStreamers[1].innerText),
            "changePer":parseFloat(cCleanChange)
        }
        return jsonQuote ;   
    }
    
    return {} ;
}


//https://finance.yahoo.com/currencies/
async function _fetchCurrencyRateYahoo(){
    const cURL = `https://finance.yahoo.com/currencies/` ;
    let jsonCurrencyRate={
        "retCode":200
    } ;

    try {
        await globalPage.goto(cURL, {waitUntil: 'domcontentloaded'});
        // do what you have to do here
    } catch (e) {
        console.log('element probably not exists');
        jsonCurrencyRate.retCode = 404 ;
        return jsonQuote ;
    }
    
    jsonCurrencyRate = await globalPage.evaluate(_parseCurrencyRateYahoo);

    return jsonCurrencyRate ;
}

async function _parseCurrencyRateYahoo(){
    //yfin-list  => table 
}



//https://finance.yahoo.com/quote/ASX.AX
async function _fetchQuoteYahoo(cTicker){

    let cURL = `https://finance.yahoo.com/quote/${cTicker}` ;
    //console.log(`going to fetchQuote: ${cURL}`) ;
    //await page.setJavaScriptEnabled(false) ;
    let jsonQuote={
        "ticker":'',
        "Quote":'',
        "change":'',
        "changePer":'',
        "retCode":200
    } ;
    try {
        await globalPage.goto(cURL, {waitUntil: 'domcontentloaded'});
        // do what you have to do here
    } catch (e) {
        console.log('element probably not exists');
        jsonQuote.retCode = 404 ;
        jsonQuote.ticker = cTicker ;
        return jsonQuote ;
    }
    
    jsonQuote = await globalPage.evaluate(_parseQuoteYahoo);
    jsonQuote.ticker = cTicker ;

    return jsonQuote ;
}

async function _parseQuoteYahoo(){
    let cssRemove=[] ;
    
    let tagQuoteHeaderInfo=document.querySelector('#quote-header-info') ;
    let tagFinStreamers = tagQuoteHeaderInfo.querySelectorAll('fin-streamer') ;

    if(tagFinStreamers.length>=3){
        let cChange= tagFinStreamers[2].innerText ;
        let cCleanChange = cChange.replace("(",'').replace(")",'') ;
        let jsonQuote={
            "ticker":'',
            "Quote":parseFloat(tagFinStreamers[0].innerText.replace(',','')),
            "change":parseFloat(tagFinStreamers[1].innerText),
            "changePer":parseFloat(cCleanChange),
            "retCode":200
        }
        return jsonQuote ;   
    }
    
    return {} ;
}





async function updatePortfolio(){

    let cPortfolioFile = `./public/json/portfolio.json` ;
    let cPortfolio = fs.readFileSync(cPortfolioFile) ;
    let jsonPortfolio = JSON.parse(cPortfolio) ;
    console.log(JSON.stringify(jsonPortfolio,null,3)) ;

    
    await _initBrowser() ;

    for(let i=0;i<jsonPortfolio.accounts.length;i++){
        for(let j=0;j<jsonPortfolio.accounts[i].holdings.length;j++){
            if(jsonPortfolio.accounts[i].holdings[j].class!='share')continue ;

            let cTicker = jsonPortfolio.accounts[i].holdings[j].ticker ;
            let jsonQuote = await _fetchQuoteYahoo(cTicker) ;
            if(jsonQuote.retCode==200){
                console.log(JSON.stringify(jsonQuote,null,3)) ;
                updateHolding_Quote(jsonQuote.ticker,jsonQuote.Quote) ;
            }else{
                //logger() ;
                logger.log('error', 'fail fetchQuote', { message: cTicker });
            }

           
        }
    }
    
    await _exitBrowser() ;
    console.log(JSON.stringify(jsonPortfolio,null,3)) ;
    let cData = JSON.stringify(jsonPortfolio,null,3) ;
    //fs.writeFileSync(cPortfolioFile,cData) ;
}


async function updatePortfolioAccount(cAccount){
    _log(`updatePortfolioAccount`,cAccount) ;

    let cPortfolioFile = `./public/json/portfolio.json` ;
    let cPortfolio = fs.readFileSync(cPortfolioFile) ;
    let jsonPortfolio = JSON.parse(cPortfolio) ;
    //console.log(JSON.stringify(jsonPortfolio,null,3)) ;

    await _initBrowser() ;

    for(let i=0;i<jsonPortfolio.accounts.length;i++){
        if(jsonPortfolio.accounts[i].general.account==cAccount){
            for(let j=0;j<jsonPortfolio.accounts[i].holdings.length;j++){
                if(jsonPortfolio.accounts[i].holdings[j].class!='share')continue ;
    
                let cTicker = jsonPortfolio.accounts[i].holdings[j].ticker ;
                let jsonQuote = await _fetchQuoteYahoo(cTicker) ;
                if(jsonQuote.retCode==200){
                    console.log(JSON.stringify(jsonQuote,null,3)) ;
                    updateHolding_Quote(jsonQuote.ticker,jsonQuote.Quote) ;
                }else{
                    //logger() ;
                    logger.log('error', 'fail fetchQuote', { message: cTicker });
                }
            }
            break ;
        }
    }
    
    await _exitBrowser() ;
    //console.log(JSON.stringify(jsonPortfolio,null,3)) ;
    //let cData = JSON.stringify(jsonPortfolio,null,3) ;
    //fs.writeFileSync(cPortfolioFile,cData) ;
}




function loadAccountSQLite(accountNO){
    let cStmt = `
        INSERT INTO accounts (
            accountNO,owner, bookvalue_CNY,bookvalue_USD,bookvalue_HKD,bookvalue_AUD,bookvalue_GBP,cash_CNY,cash_USD,cash_HKD,cash_AUD,cash_GBP,debt_CNY,debt_USD,debt_HKD,debt_AUD,debt_GBP,totalPL,totalPL_Per) 
            VALUES (@accountNO, @owner,
                                @bookvalue_CNY,
                                @bookvalue_USD,
                                @bookvalue_HKD,
                                @bookvalue_AUD,
                                @bookvalue_GBP,
                                @cash_CNY,
                                @cash_USD,
                                @cash_HKD,
                                @cash_AUD,
                                @cash_GBP,
                                @debt_CNY,
                                @debt_USD,
                                @debt_HKD,
                                @debt_AUD,
                                @debt_GBP,
                                @totalPL,
                                @totalPL_Per)
    ` ;
    const stmt = portfolioDB.prepare(cStmt);
    let jsonAccount={
            "accountNO":accountNO,
            "owner": "alexszhang@gmail.com",
            "bookvalue_CNY": 0,
            "bookvalue_USD": 0,
            "bookvalue_HKD": 0,
            "bookvalue_AUD": 0,
            "bookvalue_GBP": 0,
            "cash_CNY": 0,
            "cash_USD": 0,
            "cash_HKD": 0,
            "cash_AUD": 0,
            "cash_GBP": 0,
            "debt_CNY": 0,
            "debt_USD": 0,
            "debt_HKD": 0,
            "debt_AUD": 0,
            "debt_GBP": 0,
            "totalPL": 0,
            "totalPL_Per":0
    } ;
    stmt.run(jsonAccount);
}


function addHolding(account,jsonHolding){
    let cStmt = `
    INSERT INTO holdings (accountNO,ticker,company,shares,cost,currency,exchange,price,pl_total,pl_total_percent,value,class) VALUES ( 
                            @accountNO,@ticker,@company,@shares,@cost,@currency,@exchange,@price,@pl_total,@pl_total_percent,@value,@class)
    ` ;
    const stmt = portfolioDB.prepare(cStmt);
    let jsonHoldingDB={
            "accountNO": account,
            "ticker": jsonHolding.ticker,
            "company": jsonHolding.company,
            "shares": jsonHolding.shares,
            "cost": jsonHolding.cost,
            "currency": jsonHolding.currency,
            "exchange": jsonHolding.exchange,
            "price": jsonHolding.price,
            "pl_total": jsonHolding.pl_total,
            "pl_total_percent": jsonHolding.pl_total_percent,
            "value": jsonHolding.value,
            "class": jsonHolding.class
    } ;
    stmt.run(jsonHoldingDB);
}

function batchLoadHolding(cAccount){
    let cPortfolioFile='./public/json/portfolio.json' ;
    let cPortfolioData = fs.readFileSync(cPortfolioFile) ;
    let jsonPortfolio = JSON.parse(cPortfolioData) ;

    for(let i=0;i<jsonPortfolio.accounts.length;i++){
        if(jsonPortfolio.accounts[i].general.account == cAccount){
            for(let j=0;j<jsonPortfolio.accounts[i].holdings.length;j++){
                addHolding(jsonPortfolio.accounts[i].general.account,jsonPortfolio.accounts[i].holdings[j]) ;
            }
            break ;
        }
    }
}


function updateHolding_Quote(ticker,paraQuote){
    //update holdings set price=50.00, value=50.00*shares,pl_total=(50-cost)*shares,pl_total_percent=(50/cost-1)*100 where ticker = 'BN'
    let cStmt = `
    update holdings set price=50.00, value=50.00*shares,pl_total=(50-cost)*shares,pl_total_percent=(50/cost-1)*100 where ticker = 'BN'
    ` ;

    const stmt = portfolioDB.prepare('SELECT shares,cost FROM holdings WHERE ticker = ?');
    const holding = stmt.get(ticker);

    //console.log(holding); // => 2

    let para={
        price:paraQuote,
        value:paraQuote*holding.shares,
        pl_total:((paraQuote-holding.cost)*holding.shares).toFixed(2),
        pl_total_percent:((paraQuote/holding.cost-1)*100).toFixed(2),
        ticker:ticker
    };
    //console.log(JSON.stringify(para,null,3)) ;
    
    const stmt2 = portfolioDB.prepare(`UPDATE holdings SET price = ?, value= ?, pl_total=?, pl_total_percent=? WHERE ticker = ?`); 
    const updates = stmt2.run(para.price, para.value,para.pl_total,para.pl_total_percent,para.ticker);
    

}



async function updateSingleHolding(ticker){

    await _initBrowser() ;

    let jsonQuote = await _fetchQuoteYahoo(ticker);
    //console.log(JSON.stringify(jsonQuote,null,3)) ;
    if(jsonQuote.retCode==200){
        console.log(JSON.stringify(jsonQuote,null,3)) ;
        updateHolding_Quote(ticker,jsonQuote.Quote) ;
    }else{
        //logger() ;
        logger.log('error', 'fail fetchQuote', { message: cTicker });
    }
    await _exitBrowser() ;
}

//update accounts set bookvalue_HKD =  (select SUM(price*shares) from holdings where accountNO="平安证券" AND currency="HKD") where accountNO="平安证券"
async function updateAccounts(cAccount,cAsset){
    let cStmt = `
    update accounts set bookvalue_${cAsset} =  (select SUM(price*shares) from holdings where accountNO=? AND currency=?) where accountNO=?
    ` ;
    //console.log(cStmt) ;
    const stmt = portfolioDB.prepare(cStmt);
    
    stmt.run(cAccount,cAsset,cAccount);
}


//logger.info('hello', { message: 'world' });
//logger.log('error', 'hello', { message: 'world' });

//updateSingleHolding('ASX.AX') ;
//updateSingleHolding('BAM') ;
//updateSingleHolding('0010.HK') ;
//updateSingleHolding('CTY.L') ;
//updateSingleHolding('000002.SZ') ;
//updateSingleHolding('600900.SS') ;
//updateSingleHolding('K71U.SI') ;
//updateSingleHolding('0700.HK') ;


//updatePortfolio() ;

//batchLoadHolding("招商证券") ;


async function updatePortfolioAccounts(){
    await updatePortfolioAccount('海通证券') ;
    await updatePortfolioAccount('招商证券') ;
    await updatePortfolioAccount('平安证券') ;
    await updatePortfolioAccount('国金证券') ;
    await updatePortfolioAccount('IBKR-1279') ;
    await updatePortfolioAccount('IBKR-3979') ;
    await updatePortfolioAccount('IBKR-6325') ;
    await updatePortfolioAccount('IBKR-7075') ;
}

async function updateAccounts(){

    updateAccounts('平安证券',"CNY") ;
    updateAccounts('平安证券',"HKD") ;
    updateAccounts('平安证券',"USD") ;

    updateAccounts('国金证券',"CNY") ;
    updateAccounts('国金证券',"HKD") ;
    updateAccounts('国金证券',"USD") ;

    updateAccounts('招商证券',"CNY") ;
    updateAccounts('招商证券',"HKD") ;
    updateAccounts('招商证券',"USD") ;

    updateAccounts('海通证券',"CNY") ;
    updateAccounts('海通证券',"HKD") ;
    updateAccounts('海通证券',"USD") ;

    updateAccounts('IBKR-7075',"GBP") ;
    updateAccounts('IBKR-7075',"HKD") ;
    updateAccounts('IBKR-7075',"USD") ;
    updateAccounts('IBKR-7075',"AUD") ;

    updateAccounts('IBKR-1279',"GBP") ;
    updateAccounts('IBKR-1279',"HKD") ;
    updateAccounts('IBKR-1279',"USD") ;
    updateAccounts('IBKR-1279',"AUD") ;

    updateAccounts('IBKR-3979',"GBP") ;
    updateAccounts('IBKR-3979',"HKD") ;
    updateAccounts('IBKR-3979',"USD") ;
    updateAccounts('IBKR-3979',"AUD") ;

    updateAccounts('IBKR-6325',"GBP") ;
    updateAccounts('IBKR-6325',"HKD") ;
    updateAccounts('IBKR-6325',"USD") ;
    updateAccounts('IBKR-6325',"AUD") ;
}

/*
const redis = require('redis') ;

async function tryRedis(){

    const client = await redis.createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .connect();
  
  await client.set('key', 'value');
  const value = await client.get('key');
  console.log(value) ;
  await client.disconnect();
}

tryRedis() ;
*/

//updatePortfolioAccounts() ;
//loadAccountSQLite("平安证券");

//updatePortfolioAccounts() ;

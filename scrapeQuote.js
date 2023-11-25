const puppeteer = require('puppeteer'); // v 1.1.0
const { URL } = require('url');
const fse = require('fs-extra'); // v 5.0.0
const path = require('path');
var fs = require('fs');
const fetch = require('node-fetch') ;
const Decimal = require('decimal.js');

const portfolioDB = require('better-sqlite3')('./public/SQLiteDB/PortfolioDB.db', { verbose: console.log });


let globalBrowwer = null ;
let globalPage = null ;


function cleanFloat(cFloat){
    return cFloat.replace(',','') ;
}

function _logJSON(jsonData){
    console.log(JSON.stringify(jsonData,null,3)) ;
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


//https://finance.yahoo.com/quote/ASX.AX
async function _fetchQuoteYahoo(cTicker){

    let cURL = `https://finance.yahoo.com/quote/${cTicker}` ;
    console.log(`going to fetchQuote: ${cURL}`) ;
    //await page.setJavaScriptEnabled(false) ;
    await globalPage.goto(cURL, {waitUntil: 'domcontentloaded'});
    let jsonQuote = await globalPage.evaluate(_parseQuoteYahoo);
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
            "changePer":parseFloat(cCleanChange)
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
            
            console.log(JSON.stringify(jsonQuote,null,3)) ;
            updateHolding_Quote(jsonQuote.ticker,jsonQuote.Quote) ;
        }
    }
    
    await _exitBrowser() ;
    console.log(JSON.stringify(jsonPortfolio,null,3)) ;
    let cData = JSON.stringify(jsonPortfolio,null,3) ;
    //fs.writeFileSync(cPortfolioFile,cData) ;
}


async function updatePortfolioAccount(cAccount){

    let cPortfolioFile = `./public/json/portfolio.json` ;
    let cPortfolio = fs.readFileSync(cPortfolioFile) ;
    let jsonPortfolio = JSON.parse(cPortfolio) ;
    console.log(JSON.stringify(jsonPortfolio,null,3)) ;

    await _initBrowser() ;

    for(let i=0;i<jsonPortfolio.accounts.length;i++){
        if(jsonPortfolio.accounts[i].general.account==cAccount){
            for(let j=0;j<jsonPortfolio.accounts[i].holdings.length;j++){
                if(jsonPortfolio.accounts[i].holdings[j].class!='share')continue ;
    
                let cTicker = jsonPortfolio.accounts[i].holdings[j].ticker ;
                let jsonQuote = await _fetchQuoteYahoo(cTicker) ;
                
                console.log(JSON.stringify(jsonQuote,null,3)) ;
                updateHolding_Quote(jsonQuote.ticker,jsonQuote.Quote) ;
            }
            break ;
        }
    }
    
    await _exitBrowser() ;
    console.log(JSON.stringify(jsonPortfolio,null,3)) ;
    let cData = JSON.stringify(jsonPortfolio,null,3) ;
    //fs.writeFileSync(cPortfolioFile,cData) ;
}


/*
async function tryQuote(){
    await _initBrowser() ;

    
    let cTicker = 'BN' ;
    let jsonQuote = await _fetchQuoteYahoo_US(cTicker) ;
    console.log(JSON.stringify(jsonQuote,null,3)) ;
    

    cTicker = '0010' ;
    jsonQuote = await _fetchQuoteYahoo_HK(cTicker) ;
    console.log(JSON.stringify(jsonQuote,null,3)) ;


    
    cTicker = 'HICL' ;
    jsonQuote = await _fetchQuoteYahoo_LSE(cTicker) ;
    console.log(JSON.stringify(jsonQuote,null,3)) ;


    cTicker = 'PGX' ;
    jsonQuote = await _fetchQuoteYahoo_US(cTicker) ;
    console.log(JSON.stringify(jsonQuote,null,3)) ;

    cTicker = '000002' ;
    jsonQuote = await _fetchQuoteYahoo_SZ(cTicker) ;
    console.log(JSON.stringify(jsonQuote,null,3)) ;
    
    
    cTicker = '600900' ;
    jsonQuote = await _fetchQuoteYahoo_SH(cTicker) ;
    console.log(JSON.stringify(jsonQuote,null,3)) ;

    await _exitBrowser() ;

}
*/
//tryQuote() ;


function loadAccountSQLite(){
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
            "accountNO": "IBKR-6325",
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

    console.log(holding); // => 2

    let para={
        price:paraQuote,
        value:paraQuote*holding.shares,
        pl_total:((paraQuote-holding.cost)*holding.shares).toFixed(2),
        pl_total_percent:((paraQuote/holding.cost-1)*100).toFixed(2),
        ticker:ticker
    };
    console.log(JSON.stringify(para,null,3)) ;
    
    const stmt2 = portfolioDB.prepare(`UPDATE holdings SET price = ?, value= ?, pl_total=?, pl_total_percent=? WHERE ticker = ?`); 
    const updates = stmt2.run(para.price, para.value,para.pl_total,para.pl_total_percent,para.ticker);
    

}



async function updateSingleHolding(ticker){

    await _initBrowser() ;

    let jsonQuote = await _fetchQuoteYahoo(ticker);
    console.log(JSON.stringify(jsonQuote,null,3)) ;
    updateHolding_Quote(ticker,jsonQuote.Quote) ;

    await _exitBrowser() ;
}




//updateSingleHolding('ASX.AX') ;
//updateSingleHolding('BAM') ;
//updateSingleHolding('0010.HK') ;
//updateSingleHolding('HICL.L') ;
//updateSingleHolding('000002.SZ') ;
//updateSingleHolding('600900.SS') ;
//updateSingleHolding('K71U.SI') ;


//updatePortfolio() ;

//batchLoadHolding('IBKR-6325') ;

updatePortfolioAccount('IBKR-3979') ;
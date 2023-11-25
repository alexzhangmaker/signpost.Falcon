const puppeteer = require('puppeteer'); // v 1.1.0
const { URL } = require('url');
const fse = require('fs-extra'); // v 5.0.0
const path = require('path');
var fs = require('fs');

const fetch = require('node-fetch') ;
const portfolioDB = require('better-sqlite3')('./public/SQLiteDB/PortfolioDB.db', { verbose: console.log });

let globalBrowwer = null ;
let globalPage = null ;



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


//https://xueqiu.com/snowman/S/00010/detail#/FHPS
async function _fetchDividendCNXQ(cTicker){

    let cURL = `https://xueqiu.com/snowman/S/${cTicker}/detail#/FHPS` ;
    //await globalPage.setJavaScriptEnabled(false) ;
    await globalPage.goto(cURL, {waitUntil: 'networkidle0'});
    let jsonDividends = await globalPage.evaluate(_parseDividendCNXQ);
    return jsonDividends ;
}

async function _parseDividendCNXQ(){
    let jsonDividends=[] ;
    let tagTblContainer = document.querySelector('.stock-info-content') ;
    let tagTBody = tagTblContainer.querySelector('tbody') ;
    console.log(tagTBody) ;
    let tagRows = tagTBody.querySelectorAll('tr') ;
    for(let i=0;i<tagRows.length;i++){
        let jsonDividend={
            "fiscal":'',
            "scheme":'',
            "registration":'',
            "divide":'',
            "payout":''
        } ;
        console.log(tagRows[i]) ;
        let tagTDs = tagRows[i].querySelectorAll('td') ;
        for(let j=0;j<tagTDs.length;j++){
            console.log(tagTDs[j].innerHTML) ;
            switch(j){
                case 0:jsonDividend.fiscal=tagTDs[j].innerText;break ;
                case 1:jsonDividend.scheme=tagTDs[j].innerText;break ;
                case 2:jsonDividend.registration=tagTDs[j].innerText;break ;
                case 3:jsonDividend.divide=tagTDs[j].innerText;break ;
                case 4:jsonDividend.payout=tagTDs[j].innerText;break ;
            }
        }
        jsonDividends.push(jsonDividend) ;
    }
    return jsonDividends ;
}


//https://xueqiu.com/snowman/S/00010/detail#/FHPS
async function _fetchDividendHKXQ(cTicker){
    let cURL = `https://xueqiu.com/snowman/S/${cTicker}/detail#/FHPS` ;
    //await page.setJavaScriptEnabled(false) ;
    await globalPage.goto(cURL, {waitUntil: 'networkidle0'});
    let jsonDividends = await globalPage.evaluate(_parseDividendHKXQ);
    return jsonDividends ;
}

async function _parseDividendHKXQ(){
    let jsonDividends=[] ;
    let tagTblContainer = document.querySelector('.stock-info-content') ;
    let tagTBody = tagTblContainer.querySelector('tbody') ;
    let tagRows = tagTBody.querySelectorAll('tr') ;
    for(let i=0;i<tagRows.length;i++){
        let jsonDividend={
            "scheme":'',
            "divide":'',
            "payout":''
        } ;
        let tagTDs = tagRows[i].querySelectorAll('td') ;
        for(let j=0;j<tagTDs.length;j++){
            switch(j){
                case 0:jsonDividend.scheme=tagTDs[j].textContent;break ;
                case 1:jsonDividend.divide=tagTDs[j].textContent;break ;
                case 2:jsonDividend.payout=tagTDs[j].textContent;break ;
            }
        }
        jsonDividends.push(jsonDividend) ;
    }
    return jsonDividends ;
}


//https://xueqiu.com/snowman/S/00010/detail#/FHPS
async function _fetchDividendUS(cTicker){

    let cURL = `https://dividendhistory.org/payout/${cTicker}/` ;
    //await page.setJavaScriptEnabled(false) ;
    await globalPage.goto(cURL, {waitUntil: 'domcontentloaded'});
    let jsonDividends = await globalPage.evaluate(_parseDividendUS);

    return jsonDividends ;
}

async function _parseDividendUS(){
    let cssRemove=[
    ] ;
    for(let i=0;i<cssRemove.length;i++){
        let tagRemoves = document.querySelectorAll(cssRemove[i]) ;
        for(let j=0;j<tagRemoves.length;j++){
            tagRemoves[j].remove() ;
        }
    }

    let jsonDividends=[] ;
    

    let tagTBLDividend=document.querySelector('#dividend_table') ;
    //let tagTHs = tagTBLDividend.querySelectorAll('th') ;
    let tagTBody = tagTBLDividend.querySelector('tbody') ;
    let tagRows = tagTBody.querySelectorAll('tr') ;
    tagRows.forEach(tagRow=>{
        let tagTDs = tagRow.querySelectorAll('td') ;
        let jsonDividend={
            "ExDividendDate":'',
            "PayoutDate":'',
            "CashAmount":'',
            "Change":''
          } ;
        for(let i=0;i<tagTDs.length;i++){
            switch(i){
                case 0: jsonDividend.ExDividendDate = tagTDs[i].innerText ;break ;
                case 1: jsonDividend.PayoutDate = tagTDs[i].innerText ;break ;
                case 2: jsonDividend.CashAmount = tagTDs[i].innerText ;break ;
                case 3: jsonDividend.Change = tagTDs[i].innerText ;break ;
            }
        }
        jsonDividends.push(jsonDividend) ;
    }) ;
    console.log(JSON.stringify(jsonDividends,null,3)) ;
    return jsonDividends ;   
}


//https://stock.finance.sina.com.cn/hkstock/dividends/00010.html
async function _fetchDividendHKSINA(cTicker){
    let cURL = `https://stock.finance.sina.com.cn/hkstock/dividends/${cTicker}.html` ;
    //await page.setJavaScriptEnabled(false) ;
    await globalPage.goto(cURL, {waitUntil: 'domcontentloaded'});
    let jsonDividends = await globalPage.evaluate(_parseDividendHKSINA);
    return jsonDividends ;
}

async function _parseDividendHKSINA(){
    let jsonDividends=[] ;
    let tagTbl = document.querySelector('.tab05') ;
    let tagTBody = tagTbl.querySelector('tbody') ;
    let tagRows = tagTBody.querySelectorAll('tr') ;
    for(let i=1;i<tagRows.length;i++){
        let jsonDividend={
            "publish":'',
            "fiscal":'',
            "memo":'',
            "scheme":'',
            "way":'',
            "divide":'',
            "registration":'',
            "payout":''
        } ;
        let tagTDs = tagRows[i].querySelectorAll('td') ;
        for(let j=0;j<tagTDs.length;j++){
            switch(j){
                case 0:jsonDividend.publish=tagTDs[j].textContent;break ;
                case 1:jsonDividend.fiscal=tagTDs[j].textContent;break ;
                case 2:jsonDividend.memo=tagTDs[j].textContent;break ;
                case 3:jsonDividend.scheme=tagTDs[j].textContent;break ;
                case 4:jsonDividend.way=tagTDs[j].textContent;break ;
                case 5:jsonDividend.divide=tagTDs[j].textContent;break ;
                case 6:jsonDividend.registration=tagTDs[j].textContent;break ;
                case 7:jsonDividend.payout=tagTDs[j].textContent;break ;
            }
        }
        jsonDividends.push(jsonDividend) ;
    }
    return jsonDividends ;
}



//https://stock.finance.sina.com.cn/hkstock/dividends/00010.html
async function _fetchDividendCNSINA(cTicker){
    let ticker = cTicker.substring(2);
    let cURL = `https://vip.stock.finance.sina.com.cn/corp/go.php/vISSUE_ShareBonus/stockid/${ticker}.phtml` ;
    //let cURL = `https://stock.finance.sina.com.cn/hkstock/dividends/${cTicker}.html` ;
    //await page.setJavaScriptEnabled(false) ;
    await globalPage.goto(cURL, {waitUntil: 'domcontentloaded'});
    let jsonDividends = await globalPage.evaluate(_parseDividendCNSINA);
    return jsonDividends ;
}

async function _parseDividendCNSINA(){
    let jsonDividends=[] ;
    let tagTbl = document.querySelector('#sharebonus_1') ;
    let tagTBody = tagTbl.querySelector('tbody') ;
    let tagRows = tagTBody.querySelectorAll('tr') ;
    for(let i=1;i<tagRows.length;i++){
        let jsonDividend={
            "publish":'',
            "payshare":'',
            "newshare":'',
            "scheme":'',
            "status":'',
            "divide":'',
            "registration":'',
            "payout":'',
            "detail":''
        } ;
        let tagTDs = tagRows[i].querySelectorAll('td') ;
        for(let j=0;j<tagTDs.length;j++){
            switch(j){
                case 0:jsonDividend.publish=tagTDs[j].textContent;break ;
                case 1:jsonDividend.payshare=tagTDs[j].textContent;break ;
                case 2:jsonDividend.newshare=tagTDs[j].textContent;break ;
                case 3:jsonDividend.scheme=tagTDs[j].textContent;break ;
                case 4:jsonDividend.status=tagTDs[j].textContent;break ;
                case 5:jsonDividend.divide=tagTDs[j].textContent;break ;
                case 6:jsonDividend.registration=tagTDs[j].textContent;break ;
                case 7:jsonDividend.payout=tagTDs[j].textContent;break ;
                case 8:jsonDividend.detail=tagTDs[j].textContent;break ;
            }
        }
        jsonDividends.push(jsonDividend) ;
    }
    return jsonDividends ;
}


//https://www.fool.co.uk/tickers/lse-hicl/#dividends
async function _fetchDividendUKFool(cTicker){
    let cURL = `https://www.fool.co.uk/tickers/lse-${cTicker}/#dividends` ;
    //await page.setJavaScriptEnabled(false) ;
    await globalPage.goto(cURL, {waitUntil: 'domcontentloaded'});
    let jsonDividends = await globalPage.evaluate(_parseDividendUKFool);
    return jsonDividends ;
}

async function _parseDividendUKFool(){
    let jsonDividends=[] ;

    return jsonDividends ;

}



async function updateDividend(){

    let cPortfolioFile = `./public/json/portfolio.json` ;
    let cPortfolio = fs.readFileSync(cPortfolioFile) ;
    let jsonPortfolio = JSON.parse(cPortfolio) ;
    console.log(JSON.stringify(jsonPortfolio,null,3)) ;

    
    await _initBrowser() ;

    let jsonDevidend = {} ;
    let cJSONFile = '' ;
    for(let i=0;i<jsonPortfolio.accounts.length;i++){
        for(let j=0;j<jsonPortfolio.accounts[i].holdings.length;j++){
            let cTicker = jsonPortfolio.accounts[i].holdings[j].ticker;
            switch(jsonPortfolio.accounts[i].holdings[j].exchange){
                case 'US':
                    /*
                    jsonDevidend = await _fetchDividendUS(cTicker) ;
                    console.log(JSON.stringify(jsonDevidend,null,3)) ;
                    cJSONFile = `./public/json/${cTicker}-Div.json` ;
                    fs.writeFileSync(cJSONFile, JSON.stringify(jsonDevidend,null,3));
                    */
                    break ;
                case "CN":
                    /*
                    jsonDevidend = await _fetchDividendCNSINA(cTicker) ;
                    console.log(JSON.stringify(jsonDevidend,null,3)) ;
                    cJSONFile = `./public/json/${cTicker}-DivSINA.json` ;
                    fs.writeFileSync(cJSONFile, JSON.stringify(jsonDevidend,null,3));
                    */
                    break ;
                case "HK":
                    /*
                    jsonDevidend = await _fetchDividendHKSINA(cTicker) ;
                    console.log(JSON.stringify(jsonDevidend,null,3)) ;
                    cJSONFile = `./public/json/${cTicker}-Div.json` ;
                    fs.writeFileSync(cJSONFile, JSON.stringify(jsonDevidend,null,3));
                    */
                    break ;
                case "LSEG":
                    break;
                default:
                    console.log('tbd') ;
                    break ;
            }

        }
    }
    
    await _exitBrowser() ;
}



//updateDividend() ;





//yahoo SG 
//https://finance.yahoo.com/quote/K71U.SI/history?period1=1542931200&period2=1700697600&interval=capitalGain%7Cdiv%7Csplit&filter=div&frequency=1mo&includeAdjustedClose=true
//https://finance.yahoo.com/quote/0010.HK/history?period1=1542931200&period2=1700697600&interval=capitalGain%7Cdiv%7Csplit&filter=div&frequency=1mo&includeAdjustedClose=true
//https://finance.yahoo.com/quote/000002.SZ/history?period1=1542931200&period2=1700697600&interval=capitalGain%7Cdiv%7Csplit&filter=div&frequency=1mo&includeAdjustedClose=true
//https://finance.yahoo.com/quote/600900.SS/history?period1=1542931200&period2=1700697600&interval=capitalGain%7Cdiv%7Csplit&filter=div&frequency=1mo&includeAdjustedClose=true
//https://finance.yahoo.com/quote/HICL.L/history?period1=1542931200&period2=1700697600&interval=capitalGain%7Cdiv%7Csplit&filter=div&frequency=1mo&includeAdjustedClose=true
//https://finance.yahoo.com/quote/O/history?period1=1542931200&period2=1700697600&interval=capitalGain%7Cdiv%7Csplit&filter=div&frequency=1mo&includeAdjustedClose=true
//https://finance.yahoo.com/quote/ASX.AX/history?period1=1542931200&period2=1700697600&interval=capitalGain%7Cdiv%7Csplit&filter=div&frequency=1mo&includeAdjustedClose=true
//https://finance.yahoo.com/quote/BIPC/history?period1=1542931200&period2=1700697600&interval=capitalGain%7Cdiv%7Csplit&filter=div&frequency=1mo&includeAdjustedClose=true


async function fetchDIVYahoo(ticker){
    await _initBrowser() ;

    let jsonDIV = await _fetchDividendYahoo(ticker) ;
    await _exitBrowser() ;

}


//https://finance.yahoo.com/quote/ASX.AX
async function _fetchDividendYahoo(cTicker){

    let cURL = `https://finance.yahoo.com/quote/${cTicker}/history?period1=1542931200&period2=1700697600&interval=capitalGain%7Cdiv%7Csplit&filter=div&frequency=1mo&includeAdjustedClose=true` ;

    console.log(`going to fetchQuote: ${cURL}`) ;
    //await page.setJavaScriptEnabled(false) ;
    await globalPage.goto(cURL, {waitUntil: 'domcontentloaded'});
    let jsonDividend = await globalPage.evaluate(_parseDividendYahoo);
    jsonDividend.ticker = cTicker ;
    for(let i=0;i<jsonDividend.dividends.length;i++){
        jsonDividend.dividends[i].ticker = cTicker ;
    }
    console.log(JSON.stringify(jsonDividend,null,3)) ;
    return jsonDividend ;
}

async function _parseDividendYahoo(){

    //data-test="historical-prices
    let tagDivTable=document.querySelector("[data-test='historical-prices']") ;
    let jsonDividend={
        "result":"200",
        "ticker":"",
        "dividends":[]        
    } ;
    if(tagDivTable!=null){
        let tagTBody = tagDivTable.querySelector("tbody") ;
        let tagTRows = tagTBody.querySelectorAll('tr') ;
        tagTRows.forEach((tagTR)=>{
           
            let tagTDs = tagTR.querySelectorAll('td') ;
            let cDate = tagTDs[0].innerText ;
            let subStrings = cDate.split(', ') ;
            let subStrings2 = subStrings[0].split(" ") ;

            let jsonDIV={
                "ticker": "TBD",
                "date_year": subStrings[1],
                "date_month": subStrings2[0],
                "date_date": subStrings2[1],
                "amount": tagTDs[1].querySelector('strong').innerText,
                "currency": "TBD",
                "memo": tagTDs[1].querySelector('span').innerText
            } ;
            
            jsonDividend.dividends.push(jsonDIV) ;
        }) ;
    }else{
        jsonDividend.result='404' ;
    }
    return jsonDividend ;
}


//fetchDIVYahoo('BIPC') ;
//fetchDIVYahoo('0010.HK') ;
//fetchDIVYahoo('000002.SZ') ;
//fetchDIVYahoo('600900.SS') ;
//fetchDIVYahoo('HICL.L') ;
//fetchDIVYahoo('ASX.AX') ;
//fetchDIVYahoo('O') ;

//"Dec 31, 2018"
function string2Date(cDate){
    let subStrings = cDate.split(', ') ;
    let subStrings2 = subStrings[0].split(" ") ;
    //console.log(subStrings2[0]) ;
    //console.log(subStrings2[1]) ;

    //console.log(subStrings[1]) ;
    let jsonDate={
        "month":subStrings2[0],
        "date":subStrings2[1],
        "year":subStrings[1]
    } ;
    console.log(JSON.stringify(jsonDate,null,3));
    return jsonDate ;

}

//let cDate = "Dec 31, 2018" ;
//string2Date(cDate) ;
function addDIVLog(jsonDivLog){
    let cStmt = `
    INSERT INTO dividends (ticker,date_year,date_month,date_date,amount,currency,memo) VALUES ( 
                            @ticker,@date_year,@date_month,@date_date,@amount,@currency,@memo)
    ` ;
    const stmt = portfolioDB.prepare(cStmt);
    
    stmt.run(jsonDivLog);
}

async function loadHistoryDividend(){

    let cPortfolioFile = `./public/json/portfolio.json` ;
    let cPortfolio = fs.readFileSync(cPortfolioFile) ;
    let jsonPortfolio = JSON.parse(cPortfolio) ;
    console.log(JSON.stringify(jsonPortfolio,null,3)) ;

    
    await _initBrowser() ;

    let tickers=[] ;
    let jsonDevidend = {} ;
    let cJSONFile = '' ;
    for(let i=0;i<jsonPortfolio.accounts.length;i++){
        for(let j=0;j<jsonPortfolio.accounts[i].holdings.length;j++){
            let cTicker = jsonPortfolio.accounts[i].holdings[j].ticker;
            if(tickers.includes(cTicker)!=true){
                tickers.push(cTicker) ;
            }
        }
    }
    console.log(tickers) ;
    for(i=0;i<tickers.length;i++){
        let jsonDividend = await _fetchDividendYahoo(tickers[i]) ;
        console.log(JSON.stringify(jsonDividend,null,3)) ;
        for(let j=0;j<jsonDividend.dividends.length;j++){
            addDIVLog(jsonDividend.dividends[j]) ;
        }
    }
    
    await _exitBrowser() ;
}


loadHistoryDividend() ;

//https://finance.yahoo.com/quote/513010.SS
//https://finance.yahoo.com/quote/513050.SS
//https://finance.yahoo.com/quote/515080.SS
//https://finance.yahoo.com/quote/503010.SZ


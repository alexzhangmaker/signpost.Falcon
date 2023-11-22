const puppeteer = require('puppeteer'); // v 1.1.0
const { URL } = require('url');
const fse = require('fs-extra'); // v 5.0.0
const path = require('path');
var fs = require('fs');

const fetch = require('node-fetch') ;

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
            "Quote":parseFloat(tagFinStreamers[0].innerText),
            "change":parseFloat(tagFinStreamers[1].innerText),
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
            "Quote":parseFloat(tagFinStreamers[0].innerText),
            "change":parseFloat(tagFinStreamers[1].innerText),
            "changePer":parseFloat(cCleanChange)
        }
        return jsonQuote ;   
    }
    
    return {} ;
}


//https://finance.yahoo.com/quote/HICL.L?p=HICL.L
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
            "Quote":parseFloat(tagFinStreamers[0].innerText),
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
            "Quote":parseFloat(tagFinStreamers[0].innerText),
            "change":parseFloat(tagFinStreamers[1].innerText),
            "changePer":parseFloat(cCleanChange)
        }
        return jsonQuote ;   
    }
    
    return {} ;
}


//https://finance.yahoo.com/quote/600900.SS
//?p=600900.SS
//&.tsrc=fin-srch
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
            "Quote":parseFloat(tagFinStreamers[0].innerText),
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
            let jsonQuote = {} ;
            switch(jsonPortfolio.accounts[i].holdings[j].exchange){
                case "US":jsonQuote = await _fetchQuoteYahoo_US(cTicker) ;break ;
                case "HK":jsonQuote = await _fetchQuoteYahoo_HK(cTicker) ;break ;
                case "LSE":jsonQuote = await _fetchQuoteYahoo_LSE(cTicker) ;break ;
                case "SZ":jsonQuote = await _fetchQuoteYahoo_SZ(cTicker) ;break ;
                case "SH":jsonQuote = await _fetchQuoteYahoo_SH(cTicker) ;break ;
            }
            console.log(JSON.stringify(jsonQuote,null,3)) ;
            jsonPortfolio.accounts[i].holdings[j].price = jsonQuote.Quote ;
            jsonPortfolio.accounts[i].holdings[j].value = jsonQuote.Quote*jsonPortfolio.accounts[i].holdings[j].shares ;
        }
    }
    
    await _exitBrowser() ;
    console.log(JSON.stringify(jsonPortfolio,null,3)) ;
    let cData = JSON.stringify(jsonPortfolio,null,3) ;
    fs.writeFileSync(cPortfolioFile,cData) ;
}



//doWork() ;

//tryPuppeteerJSON() ;

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

//tryQuote() ;

updatePortfolio() ;
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

//nto working to xueqiu site
//refer: https://stock.xueqiu.com/v5/stock/f10/hk/bonus.json?symbol=00010&size=10&page=1&extend=true
async function _fetchXQJSONAPI(cTicker){
    let jsonDividends = {} ;
    //let cURL = `https://stock.xueqiu.com/v5/stock/f10/cn/bonus.json?symbol=${cTicker}&size=10&page=1&extend=true` ;
    let cURL='https://stock.xueqiu.com/v5/stock/f10/hk/bonus.json?symbol=00010&size=10&page=1&extend=true' ;
    //let cURL = 'https://raw.githubusercontent.com/GoogleChrome/puppeteer/master/package.json';
    await globalPage.goto(cURL, {waitUntil: 'networkidle0'});

    //I would leave this here as a fail safe
     await globalPage.content(); 
 
     innerText = await globalPage.evaluate(() =>  {
         return JSON.parse(document.querySelector("body").innerText); 
     }); 
     //console.log(innerText);
     _logJSON(innerText) ;

    return jsonDividends ;
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

/*
process.on('message', async (message) => {
    console.log(message) ;


    switch(message.request){
        case 'init':
            await _initBrowser() ;
            let jsonRespInit = {
                'ack':'done',
                'tickerID':message.tickerID,
                'request':message.request
            } ;
            process.send(jsonRespInit);
            break ;
        case 'exit':
            await _exitBrowser() ;
            let jsonRespExit = {
                'ack':'done',
                'tickerID':message.tickerID,
                'request':message.request
            } ;
            process.send(jsonRespExit);
            break;
        case 'fetchDevidend':
            if(globalBrowwer==null){
                let jsonRespFail = {
                    'ack':'failed',
                    'tickerID':message.tickerID,
                    'request':message.request
                } ;
                process.send(jsonRespFail);
                break ;
            }
            let jsonDefinition = await _fetchDividend(message.word) ;
            let jsonRespWord = {
                'ack':'done',
                'tickerID':message.tickerID,
                'request':message.request,
                'result':jsonDefinition
            } ;
            process.send(jsonRespWord);
            let cNow = new Date() ;
            console.log('jsonRespWord to send:'+cNow.toTimeString()) ;
            break;
    }
}) ;
*/




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

async function doWork(){

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



doWork() ;

//tryPuppeteerJSON() ;
const puppeteer = require('puppeteer'); // v 1.1.0
const { URL } = require('url');
const fse = require('fs-extra'); // v 5.0.0
const path = require('path');
var fs = require('fs');
const fetch = require('node-fetch') ;
const Decimal = require('decimal.js');
const logger=require('./log.js') ;


let globalBrowwer = null ;
let globalPage = null ;

function _logJSON(jsonData){
    console.log(JSON.stringify(jsonData,null,3)) ;
    logger.log('scrapeYahoo',JSON.stringify(jsonData)) ;
}

function cleanFloat(cFloat){
    return cFloat.replace(',','') ;
}


async function _initBrowser(){
    try {
        globalBrowwer = await puppeteer.launch({headless:"new"});
        globalPage = await globalBrowwer.newPage();
        await globalPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36');
    }catch (e) {
        console.log(`_initBrowser error:${e}`);
    }
}

async function _exitBrowser(){
    try {
        await globalBrowwer.close(); 
        globalBrowwer = null ;
        globalPage = null ;
    }catch (e) {
        console.log(`_exitBrowser error:${e}`);
    }
}


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
        console.log(`_fetchQuoteYahoo 1:${cTicker}: ${e}`);
        logger.log('_fetchQuoteYahoo 1:',`${cTicker}:${e}`) ;
        //await globalPage.screenshot({ path: "./output/error.png" }); // Take screenshot of the page
        jsonQuote.retCode = 404 ;
        jsonQuote.ticker = cTicker ;
        return jsonQuote ;
    }
    
    try {
        jsonQuote = await globalPage.evaluate(_parseQuoteYahoo);
        if(jsonQuote.retCode == 200){
            jsonQuote.ticker = cTicker ;
        }
    }catch (e) {
        console.log(`_fetchQuoteYahoo 2:${cTicker}: ${e}`);
        logger.log('_fetchQuoteYahoo 2:',`${cTicker}:${e}`) ;
        //await globalPage.screenshot({ path: "./output/error.png" }); 
        jsonQuote.retCode = 404 ;
    }
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
    
    return {"retCode":404} ;
}


exports.initBrowser = _initBrowser;
exports.fetchQuoteYahoo = _fetchQuoteYahoo;
exports.exitBrowser = _exitBrowser;

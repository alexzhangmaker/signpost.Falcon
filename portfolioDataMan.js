const { URL } = require('url');
const fse = require('fs-extra'); // v 5.0.0
const path = require('path');
var fs = require('fs');
const fetch = require('node-fetch') ;
const Decimal = require('decimal.js');
const logger=require('./log.js') ;
const scraper=require('./scrapeYahoo') ;
const portfolioDB = require('better-sqlite3')('./public/SQLiteDB/PortfolioDB.db', { verbose: console.log });



async function updatePortfolio(){

    let cPortfolioFile = `./public/json/portfolio.json` ;
    let cPortfolio = fs.readFileSync(cPortfolioFile) ;
    let jsonPortfolio = JSON.parse(cPortfolio) ;
    console.log(JSON.stringify(jsonPortfolio,null,3)) ;

    
    await scraper.initBrowser() ;

    for(let i=0;i<jsonPortfolio.accounts.length;i++){
        for(let j=0;j<jsonPortfolio.accounts[i].holdings.length;j++){
            if(jsonPortfolio.accounts[i].holdings[j].class!='share')continue ;

            let cTicker = jsonPortfolio.accounts[i].holdings[j].ticker ;
            let jsonQuote = await scraper.fetchQuoteYahoo(cTicker) ;
            if(jsonQuote.retCode==200){
                console.log(JSON.stringify(jsonQuote,null,3)) ;
                updateHolding_Quote(jsonQuote.ticker,jsonQuote.Quote) ;
            }else{
                //logger() ;
                logger.log('error', `fail fetchQuote ${cTicker}`);
            }

           
        }
    }
    
    await scraper.exitBrowser() ;
    console.log(JSON.stringify(jsonPortfolio,null,3)) ;
    let cData = JSON.stringify(jsonPortfolio,null,3) ;
    //fs.writeFileSync(cPortfolioFile,cData) ;
}


async function updatePortfolioAccount(cAccount){
    logger.log(`updatePortfolioAccount`,cAccount) ;

    let cPortfolioFile = `./public/json/portfolio.json` ;
    let cPortfolio = fs.readFileSync(cPortfolioFile) ;
    let jsonPortfolio = JSON.parse(cPortfolio) ;
    //console.log(JSON.stringify(jsonPortfolio,null,3)) ;

    await scraper.initBrowser() ;

    for(let i=0;i<jsonPortfolio.accounts.length;i++){
        if(jsonPortfolio.accounts[i].general.account==cAccount){
            for(let j=0;j<jsonPortfolio.accounts[i].holdings.length;j++){
                if(jsonPortfolio.accounts[i].holdings[j].class!='share')continue ;
    
                let cTicker = jsonPortfolio.accounts[i].holdings[j].ticker ;
                let jsonQuote = await scraper.fetchQuoteYahoo(cTicker) ;
                if(jsonQuote.retCode==200){
                    console.log(JSON.stringify(jsonQuote,null,3)) ;
                    updateHolding_Quote(jsonQuote.ticker,jsonQuote.Quote) ;
                }else{
                    //logger() ;
                    logger.log('error', `fail fetchQuote ${cTicker}`);
                }
            }
            break ;
        }
    }
    await scraper.exitBrowser() ;
}




function loadAccountSQLite(accountNO){
    let cStmt = `
        INSERT INTO accounts (
            accountNO,owner, bookvalue_CNY,bookvalue_USD,bookvalue_HKD,bookvalue_AUD,bookvalue_GBP,cash_CNY,cash_USD,cash_HKD,cash_AUD,cash_GBP,debt_CNY,debt_USD,debt_HKD,debt_AUD,debt_GBP,totalPL,totalPL_Per) 
            VALUES (@accountNO, @owner,@bookvalue_CNY,@bookvalue_USD,@bookvalue_HKD,@bookvalue_AUD,@bookvalue_GBP,@cash_CNY,@cash_USD,@cash_HKD,@cash_AUD,@cash_GBP,@debt_CNY,@debt_USD,@debt_HKD,@debt_AUD,@debt_GBP,@totalPL,@totalPL_Per)
    ` ;
    const stmt = portfolioDB.prepare(cStmt);
    let jsonAccount={
            "accountNO":accountNO,"owner": "alexszhang@gmail.com","bookvalue_CNY": 0,"bookvalue_USD": 0,"bookvalue_HKD": 0,"bookvalue_AUD": 0,"bookvalue_GBP": 0,"cash_CNY": 0,"cash_USD": 0,"cash_HKD": 0,"cash_AUD": 0,"cash_GBP": 0,"debt_CNY": 0,"debt_USD": 0,"debt_HKD": 0,"debt_AUD": 0,"debt_GBP": 0,"totalPL": 0,"totalPL_Per":0
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
    await scraper.initBrowser() ;

    let jsonQuote = await scraper.fetchQuoteYahoo(ticker);
    //console.log(JSON.stringify(jsonQuote,null,3)) ;
    if(jsonQuote.retCode==200){
        console.log(JSON.stringify(jsonQuote,null,3)) ;
        updateHolding_Quote(ticker,jsonQuote.Quote) ;
    }else{
        //logger() ;
        logger.log('error', `fail fetchQuote ${ticker}`);
    }
    await scraper.exitBrowser() ;
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




async function updatePortfolioAccounts(){
    let accounts=['海通证券','招商证券','平安证券','国金证券','IBKR-1279','IBKR-3979','IBKR-6325','IBKR-7075'] ;
    accounts.forEach( async (account)=>{
        await updatePortfolioAccount(account) ;
    }) ;
}

async function updateAccounts(){
    let accounts=['海通证券','招商证券','平安证券','国金证券','IBKR-1279','IBKR-3979','IBKR-6325','IBKR-7075'] ;
    accounts.forEach(async (account)=>{
        updateAccounts(account,"CNY") ;
        updateAccounts(account,"HKD") ;
        updateAccounts(account,"USD") ;
        updateAccounts(account,"GBP") ;
        updateAccounts(account,"AUD") ;
    }) ;
}


function _publishPortfolio(cFileURI){
    
}

exports.dbUpdateSingleHolding = updateSingleHolding;
exports.dbUpdateHoldingQuote = updateHolding_Quote;

exports.dbUpdatePortfolioAccount = updateAccounts;
exports.dbUpdatePortfolioHoldings = updatePortfolioAccounts;
exports.publishPortfolio = _publishPortfolio;




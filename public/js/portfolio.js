
function renderPortfolioCard(tagCardContainer,jsonPortfolio={}){
    let cHTML = `
          <div class="card border-success">
            <div class="card-header signpostFlex">
              <div>
                <i class="bi-bar-chart-line-fill" style="font-size: 24px;"></i>
                <span>纵览</span>
              </div>
              <div>
                <span>total P/L: ${jsonPortfolio.general.totalPL}</span>
                <i class="bi-graph-up" style="color: orangered;font-size: 24px;"></i>
              </div>
            </div>
  
            <div class="card-body">
                <div class="table-responsive"> 
                  <table class="table">
                      <thead>
                          <tr>
                              <th>Account</th>
                              <th>Value TTM</th>
                              <th>Gain/Loss</th>
                              <th>G/L %</th>
                          </tr>
                      </thead>
                      <tbody></tbody>
                  </table>
              </div> 
            </div>
            <div class="card-footer text-muted signpostFlex">
              <span style="font-size: 12px;">${jsonPortfolio.general.date}</span>
              <i class="bi-info-circle"></i>
            </div>
          </div>
    ` ;
  
    let tagCard = document.createElement('div') ;
    tagCardContainer.appendChild(tagCard) ;
    tagCard.classList.add('col') ;
    tagCard.classList.add('falconCard') ;
    tagCard.classList.add('fcPortfolio') ;
    tagCard.innerHTML = cHTML ;
  
    let tagTBody = tagCard.querySelector('tbody') ;
    for(let i=0;i<jsonPortfolio.accounts.length;i++){
      let cRowHTML = `
            <td>${jsonPortfolio.accounts[i].account}</td>
            <td>${jsonPortfolio.accounts[i].equityTTM}</td>
            <td>${jsonPortfolio.accounts[i].pl_day}</td>
            <td>${jsonPortfolio.accounts[i].pl_day_percent*100}%</td>
      ` ;
      let tagRow = document.createElement('tr') ;
      tagTBody.appendChild(tagRow) ;
      tagRow.innerHTML = cRowHTML ;
    }
  }
  
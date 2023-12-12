/**
 * 
      <div class='col fcPortfolio falconCard'>
        <div class="card border-success">
          <div class="card-header signpostFlex">
            <div>
              <i class="bi-bar-chart-line-fill" style="font-size: 24px;"></i>
              <span>纵览</span>
            </div>
            <div>
              <span>win $2050.00</span>
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
                    <tbody>
                        <tr>
                            <td>U1234567</td>
                            <td>$780,000</td>
                            <td>1560.00</td>
                            <td>0.67%</td>
                        </tr>
                        <tr>
                          <td>U1234567</td>
                            <td>$780,000</td>
                            <td>1560.00</td>
                            <td>0.67%</td>
                        </tr>
                        <tr>
                          <td>U1234567</td>
                          <td>$780,000</td>
                          <td>1560.00</td>
                          <td>0.67%</td>
                        </tr>
                        <tr>
                          <td>海通证券</td>
                          <td>RMB280,000</td>
                          <td>-156.00</td>
                          <td>-0.91%</td>
                        </tr>
                        <tr style="color: orchid; font-weight: bold;">
                          <td>Total[RMB]</td>
                          <td>RMB1280,000</td>
                          <td>-156.00</td>
                          <td>-0.21%</td>
                        </tr>
                        <tr style="color:firebrick;font-family: Georgia, 'Times New Roman', Times, serif;">
                          <td>Total[USD]</td>
                          <td>$280,000</td>
                          <td>-156.00</td>
                          <td>-0.21%</td>
                        </tr>
                    </tbody>
                </table>
            </div> 
          </div>
          <div class="card-footer text-muted signpostFlex">
            <span style="font-size: 12px;">2023/10/29</span>
            <i class="bi-info-circle"></i>
            
          </div>
        </div>
      </div>
 */
function renderPortfolioCard(tagCardContainer,jsonPortfolio){
    let cHTML = `
          <div class="card border-success">
            <div class="card-header signpostFlex">
              <div>
                <i class="bi-bar-chart-line-fill" style="font-size: 24px;"></i>
                <span>纵览</span>
              </div>
              <div>
                <span>total P/L: TBD</span>
                <i class="bi-graph-up" style="color: orangered;font-size: 24px;"></i>
              </div>
            </div>
  
            <div class="card-body">
                <div class="table-responsive"> 
                  <table class="table">
                      <thead>
                          <tr>
                              <th>Account</th>
                              <th>CNY Value</th>
                              <th>USD Value</th>
                              <th>HKD Value</th>
                          </tr>
                      </thead>
                      <tbody></tbody>
                  </table>
              </div> 
            </div>
            <div class="card-footer text-muted signpostFlex">
              <span style="font-size: 12px;">TBD</span>
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
            <td>${jsonPortfolio.accounts[i].general.account}</td>
            <td>${jsonPortfolio.accounts[i].general.bookvalue_CNY}</td>
            <td>${jsonPortfolio.accounts[i].general.bookvalue_USD}</td>
            <td>${jsonPortfolio.accounts[i].general.bookvalue_HKD}</td>
      ` ;
      let tagRow = document.createElement('tr') ;
      tagTBody.appendChild(tagRow) ;
      tagRow.innerHTML = cRowHTML ;
    }
  }
  

  function renderAccountCard(tagCardContainer,jsonAccount={}){
    let cHTML = `
        <div class="card border-success">
          <div class="card-header signpostFlex">
            <div>
              <i class="bi-bar-chart-line-fill" style="font-size: 24px;"></i>
              <span>资产账户</span>

            </div>
            <div>
              <span>${jsonAccount.general.account} -CNY${jsonAccount.general.totalPL}}</span>
              <i class="bi-graph-up" style="color: orangered;font-size: 24px;"></i>
            </div>

          </div>

          <div class="card-body">
              <div class="table-responsive"> 
                <table class="table">
                    <thead>
                        <tr>
                            <th>ticker</th>
                            <th>Company</th>
                            <th>Shares</th>
                            <th>Cost</th>
                            <th>Price</th>
                            <th>P/L </th>
                            <th>P/L %</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div> 
          </div>
          <div class="card-footer text-muted signpostFlex">
            <span style="font-size: 12px;">${jsonAccount.general.date}</span>
            <i class="bi-info-circle"></i>
          </div>
        </div>
    ` ;

    let tagCard = document.createElement('div') ;
    tagCardContainer.appendChild(tagCard) ;
    tagCard.classList.add('col') ;
    tagCard.classList.add('falconCard') ;
    tagCard.classList.add('fcAccount') ;
    tagCard.innerHTML = cHTML ;


    let tagTBody = tagCard.querySelector('tbody') ;
    for(let i=0;i<jsonAccount.holdings.length;i++){
      let cRowHTML = `
        <td>${jsonAccount.holdings[i].ticker}</td>
        <td>${jsonAccount.holdings[i].company}</td>
        <td>${jsonAccount.holdings[i].shares}</td>
        <td>${jsonAccount.holdings[i].cost}</td>
        <td>${jsonAccount.holdings[i].price}</td>
        <td>${jsonAccount.holdings[i].pl_total}</td>
        <td>${jsonAccount.holdings[i].pl_total_percent*100}%</td>
        <td>${jsonAccount.holdings[i].value}</td>
      ` ;
      let tagRow = document.createElement('tr') ;
      tagTBody.appendChild(tagRow) ;
      tagRow.innerHTML = cRowHTML ;
    }

  }

function renderExpenditureCard(tagCardContainer,jsonExpenditure={}){
    let cHTML = `
    <div class="card border-success">
            <div class="card-header signpostFlex">
              <div>
                <i class="bi-currency-exchange" style="font-size: 24px;"></i>
                <span>月度支出</span>
                </div>
              <div>
                <span>till 2023/10/21</span>
                <i class="bi-graph-up" style="color: orangered;font-size: 24px;"></i>
              </div>
    
            </div>
    
            <div class="card-body">
                <div class="table-responsive"> 
                  <table class="table">
                      <thead>
                          <tr>
                              <th>date</th>
                              <th>pay for</th>
                              <th>class</th>
                              <th>regular?</th>
                              <th>amount</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>2023/10/21</td>
                              <td>Gasline</td>
                              <td>transportation</td>
                              <td>none</td>
                              <td>THB1052.00</td>
                          </tr>                          
                      </tbody>
                  </table>
              </div> 
            </div>
            <div class="card-footer text-muted signpostFlex">
              <span style="font-size: 12px;">${jsonExpenditure.date}</span>
              <div>
              <i class="bi-plus-square falconButton" id="idBTNNewSpending"></i>   
              <i class="bi-check-square"></i>         
            </div>
            </div>
          </div>
    ` ;
    let tagCard = document.createElement('div') ;
    tagCardContainer.appendChild(tagCard) ;
    tagCard.classList.add('col') ;
    tagCard.classList.add('falconCard') ;
    tagCard.classList.add('fcExpenditure') ;
    tagCard.innerHTML = cHTML ;
  
    let tagTblBody = tagCard.querySelector('tbody') ;
  
    for(let i=0;i<jsonExpenditure.expenditures.length;i++){
      let tagRow = document.createElement('tr') ;
      tagTblBody.appendChild(tagRow) ;
      tagRow.innerHTML=`
            <tr>
              <td>${jsonExpenditure.expenditures[i].date}</td>
              <td>${jsonExpenditure.expenditures[i].pay_for}</td>
              <td>${jsonExpenditure.expenditures[i].class}</td>
              <td>${jsonExpenditure.expenditures[i].regular}</td>
              <td>${jsonExpenditure.expenditures[i].currency} ${jsonExpenditure.expenditures[i].amount}</td>
            </tr>
      ` ;
    }
  }
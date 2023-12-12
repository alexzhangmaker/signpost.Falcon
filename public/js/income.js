function renderFalconIncomeCard(tagCardContainer,jsonIncome={}){
    let cHTML = `
          <div class="card border-success">
            <div class="card-header signpostFlex">
              <div>
                <i class="bi-currency-exchange" style="font-size: 24px;"></i>
                <span>当月收入</span>
              </div>
              <div>
                <span>till ${jsonIncome.date}</span>
                <i class="bi-graph-up" style="color: orangered;font-size: 24px;"></i>
              </div>
    
            </div>
    
            <div class="card-body">
                <p class="card-text">detailed income</p>
                <div class="table-responsive overflow-auto"> 
                  <table class="table">
                      <thead>
                          <tr>
                              <th>Date</th>
                              <th>Income</th>
                              <th>Source</th>
                              <th>Class</th>
                              <th>Status</th>
                          </tr>
                      </thead>
                      <tbody>
                        
                      </tbody>
                  </table>
              </div> 
            </div>
            <div class="card-footer text-muted signpostFlex">
              <span style="font-size: 12px;">2023/10/29</span>
              <div>
                <i class="bi-info-circle" style="font-size: 18px;"></i>   
              </div>
            </div>
          </div>
    ` ;
    let tagCard = document.createElement('div') ;
    tagCardContainer.appendChild(tagCard) ;
    tagCard.classList.add('col') ;
    tagCard.classList.add('falconCard') ;
  
    tagCard.classList.add('fcMonthlyIncome') ;
    tagCard.innerHTML = cHTML ;
  
    let tagTblBody = tagCard.querySelector('tbody') ;
  
    for(let i=0;i<jsonIncome.incomes.length;i++){
      let tagRow = document.createElement('tr') ;
      tagTblBody.appendChild(tagRow) ;
      tagRow.innerHTML=`
            <tr>
              <td>${jsonIncome.incomes[i].date}</td>
              <td>${jsonIncome.incomes[i].currency} ${jsonIncome.incomes[i].income}</td>
              <td>${jsonIncome.incomes[i].source}</td>
              <td>${jsonIncome.incomes[i].class}</td>
              <td>${jsonIncome.incomes[i].status}</td>
            </tr>
      ` ;
      if(jsonIncome.incomes[i].status!='collected'){
        tagRow.style.color="blue" ;
      }
    }
  }
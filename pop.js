var table; //桌面
var poplen=10;
var popArr =[];
var width = 50;
var height = 50;
var timer = null;
var colllection = [];
var baseScore = 10;
var stepScore = 5;
var totolScore = 0;
var scoreBoard;
var btn;






function creatPop(row,col) {
    var pop = document.createElement('div')
      pop.col = col
      pop.row = row
      pop.value = Math.floor(Math.random()*5)
      pop.style.position = 'absolute'
      pop.style.width = width+'px'
      pop.style.height = height+'px'
      pop.style.left = col*width+'px'
      pop.style.bottom = row*height+'px'
      pop.style.boxSizing = 'border-box'
      // pop.style.border = '1px solid #987654'
      pop.style.cursor = 'pointer'
      pop.style.borderRadius = '8px'
      pop.style.background = "url('./pic/"+pop.value+".png')"
      pop.style.backgroundSize = "cover"
      pop.style.transform = 'scale(0.95)'
      return pop;
}

function move () {
  for (var i = 0; i < poplen; i++) {//竖直方向下落
    var pointer = 0
    for (var j = 0; j < poplen; j++) {
      if (popArr[j][i] != null) {//第一个参数代表row
        if (j != pointer) {
          popArr[pointer][i] = popArr[j][i]
          popArr[j][i].row = pointer
          popArr[j][i] = null
        }
        pointer++   //如果最下层的被占了，就看上一层的
      }
    }
  }

  for (var i = 0; i <popArr[0].length ; i++) {
    if (popArr[0][i] == null) {
      for (var j = 0 ; j < boardWidth ; j ++) {
          popArr[j].splice(i, 1);
      }
      continue;
    }
  }
}

function selectScore () {
  var score = 0
  for (var i = 0; i < colllection.length; i++) {
    score += baseScore + stepScore*i
  }
  scoreBoard = document.getElementById('selectScore')
  scoreBoard.display = 'block'
  scoreBoard.innerHTML = score
  setTimeout(() => {
    scoreBoard.display ='none'
  },1000)
}

function reAgin () {
  if (timer) {
    clearInterval(timer)
  }
  for (var i = 0; i < popArr.length; i++) {
    for (var j = 0; j < popArr[i].length; j++) {
      if (popArr[i][j] == null) {
        continue
      }
      popArr[i][j].style.transform = 'scale(0.95)'
    }
  }
}

function fliker (obj) {
  var n = 1
  timer = setInterval(() => {
    for (var i = 0; i < obj.length; i++) {
      obj[i].style.transform = 'scale('+(0.90+0.05*Math.pow(-1,n))+')'
    }
    n++
  },300)
}

function popChain (obj,arr) {
  if (obj == null) {
    return
  }
  // console.log(obj);
  // console.log(obj);
  arr.push(obj)//判断上下左右，如果有就把它push一下，重复的忽略
  if (obj.col>0 && popArr[obj.row][obj.col-1] && popArr[obj.row][obj.col-1].value == obj.value && arr.indexOf(popArr[obj.row][obj.col-1]) == -1)  {
    popChain(popArr[obj.row][obj.col-1],arr)
  }
  if (obj.col<poplen-1 && popArr[obj.row][obj.col+1] && popArr[obj.row][obj.col+1].value == obj.value && arr.indexOf(popArr[obj.row][obj.col+1]) == -1) {
    popChain(popArr[obj.row][obj.col+1],arr)
  }
  if (obj.row>0 && popArr[obj.row-1][obj.col] && popArr[obj.row-1][obj.col].value == obj.value && arr.indexOf(popArr[obj.row-1][obj.col]) == -1) {
    popChain(popArr[obj.row-1][obj.col],arr)
  }
  if (obj.row<poplen-1 && popArr[obj.row+1][obj.col] && popArr[obj.row+1][obj.col].value == obj.value && arr.indexOf(popArr[obj.row+1][obj.col]) == -1) {
    popChain(popArr[obj.row+1][obj.col],arr)
  }
}

function mouseOver (obj) {
  colllection = []
  popChain(obj,colllection)
  reAgin()
  if (colllection.length<2) {
    return
  }
  fliker(colllection)
  selectScore()
}

function init () {
  table = document.querySelector('#pop_star')
  for (var i = 0 ; i < poplen ; i++) {
      popArr[i] = new Array();
      for (var j = 0; j < poplen; j++) {
          var pop = creatPop(i ,j)
          pop.onmouseover = function () {
            mouseOver(this)
          }
          pop.onclick = function () {
            if (colllection <=1) {
              return
            }
            var score = 0
            for (var i = 0; i < colllection.length; i++) {
              score += baseScore + stepScore*i
            }
            totolScore += score
            document.getElementById('nowScore').innerHTML = totolScore
            for (var i = 0; i < colllection.length; i++) {
              (function(i){
                setTimeout(function () {
                  popArr[colllection[i].row][colllection[i].col] = null
                  console.log(colllection[i])
                  table.removeChild(colllection[i])
                },i*100)
              }(i))
            }
            setTimeout(function () {
              move()
            },)
          }
          popArr[i][j] = pop
          table.appendChild(pop)
      }
  }
}

init();

function Mine(tr, td, minNum) {
  this.tr = tr;//行数
  this.td = td;//列数
  this.minNum = minNum;//雷的数量

  this.squares = [];//存储所有方格的信息，他是一个二维数组，按行与列的顺序排放，存取都使用行列的形式
  this.tds = [];//存取所有单元格的DOM（二维数组）
  this.surplusMine = minNum;//剩余雷的数量
  this.allRight = false;//右击标的小红旗是否全是雷，用来判断用户是否游戏成功

  this.parent = document.querySelector(".gameBox");
}

//生成n个不重复的数字
Mine.prototype.randomNum = function () {
  var square = new Array(this.tr*this.td); //生成一个空数组，长度为格子的总数
  for (var i=0;i<square.length;i++) {
    square[i] = i;
  }
  console.log("square1", square);
  square.sort(function () {
    return 0.5 - Math.random();
  });
  console.log("square2",square);
  return square.slice(0, this.minNum);
};

Mine.prototype.init = function () {
  // this.randomNum();
  var rn = this.randomNum();//雷在格子中的位置
  var n = 0; //用来找到格子对应的索引
  for (var i=0;i<this.tr;i++) {
    this.squares[i] = [];
    for (var j=0;j<this.td;j++) {
      // n++;

      //取一个方块在数组里的数据要使用行与列的形式去取，找方块周围的方块的时候要使用坐标的形式去取，
      // 行与列的形式与坐标的形式，x和y刚好是相反的
      if (rn.indexOf(++n) !== -1) {
        //如果这个条件成立，说明现在循环到的这个索引在雷的数组中找到了，那就表示这个索引对应的是个雷
        this.squares[i][j] = {type:'mine',x:j,y:i};
      }else {
        this.squares[i][j] = {type:'number',x:j,y:i,value:0};
      }
    }
  }
  console.log(this.squares);

  this.updateNum();
  this.createDom();

  //阻止右键
  this.parent.oncontextmenu = function() {
    return false;
  };
};

//创建表格
Mine.prototype.createDom = function () {
  var that = this;
  var table = document.createElement('table');

  for(var i = 0; i < this.tr; i++) {//行
    var domTr = document.createElement('tr');
    this.tds[i] = [];

    for (var j = 0;j < this.td; j++) {//列
      var domTd = document.createElement('td');

      domTd.pos = [i,j];//把格子对应的行与列存在格子身上，为了下面通过这个值去数组中取到对应的数据
      domTd.onmousedown = function () {
        that.play(event, this);// that指的是实例对象，this指的是点击的那个td
      };

      // domTd.innerHTML = 0;
      this.tds[i][j] = domTd;//把所有创建的td添加到数组当中

      if (this.squares[i][j].type === "mine") {
        domTd.className = "mine";
      }
      if (this.squares[i][j].type === "number") {
        domTd.innerHTML = this.squares[i][j].value;
      }

      domTr.appendChild(domTd);
    }
    table.appendChild(domTr);
  }
  this.parent.appendChild(table);
};

//找某个方格周围的所有格子
Mine.prototype.getAround = function (square) {
  var x = square.x;
  var y = square.y;
  var result =[];//把找到格子坐标返回出去(二位数组)

  /*  x-1,y-1   x,y-1     x+1,y-1
  *   x-1,y     x,y       x+1,y
  *   x-1,y+1   x,y+1     x+1,y+1
  * */

  //通过坐标循环九宫格
  for (var i=x-1;i<=x+1;i++) {
    for (var j=y-1;j<=y+1;j++) {
      if (
          i<0 || //格子超出了左边的范围
          j<0 || //格子超出了上边的范围
          i>this.td-1 || //格子超出了下边的范围
          j> this.tr-1 ||//格子超出了右边的范围
          (i==x && j==y) || //循环到自身
          this.squares[j][i].type === "mine" //周围的格子是雷
      ) {
        continue;
      }
      result.push([j,i]);//以行与列的形式返回出去，因为到时候需要用它去取数组里的数据
    }
  }

  return result;
};

//更新所有的数字
Mine.prototype.updateNum = function () {
  for (var i=0;i<this.tr;i++) {
    for (var j=0;j<this.td;j++) {
      //只更新雷周围的数字
      if (this.squares[i][j].type === "number") {
        continue;
      }

      var num = this.getAround(this.squares[i][j]);//获取到每一个雷周围的数字

      for (var k=0;k<num.length;k++) {
        // num[i] == [0,1]
        // num[i][0] == 0;
        // num[i][1] == 1;
        this.squares[num[k][0]][num[k][1]].value += 1;
      }
      console.log(num);
    }
  }
  console.log(this.squares)
};

Mine.prototype.play = function (ev, obj) {
  if (ev.which == 1) {
    //点击的是左键

  }
  console.log(obj);
}

var mine = new Mine(28, 28, 99);
mine.init();

// console.log(mine.getAround(mine.squares[0][1]));

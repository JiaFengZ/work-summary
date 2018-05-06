(function(window) {
  // 元素
  var container = document.getElementById('game');
  var scoreContainers = document.querySelectorAll('.score');
  var clevelContainer = document.querySelector('.game-level');
  var nlevelContainer = document.querySelector('.game-next-level');

  //参数设置应符合 (enemyGap + enemySize）* numPerLine < 700 - canvasPadding * 2
  var CONFIG = {
    status: 'start', // 游戏开始默认为开始中,可选 start、failed、success、all-success、playing
    level: 1, // 游戏默认等级
    totalLevel: 3, // 总共3关，不宜超过6关
    numPerLine: 6, // 游戏默认每行多少个怪兽,数值不宜大于10
    canvasPadding: 30, // 默认画布的间隔
    bulletSize: 10, // 默认子弹长度
    bulletSpeed: 10, // 默认子弹的移动速度
    enemySpeed: 2, // 默认敌人移动距离
    enemySize: 50, // 默认敌人的尺寸
    enemyGap: 10,  // 默认敌人之间的间距
    enemyIcon: './img/enemy.png', // 怪兽的图像
    enemyBoomIcon: './img/boom.png', // 怪兽死亡的图像
    enemyDirection: 'right', // 默认敌人一开始往右移动
    planeSpeed: 5, // 默认飞机每一步移动的距离
    planeSize: {
      width: 60,
      height: 100
    }, // 默认飞机的尺寸,
    planeIcon: './img/plane.png',
  };

  /**
   * 整个游戏对象
   */
  var GAME = {
    /**
     * 初始化函数,这个函数只执行一次
     * @param  {object} opts 
     * @return {[type]}      [description]
     */
    init: function(opts) {
      this.status = CONFIG.status;
      this.score = 0;
      this.level = CONFIG.level;
      clevelContainer.innerHTML ='当前Level：' + this.level; //初始化显示
      container.setAttribute("data-status", this.status);          
      this.bindEvent();
    },
    bindEvent: function() {
      var self = this;
      var playBtn = document.querySelector('.js-play');
      var replayBtn = document.querySelector('.js-replay');
      var nextBtn = document.querySelector('.js-next');
      var replayOnceBtn = document.querySelector('.js-playOnce');

      // 开始游戏按钮绑定
      playBtn.onclick = function() {
        self.score = 0;
        self.play();
      };
      replayBtn.onclick = function() {       
        self.score = 0;
        self.play();
      };
      nextBtn.onclick = function() {      
        self.play();
      };
      replayOnceBtn.onclick = function() {      
        self.score = 0;
        self.play();
      };
    },
    /**
     * 更新游戏状态，分别有以下几种状态：
     * start  游戏前
     * playing 游戏中
     * failed 游戏失败
     * success 游戏成功
     * all-success 游戏通过
     * stop 游戏暂停（可选）
     */
    setStatus: function(status) {
      this.status = status;
      container.setAttribute("data-status", status);
      switch (this.status) {
        case 'failed':
          this.level = 1;
          break;
        case 'success':
          this.level++;
          break;
        case 'all-success':
          this.level = 1;
          break;
      }
      nlevelContainer.innerHTML ='下一个Level：' + this.level;
      var len = scoreContainers.length;
      for (var i = 0; i < len; i++) {
        scoreContainers[i].innerHTML = this.score;
      }      
    },    
    increaseScore: function() {
      this.score++;      
    },
    beginGame: function() {
      
    },
    play: function() {
      this.setStatus('playing');
      this.beginGame();
    }
  };
  
  window.$GAME = GAME;
  window.$CONFIG = CONFIG

  // 初始化
  GAME.init();
})(window)


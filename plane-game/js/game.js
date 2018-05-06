(function(GAME, CONFIG) {
	var SCENE = {
		width: 700,
		height: 600,
		padding: [CONFIG.canvasPadding, CONFIG.canvasPadding, CONFIG.canvasPadding, CONFIG.canvasPadding],
		planeRegion: {
			minX: CONFIG.canvasPadding,
			maxX: 700 - CONFIG.canvasPadding
		},
		monsterRegion: {
			minX: CONFIG.canvasPadding,
			maxX: 700 - CONFIG.canvasPadding,
			minY: CONFIG.canvasPadding,
			maxY: 600 - CONFIG.canvasPadding - CONFIG.planeSize.height
		}
	};
	var monsters = []; //敌人集合
	var bullets = []; //子弹集合
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var plane;
	var monsterImg = new Image();
	var planeImg = new Image();
	var boomImg = new Image();
	monsterImg.src = CONFIG.enemyIcon;
	planeImg.src = CONFIG.planeIcon;
	boomImg.src = CONFIG.enemyBoomIcon;

	function Element(options) {
		this.options = {
			x: options.x,
			y: options.y,
			width: options.width,
			height: options.height,
			moveStep: options.moveStep,		
			curDir: options.curDir
		};	
		this.index = options.index;
	}
	Element.prototype.move = function(dir, step) {
		this.options.curDir = dir = dir || this.options.curDir;
		switch (dir) {
			case 'left':
				this.options.x -= step || this.options.moveStep;
				break;
			case 'right':
				this.options.x += step || this.options.moveStep;
				break;
			case 'bottom':
				this.options.y += step || this.options.moveStep;
				break;
			case 'top':
				this.options.y -= step || this.options.moveStep;
				break;
			default:
				return;
		}
	};

	function Monster(options) {
		Element.call(this, options);	
		this.options.status = 'survival';//death
		this.options.boomCount = 0;
		this.destroy = function() {
			this.options.status = 'death';
		};
		this.draw = function() {
			var img = this.options.status == 'survival' ? monsterImg : (++this.options.boomCount && boomImg);
			context.drawImage(img, this.options.x, this.options.y, this.options.width, this.options.height);
			if (this.options.boomCount == 3) {				
				GAME.utils.deleteObjInArr(monsters, 'index', this.index)
			}
		};		
	}
	Monster.prototype = GAME.utils.inheritPrototype(Monster, Element);

	function Plane(options) {	
		Element.call(this, options);		
		this.shot = function() {
			var self = this;		
			bullets.push((function(self) {
				var bullet = new Bullet({
					x: self.options.x + (self.options.width / 2),
					y: self.options.y,
					width: 1,
					height: CONFIG.bulletSize,
					moveStep: CONFIG.bulletSpeed,		
					index: new Date().getTime(),
					curDir: 'top'
				});
				bullet.draw();
				return bullet;
			})(this));
		};
		this.draw = function() {
			context.drawImage(planeImg, this.options.x, this.options.y, this.options.width, this.options.height);			
		};
	}
	Plane.prototype = GAME.utils.inheritPrototype(Plane, Element);

	function Bullet(options) {
		Element.call(this, options);	
		this.destroy = function() {
			GAME.utils.deleteObjInArr(bullets, 'index', this.index);
		};
		this.draw = function() {
			context.lineWidth = this.width;
			context.strokeStyle = '#fff';
			context.beginPath();
			context.moveTo(this.options.x, this.options.y);
			context.lineTo(this.options.x, this.options.y - this.options.height);
			context.stroke();
		};
	}
	Bullet.prototype = GAME.utils.inheritPrototype(Bullet, Element);

	//左上角显示分数
	function showScore() {		
		context.fillStyle = '#fff';
		context.font = '18px Arial';
		context.textAlign = 'start';
		context.textBaseline = 'top';
		context.fillText('分数：' + GAME.score, 20, 20);
	};

	function checkMonsterRegion(monsters) {
		var len = monsters.length;
		while (len--) {
			if (monsters[len].options.x + monsters[len].options.moveStep + monsters[len].options.width > SCENE.monsterRegion.maxX) return 1;
			if (monsters[len].options.x - monsters[len].options.moveStep < SCENE.monsterRegion.minX) return 2;	
			if (monsters[len].options.y > SCENE.monsterRegion.maxY) return 3;		
		}
		return 4;
	}

	//检查游戏状态
	function chechGameStatus(monsters) {
		var length = monsters.length;
		if (length) {
			if (checkMonsterRegion(monsters) == 3) {
				GAME.setStatus('failed');
				resetGame();
				return false;
			}
			return true;			
		} else if (GAME.level >= CONFIG.totalLevel) {
			GAME.setStatus('all-success');
			resetGame();
		} else {
			GAME.setStatus('success');
			resetGame();
		}
		return false;
	};

	//移动精灵怪兽
	function moveMonsters(monsters) {					
		if (monsters.length) {
			var moveFun;
			var result = checkMonsterRegion(monsters);
			switch (result) {
				case 1:
					moveFun = function(monster) {
						monster.options.curDir == 'bottom' ? monster.move('left') : monster.move('bottom', 50);		
					};
					break;
				case 2:
					moveFun = function(monster) {
						monster.options.curDir == 'bottom' ? monster.move('right') : monster.move('bottom', 50);			
					};
					break;
				case 4:
					moveFun = function(monster) {
						monster.move();			
					};
					break;
			}
			monsters.forEach(moveFun);
		}					 
	};

	//移动子弹
	function moveBullets(bullets) {	
		var len = bullets.length;
		while (len--) {
			if (bullets[len].options.y < 0) {
				bullets[len].destroy();			
			} else {
				bullets[len].move();
			}
		}		
	}
	
	function drawElements(elements) {
		elements.map(function(ele) {
			ele.draw();
		});
	}

	//检查精灵和子弹是否碰撞
	function checkCrash(monsters, bullets) { 
		var len = monsters.length;	
		while (len--) {
			var len1 = bullets.length;
			while (len1--) {			
				var M = {
					x: monsters[len].options.x,
					y: monsters[len].options.y,
					width: monsters[len].options.width,
					height: monsters[len].options.height
				};
				var B = {
					x: bullets[len1].options.x,
					y: bullets[len1].options.y - bullets[len1].options.height,
					width: bullets[len1].options.width,
					height: bullets[len1].options.height
				};
				if (GAME.utils.isCrash(M, B)) {					
					bullets[len1].destroy();
					//必须检查子弹与敌人碰撞时，敌人为生存状态才计分，否则子弹击中死亡状态的敌人会重复计分
					if (monsters[len].options.status == 'survival') {
						monsters[len].destroy();
						GAME.increaseScore();
					} 	
					break;
				}
				
			}
		}	
	};

	//检查飞机移动是否超出边界
	function checkPlaneRegion(plane, dir) {
		if (dir == 'right' && plane.options.x + plane.options.moveStep + plane.options.width > SCENE.planeRegion.maxX) return false;
		else if (dir == 'left' && plane.options.x - plane.options.moveStep < SCENE.planeRegion.minX) return false;
		return true;
	};

	//动画循环
	var animate = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		if (GAME.status == 'playing') {
			plane.draw();
			moveMonsters(monsters);
			moveBullets(bullets);			
			checkCrash(monsters, bullets);
			drawElements(bullets);
			drawElements(monsters);
			showScore();
			if (chechGameStatus(monsters)) {									
				requestAnimationFrame(animate);
			} else {
				context.clearRect(0, 0, canvas.width, canvas.height);
			}			
		}		
	};

	//过关或者游戏失败时重置游戏
	function resetGame() {
		monsters = [];
		bullets = [];
		plane = null;
		keyCodes = [];
		document.removeEventListener('keydown', addKeycode);
		document.removeEventListener('keyup', removeKeyCode);
		document.removeEventListener('keydown', controlEvents);
	}	


	var keyCodes = [];  //存放所有按下的键码，keydown可同时触发移动、射击事件	
	function addKeycode(e) {
		var key = e.keyCode || e.which || e.charCode;
		if (!GAME.utils.getItemInArr(keyCodes, key)) {
			keyCodes.push(key);
		}
	}
	function removeKeyCode(e) {
		var key = e.keyCode || e.which || e.charCode;
		GAME.utils.deleteItemInArr(keyCodes, key);
	}
	function controlEvents(e) {
		if (plane) {	
			keyCodes.forEach(function(key) {
				switch(key) {
			      // 点击左方向键
			      case 37: 
			        if (checkPlaneRegion(plane, 'left')) {
			        	plane.move('left');
						plane.draw();
			        }	        
			        break;
			      // 点击上方向键
			      case 38: 
			        plane.shot();
			        break;
			      // 点击空格键
			      case 32: 
			        plane.shot();
			        break;
			      // 点击右方向键
			      case 39: 
			        if (checkPlaneRegion(plane, 'right')) {
			        	plane.move('right');
						plane.draw();
			        }
			        break;         
			    } 
			});
			
		}		
	}

	//根据level初始化游戏元素
	function initGameElement(levelSetting) {
		for (var j = 0; j < levelSetting.monsterRows; j++) {
			for (var i = 0; i < CONFIG.numPerLine; i++) {				
				if (CONFIG.numPerLine % 2 == 0) {
					var initX = SCENE.width / 2 - (CONFIG.enemyGap + CONFIG.enemySize) * (CONFIG.numPerLine / 2) - CONFIG.enemyGap / 2;
				} else {
					var initX = SCENE.width / 2 - (CONFIG.enemyGap + CONFIG.enemySize) * Math.floor(CONFIG.numPerLine / 2) + CONFIG.enemySize / 2;
				}
				monsters.push(new Monster({
					x: initX + (CONFIG.enemyGap + CONFIG.enemySize) * i,
					y: SCENE.monsterRegion.minY + j * CONFIG.enemySize,
					width: CONFIG.enemySize,
					height: CONFIG.enemySize,
					moveStep: levelSetting.monsterMoveStep,		
					index: j * CONFIG.numPerLine + i,
					curDir: CONFIG.enemyDirection
				}));
			}
		}
		
		plane = new Plane({
			x: SCENE.width / 2,
			y: SCENE.height - CONFIG.planeSize.height - SCENE.padding[3],
			width: CONFIG.planeSize.width,
			height: CONFIG.planeSize.height,
			moveStep: CONFIG.planeSpeed,		
			index: 0,
			curDir: 'right'
		});
	}

	//开始游戏
	GAME.beginGame = function() {						
		initGameElement({
			monsterRows: GAME.level,  //敌人行数
			monsterMoveStep: CONFIG.enemySpeed * GAME.level //敌人移动速度
		});
		document.addEventListener('keydown', addKeycode);
		document.addEventListener('keyup', removeKeyCode);
		document.addEventListener('keydown', controlEvents);
		animate();		
	};
	//如果初始配置游戏为正在进行状态，自动开始游戏
	if (GAME.status == 'playing') {        
        GAME.beginGame();
    }

})(window.$GAME, window.$CONFIG)




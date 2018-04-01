	var wsUrl = "wss://xxxxxx/api/message";  //websocket连接，拉取用户签到和弹幕消息
	
	var camera, scene, renderer;
	var controls;

	var objects = []; //照片墙中的用户集合
	var signSet = []; //签到名单
	var luckerSet = []; //中奖名单
	var drawSet = []; //可抽取的奖项集合
	var targets = { table: [], sphere: [], helix: [], grid: [] }; //存储经过变换空间位置后的用户对象
	var wrapper; //3D照片(用户)墙容器对象

	var peizeConfig = {
		pause: false, //抽奖循环开启/停止
		rotateSpeed: 0.02, //转动速度
		isAuto: false, //是否自动停止
		prizeLevel: '', //当前抽取的奖项等级
		prizeNum: 1 //同时抽取的奖项数目
	};

	init();	
	bindEvent();
	setWebsocket();
	transform( targets.helix, 5000 );	

/********************模拟测试用********************/
	users.data.employeeList.forEach(function(item, index) {
		sign({
			uuid: item.id,
			src: item.image,
			name: item.name || item.nickname,
			dept: item.dept || item.city,
			isUsed: getObjByKeyInArr1(luckerSet, item.openid, 'openid') ? true : false 
		});			
	});
	wrapper = changePivot(0, 0, 0, objects);			
	scene.add( wrapper );
	animate();
	peizeConfig.prizeLevel = '三等奖';
/******************************************/

	function stopLoop() { //点击停止按钮
		$('#select').css('display', 'none');
		prizeSet.forEach(function(item, index) {			
			setTimeout(function() {
				selectUser(item.loopTimer, item.preUser, item.perIndex, index);
			}, 1000 * index);			
		});
	}
	
	function selectUser(loopTimer, preUser, perIndex, index) { //选择中奖者
		$('#select').css('display', 'none');
		clearTimeout(loopTimer);
		loopTimer = null;
		var speed = 10;
		var loopDownTimer, preUser, perIndex;
		peizeConfig.pause = true;
		peizeConfig.rotateSpeed = 0.008;
		loopDown(speed, loopDownTimer, preUser, perIndex, index);
	}

	var prizeSet = []; //同时开启的抽奖循环集合
	function startAllLoop(num) { //开始抽奖
		num > 4 ? num == 4 : '';
		for (var i = 1; i < num + 1; i++) {
			prizeSet.push({
				speed: 500,
				loopTimer: null,
				preUser: null,
				perIndex: null,
				index: i - 1,
			});
		}
		prizeSet.forEach(function(item, index) {		
			if (index > 0) {
				setTimeout(function() {
					startLoop(item.speed, item.loopTimer, item.preUser, item.perIndex, item.index);
				}, 1000);
			} else {
				startLoop(item.speed, item.loopTimer, item.preUser, item.perIndex, item.index);
			}
		});
	}
	
	function startLoop(speed, loopTimer, preUser, perIndex, index) { //开始单个抽奖循环
		if (!signSet.length) return;
		$('#start').css('display', 'none');		
		var speed = 500;
		peizeConfig.pause = false;
		peizeConfig.rotateSpeed = 0.02;

		if (peizeConfig.isAuto) loopUp(speed, loopTimer, preUser, perIndex, index, peizeConfig.isAuto, parseInt(Math.random() * 400) + 300);
		else {
			$('#select').css('display', 'inline-block');
			loopUp(speed, loopTimer, preUser, perIndex, index);
		}
	}
	
	
	function loopUp(speed, loopTimer, preUser, perIndex, index, isAuto, period) {  //抽奖加速
		var totalMoveCount = 0;
		var len = Math.floor(Math.random() * (targets.helix.length - 1)) ;
		setTimeout(function loopFun() {
			if (speed > 100) {
				speed -= 50;
			} else {
				speed == 10 ? speed=10 : speed-=10;
			}	
			var user;			
			var getNextUser = function() {
				len==0?len=targets.helix.length:len;
				var count = 0
				while (len--) {
					user = getObjByKeyInArr(signSet, targets.helix[len].userData.id);
					count++;
					if (count == targets.helix.length + 2) {
						break;
					}
					if (user) {
						break;
					} else if (len==0) {
						len = targets.helix.length;
					}
				}				

			};
			getNextUser();
			if (!user) return;
			totalMoveCount ++;
			preViewPicture(user, index);
			$(user.element).addClass('sliding');
			if (preUser && !preUser.userData.isUsed) $(preUser.element).removeClass('sliding');
			preUser = user;
			perIndex = len;
			
			prizeSet[index].preUser = preUser;
			prizeSet[index].perIndex = perIndex;
			if (isAuto && totalMoveCount > period) {
				console.log(totalMoveCount);
				selectUser(loopTimer, preUser, perIndex, index);
			} else {
				prizeSet[index].loopTimer = loopTimer = setTimeout(function() {
					loopFun();
				}, speed);	
			}
				
		}, speed);			
	}
	
	var moveUsers = [[], [], [], []]; //正在同时进行的抽奖循环过程(最多同时开启4个抽奖循环)
	var moveUserImg = function() { //遍历执行同时存在的抽奖循环过程			
		for (var i = moveUsers.length - 1; i >=0 ; i--) {
			for (var j = moveUsers.length; j>= 0; j--) {
				moveUsers[i][j]&&moveUsers[i][j]();
			}
		}
	};
	
	var slideUser = function(tempUsers, imgEle, speed, initPos, increasePos, preUser, user, countNum, index) {						
		if (speed == 2611)  {
			if ( increasePos > 100) {
				
				if (!user || user.userData.isUsed) {
					var  getOtherUser = function() {
						countNum == 19 ? countNum-- : countNum++;

						if (tempUsers[countNum] && !tempUsers[countNum].userData.isUsed) {
							return tempUsers[countNum];
						}
						else getOtherUser();									
					};
					user = getOtherUser();
					initPos = -(countNum + 1) * 200 + 300;
					imgEle.css('left', initPos + 'px');
				}

				if (!user) {
					alert('出错，请刷新页面重新抽取');
					return;
				}
				if (user) $(user.element).removeClass('sliding');
				if (user) $(user.element).removeClass('blooming');
				if (user.userData.isUsed) getNextUser();
				$(user.element).addClass('blooming');
				$(user.element).addClass('sliding');

				preViewPicture(user, index);				
				outPutUser(user, index);
				user.userData.isUsed = true;	
				preUser = null;
				moveUsers[index] = [];				
			}			
		} else imgEle.css('left', initPos + 'px');	
	}
		
	function loopDown(speed, loopDownTimer, preUser, perIndex, index) { //抽奖减速
		var len = perIndex || 0;		
		var user;		
		var imgEle = $('.viewlucker[index="'+index +'"]').find('.lucker-img-container');	
		var getNextUser = function(dir) {
			dir = dir || 'next';
			len==0?len=targets.helix.length:len;
			var count = 0;
			if (dir == 'next') {
				while (len--) {
					user = getObjByKeyInArr(signSet, targets.helix[len].userData.id);
					count++;
					if (count == targets.helix.length + 2) {
						break;
					}
					if (user && !user.userData.isUsed) {
						return user;
						break;
					} else if (len==0) {
						len = targets.helix.length;
					}
				}	
			} else if (dir == 'pre'){
				while (len > -1) {						
					user = getObjByKeyInArr(signSet, targets.helix[len] && targets.helix[len].userData.id);
					count++;
					if (count == targets.helix.length + 2) {
						break;
					}
					if (user && !user.userData.isUsed) {
						return user;
						break;
					}						
					len > targets.helix.length-1 ? len = 0 : len++;
				}	
			} 				
		};
		var tempUsers = [];
		var imgStr = '';
		for (var i = 0; i < 20; i++) {
			tempUsers.push(getNextUser());
			imgStr += '<img style="width:200px;height:300px" src="' + tempUsers[i].userData.src + '">';			
		}
		imgEle.html(imgStr).css('left', '100px');
		var countNum = 0;
		var loopStop = false;
		setTimeout(function loopFun() {
			if (speed < 200) {
				speed += 25;
			} else if (speed < 500) {
				speed += 100;
			} else {
				speed > 2500 ? speed=0 : speed+=500;
			}							
			
			user = tempUsers[countNum];
			if (!user) return;

			$(user.element).addClass('sliding');
			$(user.element).addClass('blooming');
			var initPos = -(countNum + 1) * 200 + 300;
			var increasePos = 0;
			imgEle.css('left', initPos + 'px');
			moveUsers[index].push(function() {			
				if (speed == 0 || speed == 2611) {
					speed = 2611;
					initPos -= 100 / (speed / 16); 
					increasePos += 100 / (speed / 16);
				} else {
					initPos -= 200 / (speed / 16); 
					increasePos += 200 / (speed / 16);
				}	
				slideUser(tempUsers, imgEle, speed, initPos, increasePos, preUser, user, countNum, index);
			});
			
			if (preUser) $(preUser.element).removeClass('sliding');
			if (preUser) $(preUser.element).removeClass('blooming');
			preUser = user;
		
			if (speed != 0) {				
				countNum++;
				loopDownTimer = setTimeout(function() {
					loopFun();
				}, speed);
			}
		}, speed);
	}
	
	
	function outPutUser(obj, index) { //输出获奖人
		if (index == prizeSet.length - 1) {
			if (Math.random() > 0.5) {
				transform( targets.table, 500 );
				wrapper.rotation.y = 0;
			} else transform(targets.grid,2000);
		}
		
		setTimeout(function() {
			if (obj.element) $(obj.element).removeClass('sliding').removeClass('blooming');
			wrapper.remove(obj);		
			deleteObjByKeyInArr(targets.helix, obj.userData.id);
			deleteObjByKeyInArr(objects, obj.userData.id);			
			
			var ele = $('.lucker-container[index="' + index +'"]');
			var leftPos;
			if (index == 0) {
				leftPos = 'calc(50% - 250px)';
				$('#marker').css('display', 'block');
			} else if (index == 1) {
				leftPos = 'calc(50% - 550px)';
			} else if (index == 2) {
				leftPos = 'calc(50% + 50px)';
			} else if (index == 3) {
				leftPos = 'calc(50% + 350px)';				
			}
			$('.viewlucker[index="'+index +'"]').css('display', 'none');
			ele.addClass('outPutUser').css('left', leftPos)
			ele.find('img').attr('src', obj.userData.src);
			ele.find('span').html(obj.userData.name);

			obj.userData.prizeLevel = peizeConfig.prizeLevel;
			$.post('/rest/activity/addDrawRecord?openid=' + obj.userData.uuid + '&drawId=' + obj.userData.prizeLevel).success(function(res) {
				updateRecord();				
			});					
			prizeSet[index] = null;
			for (var key in prizeSet) {
				if (prizeSet[key]) {
					return;
				}
			}
			$('#start').css('display', 'inline-block');
			prizeSet = [];
			
		}, 1000);
		
	}
	
	function preViewPicture(obj, index) {
		if (obj.userData.isUsed) return;
		var viewPicture = $('.viewlucker[index="'+index +'"]');
		viewPicture.find('.lucker-img-container').css('left', '0px');	
		viewPicture.css('display', 'block');
		viewPicture.find('.lucker-img-container').html('<img style="width:200px;height:300px" src="' + obj.userData.src +'">');
	}
	$('.closeImg').each(function(i, ele) {
		$(ele).click(function() {
			 $('#marker').css('display', 'none');
			 $('.lucker-container[index="' + i +'"]').removeClass('outPutUser');
			targets.helix.sort(randomsort);
			transform(targets.helix,2000);
		});
	});
	
	
	 function randomsort(a, b) {
		    return Math.random()>.5 ? -1 : 1;
		    //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
	}
	 
	 function getPrizeNum(drawList, luckerSet) {
		 var rankings = {};
		 drawList.forEach(function(item) {
			 rankings[item.ranking] = 0;
		 });
		 
		 luckerSet.forEach(function(item) {
			 rankings[item.ranking]++;
		 });
		 return rankings;
	 }

	 function updateRecord(callback, init) {
		$.get('/rest/activity/listDrawRecord').success(function(data) { //获取中奖名单记录
			luckerSet = data;		
			var str = '<div style="text-align:center;font-size:25px;">中奖名单</div><br/>'
			luckerSet.forEach(function(item) {
				str += '<span>' +  item.realname + '  ' + item.ranking +  '  奖品:' + item.prize + '</span><span id="' + item.id +'"userid="'+item.openid+ '" class="remove-btn" title="删除">X</span><br/>'
			});
			$('#luckerList').html(str);
			if (!init) {
				var rankings = getPrizeNum(drawSet, luckerSet);
				for (var key in rankings) {
					$('#' + key).text(rankings[key]);
				}
			}			
			$('.remove-btn').each(function(i, ele) {			 
				$(ele).click(function() {
					if (confirm('确定要删除吗?')) {
						$.post('/rest/activity/deleteDrawRecord?drawRecordId=' + $(ele).attr('id')).success(function() {
							updateRecord();
							var user = getObjByKeyInArr(signSet, $(ele).attr('userid'), 'uuid');
							if (user) {								
								user.userData.isUsed = false;
								wrapper.add(user);
								render();
								user = getObjByKeyInArr(objects, $(ele).attr('userid'), 'uuid');
								user && (user.userData.isUsed = false);
								user = getObjByKeyInArr(targets.helix, $(ele).attr('userid'), 'uuid');
								user&&(user.userData.isUsed = false);
							}
							
						});
					}
				});				
			});
			callback&&callback();
		});
		
	}

	function setWebsocket() {
		var websocket = null;
	    //判断当前浏览器是否支持WebSocket
	    if ('WebSocket' in window) {
	        websocket = new WebSocket(wsUrl);
	    }
	    else {
	        alert('Not support websocket')
	    }
	    //连接发生错误的回调方法
	    websocket.onerror = function () {
	       
	    };
	    //连接成功建立的回调方法
	    websocket.onopen = function (event) {
	       
	    };

	    //接收到消息的回调方法
	    websocket.onmessage = function (event) {    
	       event = eval('(' + event.data + ')');
	       if (event.type == 'barrage' && $('#barrage').attr('isshow')) { //普通弹幕消息
	    	   sendMsg(event.data);
	       } else if (event.type == 'sign') { //签到消息
	    	   var user = event.data;
	    	   sign({
				uuid: user['openid'],
				src: user['headimgurl'],
				name: user['realname'] || user['nickname'],
				dept: user['depart'] || user['city'],
				isUsed: getObjByKeyInArr1(luckerSet, user['openid'], 'openid') ? true : false
			});	
	    	   sendMsg((user['realname'] || user['nickname']) + '签到+');
	       }	       
	    };

	    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
	    window.onbeforeunload = function () {
	        websocket.close();
	    };

	}
	
	function sendMsg(msg) {  //发送弹幕消息
		 var div = document.createElement('div');
	       var width = $(window).width();
	       var colors = ['#d3ea16', '#f52222', '#d42dbf', '#00ffffbf', '#d3ea16'];
	       div.innerHTML = msg;
	       $(div).addClass('signTip');
	       $(div).css('left', Math.random() * (width-400) + 200 + 'px' ).css('color', colors[Math.round(Math.random() * 4)]);
	       $('#main-content').append($(div));
	       setTimeout(function() {
	    	   $(div).remove();
	       }, 10*1000);
	}
	
	
	function sign(user) { //签到
		var uu = getObjByKeyInArr(objects, user.uuid, 'uuid');
		if (uu) {
			uu.src = user.src;
			uu.uuid = user.uuid;
			uu.name = user.name;
			uu.dept = user.dept;
			uu.isUsed= user.isUsed;
			$(uu.element).find('img').attr('src',  user.src).css('display', 'inline-block');
			$(uu.element).find('.details').html(user.name + '<br>' + user.dept);		
		} else {
			var len = objects.length;			
			while (user) {
				var random = Math.floor(Math.random()*len);
				if (objects[random]&& !objects[random].userData.uuid) {
					objects[random].userData.src = user.src;
					objects[random].userData.uuid = user.uuid;
					objects[random].userData.name = user.name;
					objects[random].userData.dept = user.dept;
					objects[random].userData.isUsed= user.isUsed;
					$(objects[random].element).find('img').attr('src',  user.src).css('display', 'inline-block');
					$(objects[random].element).find('.details').html(user.name + '<br>' + user.dept).addClass('opacityImg');		
					signSet.push(objects[random]);	
					$('#signNumCount').text('签到人数：' + signSet.length);
					break;
				} 
			}
		}	
			
	}
	
	function setStore(key) {

		key = key || 'signSet';
		if (key == 'signSet') {
			var store = signSet.map(function(user) {
				return user.userData;
			});		
			localStorage.setItem('signSet', JSON.stringify(store));
		}
		else localStorage.setItem('luckerSet', JSON.stringify(luckerSet));
	}

	function getStore(key) {
		key = key || 'signSet';
		return JSON.parse(localStorage.getItem(key));
	}
	
	function deleteObjByKeyInArr(arr, value) {
		
		for (var len = arr.length, i = len - 1; i >= 0; i--)		            
            		if (arr[i]['userData']['id'] == value) {
            		arr[i]['userData']['isUsed'] = true;
            		return true;
            	}
        	return false;
	}

	function getObjByKeyInArr(arr, value, key) {
		key = key || 'id';
		for (var len = arr.length, i = len - 1; i >= 0; i--) {			  
			  if (arr[i]['userData'][key] == value) {		            	
	            		return arr[i];
	       	 }
		}	          
       	return false;
	}
	
	function getObjByKeyInArr1(arr, value, key) {
		key = key || 'id';
		for (var len = arr.length, i = len - 1; i >= 0; i--) {			  
			  if (arr[i][key] == value) {		            	
	            		return arr[i];
	       	 }
		}	          
       	return false;
	}



	function init() {
		//初始化对象集合属性
		var table = [];
		for (var index = 0; index < 300; index++) {
			table.push({
				id: '$$' + index,
				src: '',
				name: '',
				dept: '',
				yindex: (index % 10) + 1 ,
				xindex: Math.floor(index / 10) + 1
			});
		}
		//分别生成 table/grid/sphere/helix空间位置的对象集合
		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.z = 3000;
		scene = new THREE.Scene();
		// table
		for ( var i = 0; i < table.length; i ++ ) {
			var element = document.createElement( 'div' );
			element.className = 'element';
			element.style.backgroundColor = 'rgba(225,225,225,0.25)';

			var number = document.createElement( 'div' );
			number.className = 'number';
			number.textContent = i + 1;
			element.appendChild( number );

			var symbol = document.createElement( 'div' );
			symbol.className = 'symbol';
			symbol.innerHTML = '<img style="width:130px;height: 180px;" src="' + table[ i ].src + '">';  //卡片主体内容
			element.appendChild( symbol );

			var details = document.createElement( 'div' );
			details.className = 'details';
			details.innerHTML = table[ i ].name + '<br>' + table[ i ].dept; //卡片次要内容
			element.appendChild( details );

			var object = new THREE.CSS3DObject( element );
			object.userData =  table[ i ];
			object.position.x = Math.random() * 8000 - 4000;
			object.position.y = Math.random() * 8000 - 4000;
			object.position.z = Math.random() * 8000 - 4000;
			objects.push( object );
			var object = new THREE.Object3D();
			object.userData.id = table[ i ].id;
			object.position.x = ( table[ i] .xindex* 120 ) - 1330;
			object.position.y = - ( table[ i ].yindex * 180 ) + 990;
			targets.table.push( object );
		}

		// sphere
		var vector = new THREE.Vector3();
		var spherical = new THREE.Spherical();

		for ( var i = 0, l = objects.length; i < l; i ++ ) {
			var phi = Math.acos( -1 + ( 2 * i ) / l );
			var theta = Math.sqrt( l * Math.PI ) * phi;
			var object = new THREE.Object3D();
			object.userData.id = objects[ i ].userData.id;
			spherical.set( 800, phi, theta );
			object.position.setFromSpherical( spherical );
			vector.copy( object.position ).multiplyScalar( 2 );
			object.lookAt( vector );
			targets.sphere.push( object );

		}

		// helix
		var vector = new THREE.Vector3();
		var cylindrical = new THREE.Cylindrical();

		for ( var i = 0, l = objects.length; i < l; i ++ ) {
			var theta = i * 0.125 + Math.PI;
			var y = - ( i * 5 ) + 600;
			var object = new THREE.Object3D();
			cylindrical.set( 1200, theta, y );
			object.userData.id = objects[ i ].userData.id;
			object.position.setFromCylindrical( cylindrical );
			vector.x = object.position.x * 2;
			vector.y = object.position.y;
			vector.z = object.position.z * 2;
			object.lookAt( vector );
			targets.helix.push( object );
		}

		// grid
		for ( var i = 0; i < objects.length; i ++ ) {

			var object = new THREE.Object3D();
			object.userData.id = objects[ i ].userData.id;
			object.position.x = ( ( i % 5 ) * 400 ) - 800;
			object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
			object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;
			targets.grid.push( object );
		}

		renderer = new THREE.CSS3DRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.domElement.style.position = 'absolute';
		document.getElementById( 'container' ).appendChild( renderer.domElement );

		controls = new THREE.TrackballControls( camera, renderer.domElement );
		controls.rotateSpeed = 0.5;
		controls.minDistance = 500;
		controls.maxDistance = 6000;
		controls.addEventListener( 'change', render );
	}

	function bindEvent() { //给按钮绑定事件
		$('#start').click(function() {
			if (!peizeConfig.prizeLevel) {
				alert('请选择要抽取的奖项！');
				return;
			}
			for (var i = 0; i < signSet.length; i++) {
				if (!signSet[i].userData.isUsed) {
					if (peizeConfig.prizeNum > 4) {
						alert('最多同时抽取4个');
						return;
					}
					if (signSet.length - luckerSet.length < peizeConfig.prizeNum) {
						alert('剩余人数不足！');
						return;
					}
					startAllLoop(peizeConfig.prizeNum);
					break;
				}
			}		
		});

		$('#select').click(function() { //启动抽奖
			stopLoop();
		})
	
		$('#stop').click(function() { //抽奖停止
			peizeConfig.pause = !peizeConfig.pause;
		})
		
		$('#prizeNum-input').change(function() { //设置同时抽取数目
			peizeConfig.prizeNum =  parseInt($('#prizeNum-input').val());	
		})
		
		$('#increase').click(function() { //增大3d墙转速
			if (peizeConfig.rotateSpeed < 0.1) {
				peizeConfig.rotateSpeed+=0.002;
			}
		})

		$('#discrease').click(function() {//降低3d墙转速
			if (peizeConfig.rotateSpeed > -0.1) {
				peizeConfig.rotateSpeed-=0.002;
			}
		})

		$('#config').click(function() {  //打开设置面板
			if ($('#setting').attr('isshow')) {
				$('#setting').css('left', '-600px').attr('isshow', '');
				$('#config').css('backgroundColor', 'transparent').css('color', '#f52222');
			} else {
				$('#setting').css('left', '10px').attr('isshow', true);
				$('#config').css('backgroundColor', '#f52222').css('color', '#fff');
			}
		})	

		$('#auto').click(function() { //是否开启自动抽奖
			if (prizeSet.length) return;
			peizeConfig.isAuto = !peizeConfig.isAuto;
			peizeConfig.isAuto ? $('#auto').css('backgroundColor', '#f52222').css('color', '#fff') : $('#auto').css('backgroundColor', 'transparent').css('color', '#f52222');
			peizeConfig.isAuto ? $('#select').css('display', 'none'):'';
		})

		$('#list').click(function() {  //打开中奖名单
			if ($('#luckerList').attr('isshow')) {
				$('#luckerList').css('right', '-600px').attr('isshow', '');
				$('#list').css('backgroundColor', 'transparent').css('color', '#f52222');
			} else {
				$('#luckerList').css('right', '10px').attr('isshow', true);
				$('#list').css('backgroundColor', '#f52222').css('color', '#fff');
			}
		})

		window.addEventListener( 'resize', onWindowResize, false );
	}


	function move() {
		if (!peizeConfig.pause) {
      			wrapper.rotation.y += peizeConfig.rotateSpeed;
      			render();
		}	
	}

	function changePivot(x,y,z,objs){
	   	var wrapper = new THREE.Object3D();
        	wrapper.position.set(x,y,z);
        	objs.forEach(function(obj) {
        	if (obj.userData.isUsed) return;
        	wrapper.add(obj);
        	obj.position.set(-x,-y,-z);
        	});		        
        	return wrapper;
	}

	function transform( targets, duration ) { //变换3d照片墙的空间位置形式
		TWEEN.removeAll();
		for ( var i = 0; i < objects.length; i ++ ) {

			var object = objects[ i ];
			var target = targets[ i ];

			new TWEEN.Tween( object.position )
				.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();

			new TWEEN.Tween( object.rotation )
				.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();
		}

		new TWEEN.Tween( this )
			.to( {}, duration * 2 )
			.onUpdate( render )
			.start();

	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
		render();
	}

	function animate() {  //运动循环
		requestAnimationFrame( animate );
		move();	 //转动3d对象
		moveUserImg&&moveUserImg(); //执行抽奖循环
		TWEEN.update();
		controls.update();
	}

	function render() {
		renderer.render( scene, camera );
	}
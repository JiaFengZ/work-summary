(function (GAME) {
	var utils = {
		getItemInArr: getItemInArr,
		deleteItemInArr: deleteItemInArr,
		getObjInArr: getObjInArr,
		deleteObjInArr: deleteObjInArr,
		inheritPrototype: inheritPrototype,
		isCrash: isCrash
	};
	GAME.utils = utils;

	function getItemInArr(arr, value) {
		for (var i = 0, len = arr.length; i < len; i++) {
			if (arr[i] == value) {
				return arr[i];
			}
		}
		return null;
	}

	function deleteItemInArr(arr, value) {
		for (var i = 0, len = arr.length; i < len; i++) {
			if (arr[i] == value) {
				arr.splice(i, 1);
				return true;
			}
		}
		return false;
	}	

	function getObjInArr(arr, key, value) {
		for (var i = 0, len = arr.length; i < len; i++) {
			if (arr[i][key] == value) {
				return arr[i];
			}
		}
		return null;
	}

	function deleteObjInArr(arr, key, value) {
		for (var i = 0, len = arr.length; i < len; i++) {
			if (arr[i][key] == value) {
				arr.splice(i, 1);
				return;
			}
		}	
	}
	
	function inheritPrototype(subType, superType){
	    var proto = Object.create(superType.prototype);
	    proto.constructor = subType;
	    subType.prototype = proto;
	    return proto;
	}

	function isCrash(targetA, targetB) {	
		if (!(targetB.x + targetB.width < targetA.x) &&
	    !(targetA.x + targetA.width < targetB.x) &&
	    !(targetB.y + targetB.height < targetA.y) &&
	    !(targetA.y + targetA.height < targetB.y)) {
	    	return true;
		}
		return false;
	}
})(window.$GAME)
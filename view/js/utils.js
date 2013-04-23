var Utils = (function() {
	
	function getMonthStr(monthNum) {
		switch(monthNum) {
			case  0: return "Jan"; break;
			case  1: return "Feb"; break;
			case  2: return "Mar"; break;
			case  3: return "Apr"; break;
			case  4: return "May"; break;
			case  5: return "Jun"; break;
			case  6: return "Jul"; break;
			case  7: return "Aug"; break;
			case  8: return "Sep"; break;
			case  9: return "Oct"; break;
			case 10: return "Nov"; break;
			case 11: return "Dec"; break;
		}
	}
	function displayDataTD(value) {
		var s = value;
        s = value.replace(/\\\\/g,'\\');
        s = s.replace(/\\'/g,'\'');
        s = s.replace(/\\"/g,'"');
        return s;
	}
	return {
		getMonthStr: getMonthStr, displayDataTD: displayDataTD
	};
})()
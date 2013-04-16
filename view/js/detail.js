var Detail = (function() {

	function init(div) {
		this.div = div;
	}
	function getDetail(data) {
		$(this.div).text(data.toString());
	}
	return {
		init: init,
		getDetail: getDetail
	};
})()
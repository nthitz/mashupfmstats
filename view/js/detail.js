var Detail = (function() {
	var div;
	var songInited;
	var djInited;
	function init(_div) {
		div = _div[0];
		songInited = false;
		djInited = false;
	}
	function getDetail(data) {
		var value = null;
		var key = null;
		_.each(data,function(val,k, list) {
			value = val;
			key = k;
		},this);
		var historyRequest = MashupViz.jsonPath + "history.json.php?key=" + key + "&value=" + value;
		console.log(historyRequest);
		d3.json(historyRequest, historyLoaded);
	}
	function historyLoaded(err, data) {
		if(err !== null) {
			console.log(err);
			console.log(data);
			return;
		}
		console.log(data);
		switch(data.key) {
			case 'songid':
				return songHistory(data);
			break;
			case 'djid':
				return djHistory(data);
			break;
		}
	}
	function initSong() {

		var songDiv = d3.select(div).append('div').attr('class','container song');
		this.songDiv = songDiv;
		songInfo = songDiv.append('div').attr('class','songInfo row-fluid');
		var historyGraphDiv = songDiv.append('div').attr('class','historyGraph');
		HistoryGraph.init(historyGraphDiv);
	}
	function songHistory(data) {
		if(!this.songInited) {
			initSong();
			this.songInited = true;
		}
		var songInfoData = [
			{lbl: 'title', value: data.song.title},
			{lbl: 'artist', value: data.song.artist},
			//lbl: 'album', value: data.song.album},
			{lbl: 'length', value: data.song.length}
		]
		var infoPieces = this.songDiv.select('.songInfo').selectAll('.infoPiece').data(songInfoData)
			.enter().append('div');
		infoPieces.attr('class',function(d,i) {
			var spanCount = 6;
			if(d.lbl === 'length') {
				spanCount = 1;
			} else if(d.lbl === 'artist') {
				spanCount = 5;
			}
			return 'infoPiece span' + spanCount;
		}).html(function(d) {
			var text = d.lbl + '<br />' +d.value;
			if(d.lbl === 'length') {
				var min = Math.floor(d.value / 60);
				var sec = d.value % 60;
				if(sec < 10) {
					sec = "0" + sec;
				}
				text = '<br/>'+(min+ ":" +sec);
			}
			return text;

		})
		HistoryGraph.loadGraph(data);
	}
	function initDj() {
		this.djDiv = d3.select(this.div).append('div').attr('class','dj');
	}
	function djHistory(data) {
		if(!this.djInited) {
			this.djInited = true;
			initDj();
		}
	}
	return {
		init: init,
		getDetail: getDetail
	};
})()
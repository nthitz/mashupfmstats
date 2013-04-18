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
			var spanCount = 4;
			if(d.lbl == 'album') {
				spanCount = 3;
			} else if(d.lbl === 'length') {
				spanCount = 1;
			}
			return 'infoPiece span' + spanCount;
		}).html(function(d) {
			return d.lbl + '<br />' + d.value;
		})
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
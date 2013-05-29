var Detail = (function() {
	var div;
	var songInited;
	var djInited;
	var metadataDiv;
	function init(_div) {
		div = _div[0];
		songInited = false;
		djInited = false;
		metadataDiv = d3.select(div).append('div').attr('class','metadata row-fluid');

		var historyGraphDiv = d3.select(div).append('div').attr('class','historyGraph');
		HistoryGraph.init(historyGraphDiv,this);
	}
	function fadeOut() {
		console.log('fadeout');
		d3.select(div).style('opacity','0.2');
	}
	function fadeIn() {
		console.log('fadein');
		d3.select(div).style('opacity','1');
		
	}
	function getDetail(data) {
		var value = null;
		var key = null;
		_.each(data,function(val,k, list) {
			value = val;
			key = k;
		},this);
		var url = MashupViz.path + 'detail/'+key+'/'+value;
        ga('send', 'pageview', url);
		
		History.pushState({view: 'detail', detailData:data},'detail', url);
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
			case 'songId':
				songHistory(data);
			break;
			case 'djid':
				djHistory(data);
			break;
		}

		fadeIn();
	}
	function initSong() {
	}
	function initMetaDataTable() {

	}
	function metaDataTable(metaDataInfo) {
		console.log(metaDataInfo);
		var infoPieces = metadataDiv.selectAll('.infoPiece').data(metaDataInfo);
		infoPieces.enter().append('div');
		infoPieces.exit().remove();
		infoPieces.attr('class',function(d,i) {
			var spanCount = 6;
			if(d.lbl === 'length') {
				spanCount = 1;
			} else if(d.lbl === 'artist') {
				spanCount = 5;
			}
			return 'infoPiece span' + spanCount;
		}).html(function(d) {
			var text = '<div class="lbl">' + d.lbl + '</div><div class="value">' + d.value + "</div>";
			if(d.lbl === 'length') {
				var min = Math.floor(d.value / 60);
				var sec = d.value % 60;
				if(sec < 10) {
					sec = "0" + sec;
				}
				text = '<div class="lbl">&nbsp;</div><div class="value">'+(min+ ":" +sec)+"</div>";
			}
			return text;

		})
	}
	function nullSongHistory(data) {

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
		];
		metaDataTable(songInfoData)
		HistoryGraph.loadGraph(data);
		HistoryGraph.table('song');
	}
	function resize() {
		HistoryGraph.resize();
	}
	function initDj() {
		this.djDiv = d3.select(this.div).append('div').attr('class','dj');
	}
	function djHistory(data) {
		if(!this.djInited) {
			this.djInited = true;
			initDj();
		}
		console.log(data);
		metaDataTable([{lbl: 'dj', value: data.plays[0].djname}]);
		HistoryGraph.loadGraph(data);
		HistoryGraph.table('dj');
	}
	return {
		init: init,
		getDetail: getDetail,
		resize: resize,
		fadeIn: fadeIn, fadeOut:fadeOut
	};
})()
var HistoryGraph = (function() {
	var div;
	var svg;
	var height = 200;
	var width;
	var padding = {left:10, right: 10, top:15, bottom:15};
	var playsData;
	var minTime, maxTime;
	var buckets;
	var bucketTimeSize = 60 * 60 * 24 * 7;
	var timeXScale;
	var valueYScale;
	var maxPlays;
	function init(_div) {
		div = _div;
		svg = div.append('div').attr('class','row-fluid')
			.append('div').attr('class','span12')
			.append('svg').style('width','100%').style('height','200px');
		svg.append('g').attr('class','bars');
		
	}
	function getBucketIndex(time) {
		return bucketIndex = Math.floor((time - minTime) / (maxTime - minTime) * (maxTime - minTime) / bucketTimeSize);
	}
	function initBuckets(timeSize) {
		buckets = [];
		for(var time = minTime; time < maxTime; time += timeSize) {
			var bucket = {
				index : buckets.length,
				numPlays:0,
				minTime: time,
				maxTime: time + timeSize
			}
			buckets.push(bucket);
		}
	}
	function loadGraph(data) {
		width = $(div[0]).width();
		console.log('width ' + width);
		playsData = data.plays;
		minTime = data.times.min;
		maxTime = data.times.max;
		maxPlays = 0;
		initBuckets(bucketTimeSize);
		_.each(buckets,function(bucket) {
			bucket.numPlays = 0;
		})
		_.each(playsData,function(play,i) {
			var bucketIndex = getBucketIndex(play.startTime);
			buckets[bucketIndex].numPlays ++;
		})
		_.each(buckets,function(bucket) {
			if(bucket.numPlays > maxPlays) {
				maxPlays = bucket.numPlays;
			}
		})
		var graphWidth = width - padding.left - padding.right;
		var barWidth = Math.floor(graphWidth / buckets.length);
		timeXScale = d3.scale.linear().domain([minTime, maxTime]).range([0, graphWidth]);
		var indexXScale = d3.scale.linear().domain([0,buckets.length]).range([0,graphWidth]);
		valueYScale = d3.scale.linear().domain([0,maxPlays]).range([0,height - padding.top- padding.bottom]);
		var bars = svg.select('.bars').selectAll('.bar').data(buckets);
		bars.enter().append('rect');
		bars.attr('class','bar')
			.attr('x',function(d,i) {
				return padding.left + indexXScale(i);
			}).attr('height',function(d) {
				var height = valueYScale(d.numPlays);
				d.height = height;
				return d.height != 0 ? d.height : 1;
			}).attr('y',function(d) {
				return height - padding.bottom - d.height;
			}).attr('width',barWidth-1);
		var barLbls = svg.select('.bars').selectAll('.barLbl').data(buckets);
		barLbls.enter().append('text');
		barLbls.attr('class','barLbl')
			.attr('x',function(d,i) {
				return padding.left + indexXScale(i) + barWidth / 2.0;
			}).attr("y",function(d,i) {
				return height - padding.bottom - d.height - 2;
			}).attr('text-anchor','middle').text(function(d) {
				if(d.numPlays == 0) {
					return '';
				}
				return d.numPlays;
			})

		var numDateLabels = 4;
		var dateLabels = [];
		var dateDiff = maxTime - minTime;
		for(var i = 0; i <= buckets.length; i+= buckets.length / numDateLabels) {
			var index = Math.round(i);
			if(index >= buckets.length) {
				index = buckets.length - 1;
			}
			var lbl = buckets[index];
			dateLabels.push(lbl);
		}
		var timeLabels = svg.selectAll('.timeLabel').data(dateLabels);
		timeLabels.enter().append('text');
		timeLabels.attr('class','timeLabel')
			.attr('x',function(d,i) {
				var offset = barWidth / 2.0;
				if(i == 0) {
					offset = 0;
				} else if(i == dateLabels.length-1) {
					offset = barWidth;
				}
				return padding.left + indexXScale(d.index) + offset; 
			}).attr('y',height - padding.bottom + 11).text(function(d,i) {
				var displayTime = (d.minTime + d.maxTime) / 2;
				if(i == 0) {
					displayTime = d.minTime;
				} else if(i == dateLabels.length - 1) {
					displayTime = d.minTime;
				}
				var centerDate = new Date(displayTime*1000);
				var month = centerDate.getMonth();
				var day = centerDate.getDate();
				var year = centerDate.getFullYear();
				month = Utils.getMonthStr(month);
				return month + ". " + day +", " + year;
			}).attr('text-anchor',function(d,i) {
				if(i == 0) {
					return 'start';
				} else if(i == dateLabels.length-1) {
					return 'end';
				} else {
					return 'middle';
				}
			}) 
	}
	
	return {
		init: init, loadGraph: loadGraph
	};
})()
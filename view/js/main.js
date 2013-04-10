(function() {
	var jsonPath = "../json/";
	var queryVarsUrl = jsonPath + "vars.json";
	var timePeriodSelect;
	var orderSelect;
	var sorts;
	var timePeriods;
	function loadQueryVars(err, queryVars) {
		console.log(err);
		console.log(queryVars);
		sorts = queryVars.sorts;
		timePeriods =  queryVars.times;
		_.each(sorts,function(d,i) {
			console.log(d);
			if(typeof d['var'] === 'undefined') {
				d['var'] = d.lbl;
			}
			if(typeof d.type !== 'undefined' && d.type === 'count') {
				d['var'] = 'count';
			}
		})

		var timeOptions = timePeriodSelect.selectAll('option').data(timePeriods);
		timeOptions.enter().append('option');
		timeOptions.text(function(d) {
			return d.lbl;
		}).attr('value',function(d) {
			return d['time'];
		})
		$('.timePeriod').on('change',makeRequest);
		var orderOptions = orderSelect.selectAll('option').data(sorts);
		orderOptions.enter().append('option');
		orderOptions.text(function(d) {
			return d.lbl
		}).attr('value',function(d) {
			return d['var'];
		})
		$('.order').on('change',makeRequest);
		makeRequest();
	}
	function makeRequest() {
		var dataPath = jsonPath + "data.json.php?";
		dataPath += "time=" + $('.timePeriod').val() + "&";
		dataPath += "order=" + $(".order").val();
		console.log(dataPath);
		d3.json(dataPath, getData);
	}
	function getData(err, data) {
		console.log(data);
	}
	function init() {
		var controls = d3.select('.wrapper').append('div').attr('class','controls');
		controls.append('span').text('View top 50 songs from ');
		timePeriodSelect = controls.append('select').attr('class','timePeriod');
		controls.append('span').text(' ordered by ');
		orderSelect = controls.append('select').attr('class','order');
		d3.select('.wrapper').append('table').attr('class','results');

		d3.json(queryVarsUrl,loadQueryVars);
	}
	init();
})()

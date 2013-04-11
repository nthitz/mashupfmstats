(function() {
	var jsonPath = "../json/";
	var queryVarsUrl = jsonPath + "vars.json";
	var timePeriodSelect;
	var orderSelect;
	var orderingSelect;
	var sorts;
	var timePeriods;
	var orderings;
	function loadQueryVars(err, queryVars) {
		console.log(err);
		console.log(queryVars);
		sorts = queryVars.sorts;
		timePeriods =  queryVars.times;
		orderings = queryVars.ordering;
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
		var orderingOptions = orderingSelect.selectAll('option').data(orderings);
		orderingOptions.enter().append('option');
		orderingOptions.text(function(d) {
			return d.lbl;
		}).attr('value',function(d) {
			 return d.lbl;
		})
		$('.ordering').on('change',makeRequest);
		makeRequest();
	}
	function makeRequest() {
		var dataPath = jsonPath + "data.json.php?";
		dataPath += "time=" + $('.timePeriod').val() + "&";
		dataPath += "order=" + $(".order").val() + "&";
		dataPath += "ordering=" + $('.ordering').val()	
		console.log('request data '+dataPath);
		d3.json(dataPath, getData);
	}
	function getData(err, data) {
		console.log('rtn');
		var rows = [
			{name: "title"},
			{name: "artist"},
			{name: $('.order').val(), "var": 'cnt'}
		];
		_.each(rows,function(d) {
			if(typeof d['var'] === 'undefined') {
				d['var'] = d.name;
			}
		});
		console.log(rows);
		
		console.log(data);

		var trs = d3.select('.results').selectAll('tr').data(data);
		trs.enter().append('tr');
		trs.html(function(d) {
			var tds = '';
			_.each(rows,function(row) {
				tds += '<td>' + d[row['var']] + '</td>';
			})
			return tds;

		})

	}
	function init() {
		var controls = d3.select('.wrapper').append('div').attr('class','controls');
		controls.append('span').text('View ');
		orderingSelect = controls.append('select').attr('class','ordering');
		controls.append('span').text(' 50 songs from ');
		timePeriodSelect = controls.append('select').attr('class','timePeriod');
		controls.append('span').text(' ordered by ');
		orderSelect = controls.append('select').attr('class','order');
		d3.select('.wrapper').append('table').attr('class','results');

		d3.json(queryVarsUrl,loadQueryVars);
	}
	init();
})()

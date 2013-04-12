(function() {
	var jsonPath = "../json/";
	var queryVarsUrl = jsonPath + "vars.json";
	var timePeriodSelect;
	var orderSelect;
	var orderingSelect;
	var viewSelect;
	var sorts;
	var timePeriods;
	var orderings;
	var views;
	function loadQueryVars(err, queryVars) {
		console.log(err);
		console.log(queryVars);
		sorts = queryVars.sorts;
		timePeriods =  queryVars.times;
		orderings = queryVars.ordering;
		views = queryVars.views;
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
		var viewsOptions = viewSelect.selectAll('option').data(views);
		viewsOptions.enter().append('option');
		viewsOptions.text(function(d) {
			return d.lbl;
		}).attr('value',function(d) {
			return d.lbl;
		})
		$('.views').on('change',makeRequest);
		makeRequest();
	}
	function makeRequest() {
		var dataPath = jsonPath + "data.json.php?";
		dataPath += "time=" + $('.timePeriod').val() + "&";
		dataPath += "order=" + $(".order").val() + "&";
		dataPath += "ordering=" + $('.ordering').val() + "&";
		dataPath += "view=" + $('.views').val();
		console.log('request data '+dataPath);
		d3.json(dataPath, getData);
	}
	function getData(err, data) {
		console.log('rtn');
		var rows;
		if($('.views').val() == 'songs') {
			rows = [
				{name: "title"},
				{name: "artist"},
				{name: $('.order').val(), "var": 'cnt'}
			];
		} else if($('.views').val() == 'users') {
			rows = [
				{name: "djname"},
				{name: $('.order').val(), "var": 'cnt'}
			]

		}
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
				tds += '<td>' + displayDataTD(d[row['var']]) + '</td>';
			})
			return tds;

		})

	}
	function displayDataTD(value) {
		var s = value.replace(/\\\\/g,'\\');
		s = s.replace(/\\'/g,'\'');
		return s;
	}
	function init() {
		var controls = d3.select('.wrapper').append('div').attr('class','controls');
		controls.append('span').text('View ');
		orderingSelect = controls.append('select').attr('class','ordering');
		controls.append('span').text(' 50 ');
		viewSelect = controls.append('select').attr('class','views');
		controls.append('span').text(' from ');
		timePeriodSelect = controls.append('select').attr('class','timePeriod');
		controls.append('span').text(' ordered by ');
		orderSelect = controls.append('select').attr('class','order');
		d3.select('.wrapper').append('table').attr('class','results');

		d3.json(queryVarsUrl,loadQueryVars);
	}
	init();
})()

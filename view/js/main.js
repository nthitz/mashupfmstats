(function() {
    var jsonPath = "../json/";
    var queryVarsUrl = jsonPath + "vars.json";
    var timePeriodSelect;
    var orderSelect;
    var orderingButtonGroup;
    var orderingHidden;
    var viewButtonGroup;
    var viewHidden;
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
        
        var orderingButtons = orderingButtonGroup.selectAll('button').data(orderings);
        orderingButtons.enter().append('button').attr('type','button').attr('class','btn')
            .attr('value',function(d) {
                return d.lbl;
            }).text(function(d) {
                return d.lbl;
            }).attr('data-toggle','button');
        orderingHidden.attr('value',orderings[0].lbl)
        $(orderingHidden[0]).on('change', makeRequest);
        var viewButtons = viewButtonGroup.selectAll('button').data(views);
        viewButtons.enter().append('button').attr('type','button').attr('class','btn')
            .attr('value',function(d) {
                return d.lbl;
            }).text(function(d) {
                return d.lbl;
            });
        viewHidden.attr('value',views[0].lbl);
        $(viewHidden[0]).on('change',makeRequest);

        bootstrapRadioButtons();
        makeRequest();
    }
    function makeRequest() {
        var dataPath = jsonPath + "data.json.php?";
        dataPath += "time=" + $('.timePeriod').val() + "&";
        dataPath += "order=" + $(".order").val() + "&";
        dataPath += "ordering=" + $(orderingHidden[0]).val() + "&";
        dataPath += "view=" + $(viewHidden[0]).val();
        console.log('request data '+dataPath);
        d3.json(dataPath, getData);
    }
    function getData(err, data) {
        console.log('rtn');
        var rows;
        if($(viewHidden[0]).val() == 'songs') {
            rows = [
                {name: "title"},
                {name: "artist"},
                {name: $('.order').val(), "var": 'cnt'}
            ];
        } else if($(viewHidden[0]).val() == 'users') {
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
        _.each(data, function(result) {
            var resultArray = [];
            _.each(rows, function(row) {
                resultArray.push(result[row['var']]);
            })
            result.rows = resultArray;
        });
        console.log(rows);
        
        console.log(data);
        var header = d3.select('#topList table thead tr').selectAll('th').data(rows)
            .enter().append('th').text(function(d) {
                return d.name;
            })

        var trs = d3.select('.results').selectAll('tr').data(data);
        trs.enter().append('tr');
        trs.exit().remove();
        var tds = trs.selectAll('td').data(function(d) {
            return d.rows;
        })
        tds.enter().append('td');
        tds.exit().remove();
        tds.text(function(d) {
            return displayDataTD(d);
        })

    }
    function displayDataTD(value) {
        var s = value.replace(/\\\\/g,'\\');
        s = s.replace(/\\'/g,'\'');
        return s;
    }
    function init() {
        var wrapper = d3.select('#topList');
        var controls = wrapper.append('div').attr('class','controls');
        orderingButtonGroup = controls.append('div').attr('class','btn-group orderingBtns').attr('data-toggle','buttons-radio')
            .attr('data-toggle-name','ordering');
        viewButtonGroup = controls.append("div").attr('class','btn-group viewBtns').attr('data-toggle','buttons-radio')
            .attr('data-toggle-name','view');
        orderingHidden = controls.append('input').attr('type','hidden').attr('name','ordering');
        viewHidden = controls.append('input').attr('type','hidden').attr('name','view')
        controls.append('span').text(' from ');
        timePeriodSelect = controls.append('select').attr('class','timePeriod');
        controls.append('span').text(' ordered by ');
        orderSelect = controls.append('select').attr('class','order');
        var table = wrapper.append('table').attr('class','table table-striped table-condensed')
        table.append('thead').append('tr');
        table.append('tbody').attr('class','results');
        $('select').selectpicker();
        d3.json(queryVarsUrl,loadQueryVars);
    }
    function bootstrapRadioButtons() {
        jQuery(function($) {
          $('div.btn-group[data-toggle-name]').each(function(){
            var group   = $(this);
            var form    = group.parents('form').eq(0);
            var name    = group.attr('data-toggle-name');
            var hidden  = $('input[name="' + name + '"]');
            console.log(name);
            console.log(hidden.val());
            $('button', group).each(function(){
                var button = $(this);
                button.on('click', function(){
                    hidden.val($(this).val());
                    hidden.trigger('change');
                });
                console.log(button.attr('value'));
                if(button.val() == hidden.val()) {
                    button.addClass('active');
                } else {
                    button.removeClass('active');
                }
            });
          });
        });
    }
    init();
})()

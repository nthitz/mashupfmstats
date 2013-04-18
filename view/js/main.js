var MashupViz = (function() {
    var jsonPath = "../json/";
    var queryVarsUrl = jsonPath + "vars.json";
    var timePeriodNav;
    var orderSelect;
    var viewButtonGroup;
    var viewHidden;
    var sorts;
    var timePeriods;
    var orderings;
    var views;
    var barScale;
    var barsInited = false;
    var jsonData;
    var dataKeyRow;

    var dataRows;
    function loadQueryVars(err, queryVars) {
        console.log(err);
        console.log(queryVars);
        sorts = queryVars.sorts;
        timePeriods =  queryVars.times;
        orderings = queryVars.ordering;
        views = queryVars.views;
        _.each(sorts,function(d,i) {
            if(typeof d['var'] === 'undefined') {
                d['var'] = d.lbl;
            }
            if(typeof d.type !== 'undefined' && d.type === 'count') {
                d['var'] = 'count';
            }
        })

        var timeLIs = timePeriodNav.selectAll('li').data(timePeriods);
        timeLIs.enter().append('li').attr('class',function(d,i) {
            if(i == 0) {
                return 'active';
            }
        }).attr('data-time',function(d,i) {
            return d['time'];
        })
        timeLIs.on('click', timeSwitch);
        timeLIs.append('a').text(function(d) {
            return d.lbl;
        })
        var orderOptions = orderSelect.selectAll('option').data(sorts);
        orderOptions.enter().append('option');
        orderOptions.text(function(d) {
            return d.lbl
        }).attr('value',function(d) {
            return d['var'];
        })
        $('.order').on('change',makeRequest);
        
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
        $(window).resize(makeTable);
        makeRequest();
    }
    function timeSwitch() {
        $('.timeNav .active').removeClass('active');
        $(this).addClass('active');
        makeRequest();
    }
    function makeRequest() {
        var dataPath = jsonPath + "top.json.php?";
        dataPath += "time=" + $('.timeNav .active').data('time') + "&";
        dataPath += "order=" + $(".order").val() + "&";
        dataPath += "view=" + $(viewHidden[0]).val();
        console.log('request data '+dataPath);
        d3.json(dataPath, getData);
    }
    function getData(err, data) {
        if(err != null) {
            console.log(err);
            console.log(data);
            return;
        }
        jsonData = data;
        makeTable();
    }

    function makeTable() {
        var data = jsonData;
        var rows;
        if($(viewHidden[0]).val() == 'songs') {
            rows = [
                {sub: true, fields: [
                    {name: "title", key:'songid', span:4 },
                    {name: "artist", span:2 }
                ]},
                {name: $('.order').val(), "var": 'cnt', span:6}
            ];
        } else if($(viewHidden[0]).val() == 'users') {
            rows = [
                {sub: true, fields: [
                    {name: "djname", key:'djid', span:6}
                ]},
                {name: $('.order').val(), "var": 'cnt', span:6}
            ]

        }
        dataRows = rows;

        _.each(rows[0].fields,function(d) {
            if(typeof d['var'] === 'undefined') {
                d['var'] = d.name;

            }
            if(typeof d['key'] !== 'undefined') {
                dataKeyRow = d;
            }
        });
        var minCount = Number.MAX_VALUE;
        var maxCount = Number.MIN_VALUE;
        _.each(data, function(result) {
            var resultArray = [];
            _.each(rows[0].fields, function(row) {
                resultArray.push(result[row['var']]);
            })
            result.rows = resultArray;
            if(typeof +result['cnt'] != 'undefined') {
                if(+result['cnt'] < minCount) {
                    minCount = +result.cnt
                }
                if(+result.cnt > maxCount) {
                    maxCount = +result.cnt;
                }
            }
        });
        var headers = d3.select('.results .header').selectAll('.hSpan').data(rows);
        headers.enter().append('div');
        headers.attr('class',function(d,i) {
            var cl = "hSpan span";
            if(i == 0) {
                cl += 5 + " fields"
            } else if(i == 1) {
                cl += 7 + " count"
            }
            return cl;
        })
        var headerFieldContainer = d3.select('.results .header .fields')
                .selectAll('.row-fluid').data(function(d) { return [d] });
        headerFieldContainer.enter().append('div').attr('class','row-fluid');
        
        var headerFields = headerFieldContainer.selectAll('.hField').data(function(d) {
            return d.fields
        });
        headerFields.enter().append('div');
        headerFields.text(function(d) {
            return d.name;
        }).attr('class',function(d,i) {
            var span = 0;
            if(rows[0].fields.length == 1) {
                span = 12;
            } else if(rows[0].fields.length == 2) {
                span = i == 0 ? 8 : 4;
            }
            return 'hField span' + span;
        })
        headerFields.exit().remove();
        var maxWidth = $('.hSpan.count').width()
        barScale = d3.scale.linear().domain([minCount,maxCount]).range([30, maxWidth]);

        var dataRows = d3.select('.results').selectAll('.dataRow').data(data);
        dataRows.enter().append('div').attr('class','dataRow row-fluid');
        dataRows.exit().remove();
        var rowColumns = dataRows.selectAll('.span').data([0,1]).enter().append('div')
            .attr('class', function(d,i) {
                var cl = "span span";
                if(i == 0) {
                    cl += 5 + " fields"
                } else if(i == 1) {
                    cl += 7 + " count"
                }
                return cl;
            });
        dataRows.on('click', clickDataRow)
        var fieldContainer = dataRows.select('.fields').selectAll('.row-fluid').data(function(d) { return [d]; })
        fieldContainer.enter().append('div').attr('class','row-fluid');
        var fields = fieldContainer.selectAll('.field').data(function(d) {
            return d.rows;
        })
        fields.enter().append('div');
        fields.exit().remove();
        fields.attr('class',function(d,i) {
            var span = 0;
            if(rows[0].fields.length == 1) {
                span = 12;
            } else if(rows[0].fields.length == 2) {
                span = i == 0 ? 8 : 4;
            }
            return 'field span' + span;
        })
        fields.text(function(d,i) {
            
            return displayDataTD(d);
        })
        var bar = d3.select('.results').selectAll('.dataRow').selectAll('.count')
            .selectAll('.bar').data(function(d,i) { return [{d:data[i].cnt, i:i}]; })
        bar.enter().append('div').attr('class','bar').style('width',0);
        bar.text(function(d) {
            return +d.d;
        })

        bar.transition().duration(1000).style('width',function(d) {
            
            return barScale(d.d) + 'px';
        })
        $('#topList').height($('#topList').height())

    }
    function barDiv(d,i) {

        var barWidth = barScale(d);
        barWidth = 0;
        return '<div class="bar" style="width: ' + barWidth + '%;">' + d + '</div>';
    }
    function displayDataTD(value) {
        var s = value;
        s = value.replace(/\\\\/g,'\\');
        s = s.replace(/\\'/g,'\'');
        s = s.replace(/\\"/g,'"');
        return s;
    }
    function clickDataRow(d,i) {
        console.log(d);
        console.log(dataKeyRow)
        var detailQuery = {};
        detailQuery[dataKeyRow.key] = d[dataKeyRow.key];
        Detail.getDetail(detailQuery);
        gotoSecondary();
    }
    function gotoSecondary() {

        $('#topList').addClass('animated').height('1px');

        $('#containerWrap').addClass('secondary');
    }
    function init() {
        var wrapper = d3.select('#topList');
        var secondWrapper = d3.select('#secondary').text('hello');
        var controls = wrapper.append('div').attr('class','controls');
        viewButtonGroup = controls.append("div").attr('class','btn-group viewBtns').attr('data-toggle','buttons-radio')
            .attr('data-toggle-name','view');
        viewHidden = controls.append('input').attr('type','hidden').attr('name','view')
        controls.append('span').text(' ordered by ');
        orderSelect = controls.append('select').attr('class','order');
        
        timePeriodNav = controls.append('ul').attr('class','nav nav-tabs timeNav');


        var results = wrapper.append('div').attr('class','results');
        results.append('div').attr('class','row-fluid header')

        $('select').selectpicker();
        d3.json(queryVarsUrl,loadQueryVars);
        Detail.init($('#secondary').get())
    }
    function bootstrapRadioButtons() {
        jQuery(function($) {
          $('div.btn-group[data-toggle-name]').each(function(){
            var group   = $(this);
            var form    = group.parents('form').eq(0);
            var name    = group.attr('data-toggle-name');
            var hidden  = $('input[name="' + name + '"]');
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
    return {jsonPath: jsonPath}
})()

var MashupViz = (function() {
    var jsonPath = "/mashupcharts/json/";
    var path = "/mashupcharts/view/"
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
    var replaceState = true;
    var ignoreStateChange = false;
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
        var time = $('.timeNav .active').data('time');
        var ordering = $(".order").val();
        var view = $(viewHidden[0]).val();
        dataPath += "time=" + time + "&";
        dataPath += "order=" + ordering + "&";
        dataPath += "view=" + view;
        console.log('request data '+dataPath)
        var nextState = History.pushState;
        if(replaceState) {
            replaceState = false;
            nextState = History.replaceState;
            console.log('replace');
            ignoreStateChange = true;
        }
        nextState({time: time, ordering: ordering, view: view}, "View " + view, path + view + "/" + ordering + "/" +time)

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
                    {name: "title", key:'songId', span:4 },
                    {name: "artist", span:2 }
                ]},
                {name: $('.bootstrap-select.order .filter-option').text(), "var": 'cnt', span:6}
            ];
        } else if($(viewHidden[0]).val() == 'djs') {
            rows = [
                {sub: true, fields: [
                    {name: "djname", key:'djid', span:6}
                ]},
                {name: $('.bootstrap-select.order .filter-option').text(), "var": 'cnt', span:6}
            ]

        }
        console.log(rows);
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
        
        d3.select('.results .count').text(function(d) {
            return d.name;
        })
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
            
            return Utils.displayDataTD(d);
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
    function offSecondary() {
        $('#topList').removeClass('animated').height($('#topList').css('height','auto').height())
        $("#containerWrap").removeClass('secondary');
    }
    function gotoSecondary() {

        $('#topList').addClass('animated').height('1px');

        $('#containerWrap').addClass('secondary');
    }
    function init() {
        var wrapper = d3.select('#topList');
        var secondWrapper = d3.select('#secondary');
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
        History.Adapter.bind(window,'statechange',stateChange);

    }
    function stateChange(){ // Note: We are using statechange instead of popstate
        if(ignoreStateChange) {
            ignoreStateChange = false;
            return;
        }
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
        var view = State.data.view;
        if(view === 'songs' || view === 'djs') {
            restoreMainState(State.data);
        } else if(view === 'detail') {
            Detail.getDetail(State.data.detailData);
            gotoSecondary();
        }
        History.log(State.data, State.title, State.url);
    }
    function restoreMainState(data) {
        offSecondary();
        console.log('restore main state');
        $('.viewBtns .active').removeClass('active');
        $('.viewBtns button[value="' + data.view + '"]').addClass('active');
        var textValue = null;
        $(".order option").each(function() { 
            this.selected = (this.value == data.ordering); 
            if(this.selected) textValue = this.text;
        });
        $('.bootstrap-select.order .btn .filter-option').text(textValue);

        $(".timeNav .active").removeClass('active');
        $('.timeNav [data-time="' + data.time+'"]').addClass('active');
        //$('.order').val('up');
        //$('.order :selected').prop('selected',false);
        //$('.order [value="' + data.ordering+'"]').prop('selected',true);

        makeRequest();
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
    return {jsonPath: jsonPath, path: path}
})()

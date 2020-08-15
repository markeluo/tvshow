
$(function () {

    echarts_1();
    echarts_2();
    InitStyles();
    echarts_3();
    echarts_4();
    InitCPOCharts();

    function echarts_1() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts_1'));

        var data = [
            {value: 70,name: '一车间'},
            {value: 13,name: '一厂'},
            {value: 12,name: '二厂'},
            {value: 52,name: '五厂'}
        ];

        option = {
            backgroundColor: 'rgba(0,0,0,0)',
            tooltip: {
                trigger: 'item',
                formatter: "{b}: <br/>{c} ({d}%)"
            },
            color: ['#af89d6', '#4ac7f5', '#0089ff', '#f36f8a', '#f5c847'],
            legend: { //图例组件，颜色和名字
                x: '70%',
                y: 'center',
                orient: 'vertical',
                itemGap: 12, //图例每项之间的间隔
                itemWidth: 10,
                itemHeight: 10,
                icon: 'rect',
                data: ['一车间', '一厂', '二厂', '五厂'],
                textStyle: {
                    color: [],
                    fontStyle: 'normal',
                    fontFamily: '微软雅黑',
                    fontSize: 12,
                }
            },
            series: [{
                name: '行业占比',
                type: 'pie',
                clockwise: false, //饼图的扇区是否是顺时针排布
                minAngle: 20, //最小的扇区角度（0 ~ 360）
                center: ['35%', '50%'], //饼图的中心（圆心）坐标
                radius: [50, 75], //饼图的半径
                avoidLabelOverlap: true, ////是否启用防止标签重叠
                itemStyle: { //图形样式
                    normal: {
                        borderColor: '#1e2239',
                        borderWidth: 2,
                    },
                },
                label: { //标签的位置
                    normal: {
                        show: true,
                        position: 'inside', //标签的位置
                        formatter: "{d}%",
                        textStyle: {
                            color: '#fff',
                        }
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontWeight: 'bold'
                        }
                    }
                },
                data: data
            }, {
                name: '',
                type: 'pie',
                clockwise: false,
                silent: true,
                minAngle: 20, //最小的扇区角度（0 ~ 360）
                center: ['35%', '50%'], //饼图的中心（圆心）坐标
                radius: [0, 40], //饼图的半径
                itemStyle: { //图形样式
                    normal: {
                        borderColor: '#1e2239',
                        borderWidth: 1.5,
                        opacity: 0.21,
                    }
                },
                label: { //标签的位置
                    normal: {
                        show: false,
                    }
                },
                data: data
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    function echarts_2() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts_2'));

        option = {
            backgroundColor: 'rgba(0,0,0,0)',
            tooltip: {
                trigger: 'item',
                formatter: "{b}  <br/>{c}人"
            },
            legend: {
                x: 'center',
                y: '2%',
                data: ['一车间', '一厂', '二厂', '五厂'],
                icon: 'circle',
                textStyle: {
                    color: '#fff',
                }
            },
            calculable: true,
            series: [{
                name: '人数',
                type: 'pie',
                //起始角度，支持范围[0, 360]
                startAngle: 0,
                //饼图的半径，数组的第一项是内半径，第二项是外半径
                radius: [41, 110],
                //支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度
                center: ['50%', '20%'],
                //是否展示成南丁格尔图，通过半径区分数据大小。可选择两种模式：
                // 'radius' 面积展现数据的百分比，半径展现数据的大小。
                //  'area' 所有扇区面积相同，仅通过半径展现数据大小
                roseType: 'area',
                //是否启用防止标签重叠策略，默认开启，圆环图这个例子中需要强制所有标签放在中心位置，可以将该值设为 false。
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: true,
                        formatter: '{c}人'
                    },
                    emphasis: {
                        show: true
                    }
                },
                labelLine: {
                    normal: {
                        show: true,
                        length2: 1,
                    },
                    emphasis: {
                        show: true
                    }
                },
                data: [{
                    value: 120,
                    name: '一车间',
                    itemStyle: {
                        normal: {
                            color: '#f845f1'
                        }
                    }
                },
                    {
                        value: 23,
                        name: '一厂',
                        itemStyle: {
                            normal: {
                                color: '#ad46f3'
                            }
                        }
                    },
                    {
                        value: 20,
                        name: '二厂',
                        itemStyle: {
                            normal: {
                                color: '#5045f6'
                            }
                        }
                    },
                    {
                        value: 90,
                        name: '五厂',
                        itemStyle: {
                            normal: {
                                color: '#4777f5'
                            }
                        }
                    },
                    {
                        value: 0,
                        name: "",
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },
                    {
                        value: 0,
                        name: "",
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },
                    {
                        value: 0,
                        name: "",
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    },
                    {
                        value: 0,
                        name: "",
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                ]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
 
    function echarts_3() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts_3'));
        var xData = function() { 
            return ['跳针','剪线不干净','针孔/破洞','车线落坑','打折','污渍/油迹','露线','重线欠准','断线'];
        }();

        var data = [{name:'疵点数',data:[4131,1516,1450,1354,1333,1171,694,661,647]}];

        option = {
            // backgroundColor: "#141f56",

            tooltip: {
                show: "true",
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0.4)', // 背景
                padding: [8, 10], //内边距
                // extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);', //添加阴影
                formatter: function(params) {
                    if (params.seriesName != "") {
                        return params.name + ' ：  ' + params.value + ' 件';
                    }
                },

            },
            grid: {
                borderWidth: 0,
                top: 20,
                bottom: 35,
                left:55,
                right:30,
                textStyle: {
                    color: "#fff"
                }
            },
            xAxis: [{
                type: 'category',

                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#363e83',
                    }
                },
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: '#bac0c0',
                        fontWeight: 'normal',
                        fontSize: '12',
                    },
                    // formatter:function(val){
                    //     return val.split("").join("\n")
                    // },
                },
                data: xData,
            }, {
                type: 'category',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                data: xData,
            }],
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#32346c',
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#32346c ',
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#bac0c0',
                        fontWeight: 'normal',
                        fontSize: '12',
                    },
                    formatter: '{value}',
                },
            },
            series: [{
                name:data[0].name,
                type: 'bar',
                label:{
                    show: true,
                },
                itemStyle: {
                    normal: {
                        show: true,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00c0e9'
                        }, {
                            offset: 1,
                            color: '#3b73cf'
                        }]),
                        barBorderRadius:5,
                        borderWidth: 0,
                    },
                    emphasis: {
                        shadowBlur: 15,
                        shadowColor: 'rgba(105,123, 214, 0.7)'
                    }
                },
                zlevel: 2,
                barWidth: '20%',
                data: data[0].data,
            }]
        }


        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }

    function echarts_4() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts_4'));

        var xData = function() {
            var data = ['裁剪数','车缝数','装箱数','出货数'];
            return data;
        }();

        var data = [{name:'计划',data:[18000, 15000, 15000, 9850]},{name:'完成',data:[12000, 10000, 9000, 7850]}];

        option = {
            // backgroundColor: "#141f56",
            legend: {
                data: ['计划', '完成'],
                orient: 'vertical',
                right: 10,
                top: 20,
                textStyle: {
                    color: '#fff',
                }
            },
            tooltip: {
                show: "true",
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0.4)', // 背景
                padding: [8, 10], //内边距
                // extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);', //添加阴影
                formatter: function(params) {
                    if (params.seriesName != "") {
                        return params.name + ' ：  ' + params.value + ' 件';
                    }
                },

            },
            grid: {
                borderWidth: 0,
                top: 20,
                bottom: 35,
                left:55,
                right:30,
                textStyle: {
                    color: "#fff"
                }
            },
            xAxis: [{
                type: 'category',

                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#363e83',
                    }
                },
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: '#bac0c0',
                        fontWeight: 'normal',
                        fontSize: '12',
                    },
                    // formatter:function(val){
                    //     return val.split("").join("\n")
                    // },
                },
                data: xData,
            }, {
                type: 'category',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                data: xData,
            }],
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#32346c',
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#32346c ',
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#bac0c0',
                        fontWeight: 'normal',
                        fontSize: '12',
                    },
                    formatter: '{value}',
                },
            },
            series: [{
                name:data[1].name,
                label:{
                    show: true,
                },
                type: 'pictorialBar',
                xAxisIndex: 1,
                barCategoryGap: '-80%',
                // barCategoryGap: '-5%',
                symbol: 'path://d="M150 50 L130 130 L170 130  Z"',
                itemStyle: {
                    normal: {
                        color: function(params) {
                            var colorList = [
                                'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)',
                                'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)',
                                'rgba(13,177,205,0.8)', 'rgba(29,103,182,0.6)'
                            ];
                            return colorList[params.dataIndex];
                        }
                    },
                    emphasis: {
                        opacity: 1
                    }
                },
                zlevel: 2,
                barWidth: '20%',
                data: data[1].data,
            },
            {
                name: data[0].name,
                type: 'bar',
                xAxisIndex: 1,
                zlevel: 1,
                label:{
                    show: true,
                    position:'top',
                },
                itemStyle: {
                    normal: {
                        color: '#83cbac',
                        borderWidth: 0,
                        shadowBlur: {
                            shadowColor: 'rgba(255,255,255,0.31)',
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowOffsetY: 2,
                        },
                    }
                },
                barWidth: '25%',
                data:data[0].data
            }]
        }


        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    } 

    function InitStyles(){
        var topN=8;
        var stylehtml="";
        var rowheight=parseInt(($(".cen-top").height()-35)/(topN+1));
        $.each(stylelive.data,function(i,item){
            if(i<topN){
                if(i%2==0){
                    stylehtml+="<tr class='abrow' style='height:"+rowheight+"px'>";
                }else{
                    stylehtml+="<tr style='height:"+rowheight+"px'>";
                }
                // stylehtml+="<td>"+item.BUY+"-"+item.StyleNo+"</td>";
                stylehtml+="<td>"+item.StyleNo+"</td>";
                stylehtml+="<td>"+item.PreCutQty+"</td>";
                stylehtml+="<td class='piechart'><div id='sc_piechart_"+i+"'></div></td>";
                stylehtml+="<td class='piechart'><div id='cf_piechart_"+i+"'></div></td>";
                stylehtml+="<td class='piechart'><div id='zx_piechart_"+i+"'></div></td>";
                stylehtml+="<td class='piechart'><div id='ck_piechart_"+i+"'></div></td>"; 
                stylehtml+="</tr>";
            }
        });
        $("#stylelist tbody").html(stylehtml);
        $("#stylelist thead>tr").css({height:rowheight+"px"});

        $.each(stylelive.data,function(i,item){
            if(i<topN){
                Refresh_StylePieChart(i,item);
            }
        });
    }
    //刷新款式完成百分比
    function Refresh_StylePieChart(index,data){
        RefreshPieChart("sc_piechart_"+index,[{name:(data.CutQty/data.PreCutQty*100).toFixed(0),value:data.CutQty},{name:'',value:(data.PreCutQty-data.CutQty)}])
        RefreshPieChart("cf_piechart_"+index,[{name:(data.CFQty/data.PreCutQty*100).toFixed(0),value:data.CFQty},{name:'',value:(data.PreCutQty-data.CFQty)}])
        RefreshPieChart("zx_piechart_"+index,[{name:(data.LoadedQty/data.PreCutQty*100).toFixed(0),value:data.LoadedQty},{name:'',value:(data.PreCutQty-data.LoadedQty)}])
        RefreshPieChart("ck_piechart_"+index,[{name:(data.ShipQty/data.PreCutQty*100).toFixed(0),value:data.ShipQty},{name:'',value:(data.PreCutQty-data.ShipQty)}])
    }
    function RefreshPieChart(_contairId,data){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(_contairId));
        option = {
            color:["#4ee3b9","#f8816e","#FFFFFF"],
            series: [{
                name: '完成百分比',
                type: 'pie',
                radius: ['50%','70%'],
                avoidLabelOverlap: false,
                label: {
                    show: true,
                    fontSize:16,
                    fontWeight:'bold',
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data:data
            }]
        }; 
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize",function(){
            myChart.resize();
        });
    }
    
    function InitCPOCharts(){
        var cpolist= [
            {
                "CPO": "NIK20080011",
                "StyleNo": "AO5970",
                "ShipDate": "2020-08-05",
                "Destination": "美國",
                "CutQty": 1110,
                "ComplateQty":980
            },
            {
                "CPO": "NIK20080010",
                "StyleNo": "CI9831",
                "ShipDate": "2020-08-05",
                "Destination": "烏拉圭",
                "CutQty": 147,
                "ComplateQty":140
            },
            {
                "CPO": "NIK20080006",
                "StyleNo": "CK5232",
                "ShipDate": "2020-08-05",
                "Destination": "美國",
                "CutQty": 504,
                "ComplateQty":395
            },
            {
                "CPO": "NIK20080005",
                "StyleNo": "CK5232",
                "ShipDate": "2020-08-05",
                "Destination": "美國",
                "CutQty": 576,
                "ComplateQty":520
            },
            {
                "CPO": "NIK20080263",
                "StyleNo": "AO3379",
                "ShipDate": "2020-08-05",
                "Destination": "美國",
                "CutQty": 82,
                "ComplateQty":70
            },
            {
                "CPO": "NIK20080069",
                "StyleNo": "CK5446",
                "ShipDate": "2020-08-10",
                "Destination": "墨西哥",
                "CutQty": 281,
                "ComplateQty":250
            },
            {
                "CPO": "NIK20080554",
                "StyleNo": "AO3379",
                "ShipDate": "2020-08-10",
                "Destination": "美國",
                "CutQty":20,
                "ComplateQty":18
            },
            {
                "CPO": "NIK20080568",
                "StyleNo": "CU3886",
                "ShipDate": "2020-08-10",
                "Destination": "台灣",
                "CutQty":847,
                "ComplateQty":840
            },
            {
                "CPO": "NIK20080572",
                "StyleNo": "CT3462",
                "ShipDate": "2020-08-15",
                "Destination": "韓國",
                "CutQty":1898,
                "ComplateQty":1600
            },
            {
                "CPO": "NIK20080013",
                "StyleNo": "CI9831",
                "ShipDate": "2020-08-15",
                "Destination": "阿根廷",
                "CutQty":205,
                "ComplateQty": 203
            }
        ]
        var cpohtml="";
        for(var i=0;i<cpolist.length;i++){
            if(i%2==0){
                cpohtml+="<div class='row abrow' id='tr_"+cpolist[i].CPO+"'>";
            }else{
                cpohtml+="<div class='row' id='tr_"+cpolist[i].CPO+"'>";
            }
            cpohtml+="<div class='nosty p10'><span class='sortno'>"+(i+1)+"</span></div>";
            cpohtml+="<div class='p30'>"+cpolist[i].CPO+"</div>";
            cpohtml+="<div class='p15'>"+cpolist[i].StyleNo+"</div>";
            cpohtml+="<div class='p15'><span class='alarm "+getleveClass(cpolist[i])+"'>"+cpolist[i].ShipDate.substr(5)+"</span></div>";
            cpohtml+="<div class='p15'>"+cpolist[i].Destination+"</div>";
            // cpohtml+="<div>"+(cpolist[i].CutQty-cpolist[i].ComplateQty)+"</div>";
            cpohtml+="<div class='percent p15'><span></span>"+(cpolist[i].ComplateQty*1.00/cpolist[i].CutQty*100).toFixed(0)+"% </div>";
            cpohtml+="</div>";
        }
        $("#cpolist .tbody").html(cpohtml);

        var tempdata=null;
        for(var i=0;i<cpolist.length;i++){
            tempdata=[cpolist[i].ComplateQty,cpolist[i].CutQty-cpolist[i].ComplateQty];
            $("#tr_"+cpolist[i].CPO).find("div.percent>span").sparkline(tempdata,{
                type:'pie',
                width:'auto',
                height: 'auto',
                sliceColors:['#4ee3b9','#f8816e','#ff9900','#109618','#66aa00','#dd4477','#0099c6','#990099']
            });
        }
    }

    /*获取等级样式*/
    function getleveClass(itemdata){
        var compdate="2020-08-01 01:01:01";
        var cmval=compareTime(new Date(compdate).getTime(),new Date(itemdata.ShipDate).getTime());
        if(cmval.Days>10){return "leve4"}
        if(cmval.Days>7){return "leve3"}
        if(cmval.Days>3){return "leve2"}
        return "leve1"
    }

    function compareTime (startTime, endTime) {
        var retValue = {}
     
        var compareTime = endTime - startTime  // 时间差的毫秒数
     
        // 计算出相差天数
        var days = Math.floor(compareTime / (24 * 3600 * 1000))
        retValue.Days = days
     
        // 计算出相差年数
        var years = Math.floor(days / 365)
        retValue.Years = years
     
        // 计算出相差月数
        var months = Math.floor(days / 30)
        retValue.Months = months
     
        // 计算出小时数
        var leaveHours = compareTime % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
        var hours = Math.floor(leaveHours / (3600 * 1000))
        retValue.Hours = hours
     
        // 计算相差分钟数
        var leaveMinutes = leaveHours % (3600 * 1000) // 计算小时数后剩余的毫秒数
        var minutes = Math.floor(leaveMinutes / (60 * 1000))
        retValue.Minutes = minutes
     
        // 计算相差秒数
        var leaveSeconds = leaveMinutes % (60 * 1000) // 计算分钟数后剩余的毫秒数
        var seconds = Math.round(leaveSeconds / 1000)
        retValue.Seconds = seconds
     
        var resultSeconds = 0
        if (years >= 1) {
            resultSeconds = resultSeconds + years * 365 * 24 * 60 * 60
        }
        if (months >= 1) {
            resultSeconds = resultSeconds + months * 30 * 24 * 60 * 60
        }
        if (days >= 1) {
            resultSeconds = resultSeconds + days * 24 * 60 * 60
        }
        if (hours >= 1) {
            resultSeconds = resultSeconds + hours * 60 * 60
        }
        if (minutes >= 1) {
            resultSeconds = resultSeconds + minutes * 60
        }
        if (seconds >= 1) {
            resultSeconds = resultSeconds + seconds
        }
        retValue.resultSeconds = resultSeconds
     
        return retValue
    }

    function CPOSwitch(){
        $($("#cpolist .tbody>.row")[0]).animate({"height":0,opacity:0},500,function(){
            // $(this).animate({"height":500},100,function(){
            //     $(this).animate({"backgroundColor":"red"})
            // })
            var item=$($("#cpolist .tbody>.row")[0]);
            item.remove();
            item.insertAfter($($("#cpolist .tbody").children(".row:last-child"))).css({
                "height":40,
                opacity:1
            });
            setTimeout(CPOSwitch,3000);
        })
    }
    setTimeout(CPOSwitch,3000);
})


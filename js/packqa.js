var LineCode="";
var LineInfo={LineCode: '', LineName: '尾查检验看板'};
$(function(){
    var urlparas=getQueryObject();
    LineCode=urlparas.linecode;//解析产线代码
    if(LineCode && LineCode!=''){}else{
        LineCode=''
    }

    var a=$('.visualSssf_left a')
    for(var i=0;i<a.length;i++){
        a[i].index=i;
        a[i].onclick=function(){
            for(var i=0;i<a.length;i++){
                a[i].className=''
                }
            this.className='active'
        }
    }

    var sfzcllH=$('.sfzcll_box').height()
    var sfzcllHtwo=sfzcllH-2
    $('.sfzcll_box').css('line-height',sfzcllH+'px')
    $('.sfzcll_smallBk>div').css('line-height',sfzcllHtwo+'px')

    LoadLineInfo();
    //数据加载....
    RefreshData();

    //删除加载动画
    $('#load').fadeOut(1000)
    setTimeout(function(){    
        $('#load').remove()
    }
    ,1100);
});

function getQueryObject(url) {
    url = url == null ? window.location.href : url;
    var search = url.substring(url.lastIndexOf("?") + 1);
    var obj = {};
    var reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, function (rs, $1, $2) {
        var name = decodeURIComponent($1);
        var val = decodeURIComponent($2);
        val = String(val);
        obj[name] = val;
        return rs;
    });
    return obj;
}

function LoadLineInfo(){
    DAL.GetLineInfo(LineCode,function(_rlt){
        if(_rlt && _rlt.code==200 && _rlt.data.length>0){
            LineInfo=_rlt.data[0];
        }else{
            LineInfo={LineCode: 'CJM1C01', LineName: '裁床*组', Kind: '裁', FactoryCode: 'CJM1C', FactoryName: '裁床'};
        }
        $("#line_name").html(LineInfo.LineName+' 品质看板');
    });
}

let day_pack_qa_total={}
let pack_qa_style_total={}
let pack_qa_topN_dict={}
let pack_qa_dict_rate={}
/**
 * 刷新数据
 */
function RefreshData(){

    DAL.GetPackTodayTotal(LineCode,function(_rlt){
        if(_rlt.code==200){
            day_pack_qa_total=_rlt.data;
        }else{
            day_pack_qa_total={
                OkQty:0,
                VerifyQty:0,
                DefectQty:0,
                DefItems:[]
            }
        }
        initDayTotal_Table(day_pack_qa_total);
        initDayTotal_Chart(day_pack_qa_total);
    });

    /*2.款式统计*/
    DAL.GetPackTodayStyle(LineCode,function(_rlt){
        if(_rlt.code==200){
            pack_qa_style_total=_rlt.data;
        }else{
            pack_qa_style_total=[];
        }
        initStyleTotal_Chart(pack_qa_style_total);
    });

    /*3.5大不良*/
    DAL.GetPackTopNDict(LineCode,function(_rlt){
        if(_rlt.code==200){
            pack_qa_topN_dict=_rlt.data;
        }else{
            pack_qa_topN_dict=[];
        }
        initPackTopNDict_Chart(pack_qa_topN_dict);
    });

    /*3.6 不良趋势*/
    DAL.GetPackDictRate(LineCode,function(_rlt){
        if(_rlt.code==200){
            pack_qa_dict_rate=_rlt.data;
        }else{
            pack_qa_dict_rate=[];
        }
        initPackDictRateHistory(pack_qa_dict_rate);
    });
 
    //结束后再次调用
    setTimeout(RefreshData,60000);
}

/**
 * 初始化 每日客查统计数据 表格
 * @param {*} _data 
 */
function initDayTotal_Table(_data){
    $("#day_tab_qty").html(_data.VerifyQty);
    $("#day_tab_ok").html(_data.OkQty);
    $("#day_tab_def").html(_data.DefectQty);    
}
/**
* 1.初始化每日客查问题汇总图表
* @returns 
*/
function initDayTotal_Chart(_data){
var seriesdata=[];
var tcolor='#ffb73a';
var _xdata=[];
for(var i=0;i<_data.DefItems.length;i++){
    _xdata.push(_data.DefItems[i].DictEnName);
    seriesdata.push({
        x:i,
        y:_data.DefItems[i].DictQty,
        color:tcolor,
    });
}
var chartHeight=($("#day_totalChart").parent().height()-115);
Highcharts.chart("day_totalChart", {
    chart: {
        type:"column",
        height:chartHeight,
        backgroundColor:'rgba(0,0,0,0)',
    },
    title: {
        text:_data.DayTitle,
        style: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize:'1.5em'
        }
    },
    xAxis: {
        categories:_xdata,
        labels:{
            // rotation:-20,
            style: {
                color: '#FFFFFF',
                fontSize:'1.5em'
            },
            useHTML:true
        }
    },
    yAxis:{
        visible:false,
    },
    plotOptions:{
        series:{
            dataLabels:{
                enabled:true,
                format:"{y}",
                style: {
                    color: '#FFFFFF', 
                    fontSize:'1.5em'
                },

            },
            color:'#20b879',
        },
    },
    credits: {
        enabled: false
    },
    legend:{
        enabled:false,
    },
    series: [{
        name: '',
        data:seriesdata
    }]
});
}

/**
 * 2.今日款式尾查明细
 * @param {*} _data 
 * @returns 
 */
 function initStyleTotal_Chart(_data){
    let _xdata=[];
    let _y1data=[];
    let _y2data=[];
    _data.forEach(element => {
        _xdata.push(element.StyleNo);
        _y1data.push(element.DefectQty);
        _y2data.push(element.OkQty);
    });
    
    
    var seriesdata=[
        {name:'不合格',data:_y1data,color:'#e53333'},
        {name:'合格',data:_y2data,color:'#20b879'}
    ];
     
    var minheight=($("#week_style_chart").parent().height());
    return Highcharts.chart("week_style_chart", {
     chart: {
         type:"column",
         height:minheight,
         backgroundColor:'rgba(0,0,0,0)',
     },
     title: {
        text:'今日尾查明细',
        align:'left',
        style: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize:'2em'
        }
     },
     xAxis: {
        categories:_xdata,
         labels:{
            //  rotation:-45,
             style: {
                 color: '#FFFFFF',
                 fontSize:'1.5em'
             },
             useHTML:true
         }
     },
     yAxis:{
         title:{
             text: "",
             style: {
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize:'1.5em'
            }
        },
         labels:{
                style: {
                color: '#FFFFFF',
                fontSize:'1.5em'
            }
         },
     },
     plotOptions:{
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                color: '#FFFFFF',
                style:{
                    fontWeight: 'bold',
                    fontSize:'1.2em'
                }
            }
        }
     },
     credits: {
         enabled: false
     },
     legend:{
         enabled:true,
         align: 'right',
         x: 0,
         verticalAlign: 'top',
         y: 0,
         floating: true,
         itemStyle: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize:'1.2em'
        }
     },
     series:seriesdata
    });
    }
    

    let pickTopNColors=['#00F53D','#B800F5','#B8F500','#00F5B8','#F500B8','#66FF33','#00B8F5','#F5003D','#CC33FF','#F5B800']
/**
 * 3.TopN 不良
 * @param {*} _data 
 */
function initPackTopNDict_Chart(_data){
    //_data:{ToDayDictItems:[],WeekDictItems:[],MonthDictItems:[]}
    var seriesdata1=[];
    var seriesdata2=[];
    var seriesdata3=[];

    if(_data.ToDayDictItems && _data.ToDayDictItems.length>0){
        for(var i=0;i<_data.ToDayDictItems.length;i++){
            seriesdata1.push({
                name:_data.ToDayDictItems[i].DictEnName,
                y:_data.ToDayDictItems[i].DefectQty,
            });
        }
    }
    if(_data.WeekDictItems && _data.WeekDictItems.length>0){
        for(var i=0;i<_data.WeekDictItems.length;i++){
            seriesdata2.push({
                name:_data.WeekDictItems[i].DictEnName,
                y:_data.WeekDictItems[i].DefectQty,
            });
        }
    }
    if(_data.MonthDictItems && _data.MonthDictItems.length>0){
        for(var i=0;i<_data.MonthDictItems.length;i++){
            seriesdata3.push({
                name:_data.MonthDictItems[i].DictEnName,
                y:_data.MonthDictItems[i].DefectQty,
            });
        }
    }
    
    var chartHeight=($("#every_month_chart").parent().height()-35);
    Highcharts.chart("day_chart",  {
        chart: {
            type:"pie",
            height:chartHeight,
            backgroundColor:'rgba(0,0,0,0)',
        },
        colors:pickTopNColors,
        title: {
            text:'日的5大不良',
            align:'center',
            verticalAlign:'bottom',
            style: {
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize:'1.2em'
            }
        },
        plotOptions:{
            pie:{
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels:{
                    enabled:true,
                    format:'{point.name}',
                    style: {
                        color: '#FFFFFF', 
                        fontSize:'9px',
                    },
                }
            }
        },
        credits: {
            enabled: false
        },
        legend:{
            enabled:false,
        },
        series:[{
            size:'20%',//饼图的中心（圆心）坐标
            data:seriesdata1
        }]
    });

    Highcharts.chart("week_chart", {
        chart: {
            type:"pie",
            height:chartHeight,
            backgroundColor:'rgba(0,0,0,0)',
        },
        colors:pickTopNColors,
        title: {
            text:'周的5大不良',
            align:'center',
            verticalAlign:'bottom',
            style: {
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize:'1.2em'
            }
        },
        plotOptions:{
            pie:{
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels:{
                    enabled:true,
                    format:'{point.name}',
                    style: {
                        color: '#FFFFFF', 
                        fontSize:'9px',
                    },
                }
            }
        },
        credits: {
            enabled: false
        },
        legend:{
            enabled:false,
        },
        series:[{
            size:'20%',//饼图的中心（圆心）坐标
            data:seriesdata2
        }]
    });

    Highcharts.chart("month_chart", {
        chart: {
            type:"pie",
            height:chartHeight,
            backgroundColor:'rgba(0,0,0,0)',
        },
        colors:pickTopNColors,
        title: {
            text:'月的5大不良',
            align:'center',
            verticalAlign:'bottom',
            style: {
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize:'1.2em'
            }
        },
        plotOptions:{
            pie:{
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels:{
                    enabled:true,
                    format:'{point.name}',
                    style: {
                        color: '#FFFFFF', 
                        fontSize:'9px',
                    },
                }
            }
        },
        credits: {
            enabled: false
        },
        legend:{
            enabled:false,
        },
        series:[{
            size:'20%',//饼图的中心（圆心）坐标
            data:seriesdata3
        }]
    });

}

/**
 * 4. 不良趋势图
 * @param {*} _data 
 */
function initPackDictRateHistory(_data){
    var seriesdata=[];
    var tcolor='#ffb73a';
    var _xdata=[];
    for(var i=0;i<_data.length;i++){
        _xdata.push(_data[i].DDate.substring(0,10));
        seriesdata.push({
            x:i,
            y:_data[i].Rate,
            color:tcolor,
        });
    }
    var chartHeight=($("#every_month_chart").parent().height()-35);
    Highcharts.chart("every_month_chart", {
        chart: {
            type:"line",
            height:chartHeight,
            backgroundColor:'rgba(0,0,0,0)',
        },
        title: {
            text:''
        },
        xAxis: {
            categories:_xdata,
            labels:{
                rotation:-45,
                style: {
                    color: '#FFFFFF',
                    fontSize:'1.5em'
                },
                useHTML:true
            }
        },
        yAxis:{
            title:{
                text: "",
                style: {
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize:'2em'
                }
            },
            labels:{
                style: {
                    color: '#FFFFFF',
                    fontSize:'1.5em'
                },
                format:"{value}%",
                y:-15
            },
        },
        plotOptions:{
            series:{
                dataLabels:{
                    enabled:true,
                    format:"{y}%",
                    style: {
                        color: '#FFFFFF', 
                        fontSize:'1.5em'
                    },
                },
                color:'#6dfbed',
            },
        },
        credits: {
            enabled: false
        },
        legend:{
            enabled:false,
        },
        series: [{
            name: '',
            data:seriesdata
        }]
    });
}
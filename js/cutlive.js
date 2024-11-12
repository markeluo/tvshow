var LineCode="";
var LineInfo={LineCode: 'CJM1C01', LineName: '裁床A组', Kind: '裁', FactoryCode: 'CJM1C', FactoryName: '裁床'};
$(function(){
    var urlparas=getQueryObject();
    LineCode=urlparas.linecode;//解析产线代码
    if(LineCode && LineCode!=''){}else{
        LineCode='CJM1C01'
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

/**
 * 刷新数据
 */
function RefreshData(){

    DAL.GetCutTodayTotal(LineCode,function(_rlt){
        if(_rlt.code==200){
            day_cut_part_total=_rlt.data;
        }else{
            day_cut_part_total={
                DayTitle:'疵点问题 TOPN',
                OkQty:0,
                VerifyQty:0,
                DefectRate:0,
                DefItems:[]
            }
        }
        initDayTotal_Table(day_cut_part_total);
        initDayTotal_Chart(day_cut_part_total);
    });

    DAL.GetCutWeekTotal(LineCode,function(_rlt){
        if(_rlt.code==200){
            week_cut_part_defrate=_rlt.data;
        }else{
            week_cut_part_defrate=[];
        }
        initWeekStyle_Chart(week_cut_part_defrate);
    });

    DAL.GetCutDayHistory(LineCode,function(_rlt){
        if(_rlt.code==200){
            every_day_live=_rlt.data;
        }else{
            every_day_live=[];
        }
        initEveryDayLive_Chart(every_day_live);
    });

    DAL.GetCutMonthHistory(LineCode,function(_rlt){
        if(_rlt.code==200){
            every_month_live=_rlt.data;
        }else{
            every_month_live=[];
        }
        initEveryMonthLive_Chart(every_month_live);
    });
 
    //结束后再次调用
    setTimeout(RefreshData,60000);
}

/**
 * 初始化每日查片统计数据 表格
 * @param {*} _data 
 */
function initDayTotal_Table(_data){
    $("#day_tab_qty").html(_data.VerifyQty);
    $("#day_tab_ok").html(_data.OkQty);
    $("#day_tab_defrate").html(_data.DefectRate+"%");    
}
/**
* 初始化每日 疵点问题汇总图表
* @returns 
*/
function initDayTotal_Chart(_data){
var seriesdata=[];
var tcolor='#ffb73a';
var _xdata=[];
for(var i=0;i<_data.DefItems.length;i++){
    _xdata.push(_data.DefItems[i].DefectText);
    seriesdata.push({
        x:i,
        y:_data.DefItems[i].DefectQty,
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
            rotation:-20,
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
 * 每日疵点问题
 * @param {*} _data 
 */
function initEveryDayLive_Chart(_data){
var seriesdata=[];
var tcolor='#ffb73a';
var _xdata=[];
for(var i=0;i<_data.length;i++){
    _xdata.push(_data[i].DyName);
    seriesdata.push({
        x:i,
        y:_data[i].DefectRate,
        color:tcolor,
    });
}
var chartHeight=($("#every_day_chart").parent().height()-35);
Highcharts.chart("every_day_chart", {
    chart: {
        type:"line",
        height:chartHeight,
        backgroundColor:'rgba(0,0,0,0)',
    },
    title: {
        text:_data.DayTitle,
        style: {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize:'2em'
        }
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
            color:'#36b4fb',
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
 * 每月历史疵点历史汇总
 * @param {*} _data 
 */
function initEveryMonthLive_Chart(_data){
var seriesdata=[];
var tcolor='#ffb73a';
var _xdata=[];
for(var i=0;i<_data.length;i++){
    _xdata.push(_data[i].MonthName);
    seriesdata.push({
        x:i,
        y:_data[i].DefectRate,
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

/**
 * 周款式疵点汇总
 * @param {*} _data 
 * @returns 
 */
function initWeekStyle_Chart(_data){
let _xdata=[];
let _ydata=[];
_data.forEach(element => {
    _xdata.push(element.StyleNo);
  _ydata.push(element.DefectRate);
});


var seriesdata=[];
var tcolor='#20b879';
for(var i=0;i<_ydata.length;i++){
    tcolor='#20b879';
    if(_ydata[i]>3){
        tcolor='#e53333';
    }
    seriesdata.push({
        x:i,
        y:_ydata[i],
        color:tcolor,
        dataLabels:{
            style: {
                color:'#FFFFFF', 
                fontSize:'1.3em'
            },
        }
    });
}
var minheight=($("#week_style_chart").parent().height());
return Highcharts.chart("week_style_chart", {
 chart: {
     type:"column",
     height:minheight,
     backgroundColor:'rgba(0,0,0,0)',
 },
 title: {
    text:'第44周 疵点率趋势图',
    align:'center',
    style: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize:'2em'
    }
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
            fontSize:'1.5em'
        }
    },
     labels:{
            style: {
            color: '#FFFFFF',
            fontSize:'1.5em'
        },
         format:"{value}%"
     },
 },
 plotOptions:{
     series:{
         dataLabels:{
             enabled:true,
             format:"{y}%",
             style: {
                 color: '#ffffff', 
                 fontSize:'1.3em'
             },
             y:-15
         },
         lineWidth:5,
         color:'#FFFFFF',
         marker:{
             radius:10,
             fillColor:'#237bde'
         }
     }
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
var LineCode="";
$(document.body).ready(function(){
    var urlparas=getQueryObject();
    LineCode=urlparas.linecode;//解析产线代码

    setInterval(pageSwitch,5000);
    reloadData();
    setInterval(reloadData,30000);
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

//页面切换
function pageSwitch(){
    var tindex = $("div.pageitem").index($("div.pageitem.actived"))
    var total=$("div.pageitem").length;
    var _index=tindex+1;
    if(_index>=total){
        _index=0;
    }
 
    $($("div.pageitem").eq(tindex)).animate({
        "left":'-1920px',
        opacity:0.5
    },500,function(ev){
        $(this).removeClass("actived");
    });

    $($("div.pageitem").eq(_index)).css({
        "left":'1920px',
        opacity:0.5
    }).addClass("actived").animate({
        "left":'0px',
        opacity:1
    });
}

//region  2.数据处理--start
function reloadData(){
    refreshtarget();
    refreshStyleMarkers();
    refreshFTTRate();
    refreshDefRate();
    freshCharts();
}

//2.1.刷新目标与待完成
function refreshtarget(){
    DAL.GetTarget(LineCode,function(rlt){
        if(rlt && rlt.code==200){

        }
    });
}

//2.2.刷新款式故障图
function refreshStyleMarkers(){
    DAL.GetStyleMarkers(LineCode,function(rlt){
        if(rlt && rlt.code==200){
                    
        }
    });
}

//2.3.刷新当前FTT
function refreshFTTRate(){
    DAL.GetFTTRate(LineCode,function(rlt){
        if(rlt && rlt.code==200){
                    
        }
    });
}

//2.4.刷新次品率
function refreshDefRate(){
    DAL.GetDefRate(LineCode,function(rlt){
        if(rlt && rlt.code==200){
                    
        }
    });
}

//2.5.刷新图表显示
function freshCharts(){
    DAL.GetFTTHistory(LineCode,function(rlt){
        if(rlt && rlt.code==200){
            chars=[];
            var d_title="每日FTT趋势图";
            var d_data=filterFTTData(rlt.data,"DAY");
            initFTT_Chart('FTT_Day',d_title,d_data.x,d_data.y);
        
            var w_title="每周FTT趋势图";
            var w_data=filterFTTData(rlt.data,"WEEK");
            initFTT_Chart('FTT_Week',w_title,w_data.x,w_data.y);
        
            var m_title="每月FTT趋势图";
            var m_data=filterFTTData(rlt.data,"MONTH");
            initFTT_Chart('FTT_Month',m_title,m_data.x,m_data.y);      
        }
    });
}
 
//2.5.1.图表初始化
function initFTT_Chart(_contairID,_title,_xdata,_ydata){
   return Highcharts.chart(_contairID, {
        chart: {
            type: 'line',
            height:888
        },
        title: {
            text:_title,
            style: {
				color: '#000000',
				fontWeight: 'bold',
                fontSize:'4em'
			}
        },
        xAxis: {
            categories:_xdata,
            labels:{
                style: {
                    color: '#666666',
                    fontSize:'2em'
			    },
                useHTML:true
            }
        },
        yAxis:{
            title:{
                text: "FTT",
                style: {
                    color: '#000000',
                    fontWeight: 'bold',
                    fontSize:'2em'
			    }
            },
            labels:{
                style: {
                    color: '#666666',
                    fontSize:'2em'
			    },
                format:"{value} %"
            },
            min:0,
            max:120
        },
        plotOptions:{
            series:{
                dataLabels:{
                    enabled:true,
                    format:"{y} %",
                    style: {
                        color: '#000000', 
                        fontSize:'2em'
                    },
                    y:-15
                },
                lineWidth:5,
                color:'#333333',
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
            itemStyle:{
                "color": "#333333",
                "cursor": "pointer", 
                "fontSize": "2em", 
                "fontWeight": "bold" 
            },
            margin:30
        },
        series: [{
            name: 'FTT达成',
            data:_ydata
        }]
    });
}

//2.5.2.FTT 数据筛选
function filterFTTData(_data,_type){
    var tdata={x:[],y:[]};
    var tname="";
    if(_type=="DAY"){
        for(var i=0;i<_data.length;i++){
            if(_data[i].TYP==_type){
                tname=_data[i].NM.split("##")[1].replace("周1","(周一)")
                .replace("周2","(周二)")
                .replace("周3","(周三)")
                .replace("周4","(周四)")
                .replace("周5","(周五)")
                .replace("周6","(周六)")
                .replace("周0","(周日)");
                tdata.x.push(_data[i].NM.split("##")[0]+"<br/><strong>"+tname+"</strong>");
                tdata.y.push(parseInt(_data[i].FTT_RT));
            }
        }
    }else{
        for(var i=0;i<_data.length;i++){
            if(_data[i].TYP==_type){
                tdata.x.push("<strong>"+_data[i].NM+"</strong>");
                tdata.y.push(parseInt(_data[i].FTT_RT));
            }
        }
    }
    return tdata;
}
//endregion 数据处理--end
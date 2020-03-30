var LineCode="";
$(document.body).ready(function(){
    var urlparas=getQueryObject();
    LineCode=urlparas.linecode;//解析产线代码

    setInterval(pageSwitch,5000);
    reloadData();
    //setInterval(reloadData,30000);
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
var cp_mb=6;//次品率
var ftt_mb=90;//FTT目标
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
            if(rlt.data.TargetQty){
                $("#MB_Qty").html(rlt.data.TargetQty);
           }
           $("#DWC_Qty").html(rlt.data.PassQty);
        }
    });
}

//2.2.刷新款式故障图
function refreshStyleMarkers(){
    DAL.GetStyleMarkers(LineCode,function(rlt){
        if(rlt && rlt.code==200 && rlt.data.length>0){
            var styleinf=rlt.data[0];
 
            $("#GZT_BZ").html(styleinf.FactoryName+"-"+styleinf.LineName);
            $("#GZT_KH").html(styleinf.StyleNo);
            $("#GZT_TP>img").attr("src","images/"+styleinf.ImgName);

            var imgpars={
                left:($("#GZT_TP>img").offset().left-$("#GZT_TP").offset().left),
                top:($("#GZT_TP>img").offset().top-$("#GZT_TP").offset().top),
                width:$("#GZT_TP>img").width(),
                height:$("#GZT_TP>img").height()
            }

            $("#GZT_TP>span").remove();
            for(var i=0;i<rlt.data.length;i++){
                $("#GZT_TP").append(_styleMarkerFormat(rlt.data[i].PositionX,rlt.data[i].PositionY,imgpars));
            }
        }
    });
}
function _styleMarkerFormat(_x,_y,_par){
    var _left=parseInt(_par.width*_x)+_par.left-14;
    var _top=parseInt(_par.width*_y)+_par.top-14;
    var markerhtml="<span class='glyphicon glyphicon-map-marker' style='left:"+_left+"px;top:"+_top+"px;'></span>";
    return markerhtml;
}

//2.3.刷新当前FTT
function refreshFTTRate(){
    $("#FTT_MB").html(ftt_mb+"%");
    DAL.GetFTTRate(LineCode,function(rlt){
        if(rlt && rlt.code==200){
          if(rlt.data.FTTQty && rlt.data.FTTQty>=ftt_mb){
                $("#FTT_SJ").removeClass("font_red").addClass("font_green").html(rlt.data.FTTQty+"%");
           }else{
               $("#FTT_SJ").removeClass("font_green").addClass("font_red").html(rlt.data.FTTQty+"%");
           }     
        }
    });
}

//2.4.刷新次品率
function refreshDefRate(){
    $("#CPL_MB").html(cp_mb+"%");
    DAL.GetDefRate(LineCode,function(rlt){
        if(rlt && rlt.code==200){
            if(rlt.data.DefRate && rlt.data.DefRate>cp_mb){
                $("#CPL_SJ").removeClass("font_green").addClass("font_red").html(rlt.data.DefRate+"%");
            }else{
                $("#CPL_SJ").removeClass("font_red").addClass("font_green").html(rlt.data.DefRate+"%");
            }      
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
var LineCode="";
let scInfo=this.screen;
$(document.body).ready(function(){
    var urlparas=getQueryObject();
    LineCode=urlparas.linecode;//解析产线代码
 
    reloadData();
    setTimeout(pageSwitch,switchnum);
    setInterval(upswliveTime,1000);
});

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

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

//车缝看板时间更新
function upswliveTime(){
    $("#sw_live_time").html(new Date().Format("MM月dd日 hh:mm:ss"));
}

//页面切换
var switchnum=5000;
function pageSwitch(){
    var tindex = $("div.pageitem").index($("div.pageitem.actived"))
    var total=$("div.pageitem").length;
    var _index=tindex+1;
    if(_index>=total){
        _index=0;
    }
 
    ////动画效果
    // $($("div.pageitem").eq(tindex)).animate({
    //     "left":'-1920px',
    //     opacity:0.5
    // },500,function(ev){
    //     $(this).removeClass("actived");
    // });

    // $($("div.pageitem").eq(_index)).css({
    //     "left":'1920px',
    //     opacity:0.5
    // }).addClass("actived").animate({
    //     "left":'0px',
    //     opacity:1
    // },function(){
    //     if(_index==1){
    //         _refreshMarker();
    //     }
    // });

    //无动画处理
    $("div.pageitem").eq(tindex).removeClass("actived");
    $("div.pageitem").eq(_index).addClass("actived");
    if(_index==1){_refreshMarker();}
    if(_index==(total-1)){reloadData();}
    setTimeout(pageSwitch,switchnum);
}

//region  2.数据处理--start
var cp_mb=6;//次品率
var ftt_mb=90;//FTT目标
function reloadData(){
    refreshSWLive(); 

    refreshtarget();
    refreshStyleMarkers();
    refreshFTTRate();
    refreshDefRate();
    refreshCharts();
}

//2.1.刷新目标与待完成
function refreshtarget(){
    DAL.GetTarget(LineCode,function(rlt){
        if(rlt && rlt.code==200){
            if(rlt.data.TargetQty){
                $("#MB_Qty").html(rlt.data.TargetQty);
           }
           $("#DWC_Qty").html(rlt.data.TargetQty-rlt.data.PassQty);
        }
    });
}

//2.2.刷新款式故障图
var styleimg_pars={
    width:1150,
    height:750,
    markerdata:[]
}
function refreshStyleMarkers(){
    DAL.GetStyleMarkers(LineCode,function(rlt){
        if(rlt && rlt.code==200 && rlt.data.length>0){
            var styleinf=rlt.data[0];
            styleimg_pars.markerdata=rlt.data;
            //显示TopN信息
            _styleDefTopN(rlt.data);

            $("#GZT_KH").html(styleinf.StyleNo);
            $("#GZT_TP>img").attr("src","images/"+styleinf.ImgName).css({
                height:styleimg_pars.height+"px",
                width:"auto"
            });
            if($("#GZT_TP>img").width()>styleimg_pars.width){
                $("#GZT_TP>img").css({
                    height:"auto",
                    width:styleimg_pars.width+"px"
                });
            }
            //_refreshMarker();
        }else{
            _styleDefTopN(null);
        }
    });
}

function _styleDefTopN(_data){
    var defarrycodes=[];
    var defarry=[];//{code:'',name:'',num:1}
    var temindex=-1;
    if(_data!=null && _data.length>0){
        for(var i=0;i<_data.length;i++){
            if(_data[i].DefectCode!=null && _data[i].DefectCode!=""){
                temindex=defarrycodes.indexOf(_data[i].DefectCode);
                if(temindex>-1){
                    defarry[temindex].num++;
                }else{
                    defarrycodes.push(_data[i].DefectCode);
                    defarry.push({code:_data[i].DefectCode,name:_data[i].Name,num:1});
                }
            }
        }
        //按大小，从大到小
        defarry=defarry.sort(function(a,b){return b.num-a.num});
        if(defarry.length<=5){}else{
            defarry.splice(0,5);
        }
    }

    var defhtml='';
    if(defarry!=null && defarry.length>0){
        defhtml+='<tr><td colspan="2" class="merage">问题Top 5</td></tr>';
        for(var i=0;i<defarry.length;i++){
            defhtml+='<tr><td class="defname">'+defarry[i].name+'</td><td class="defval">'+defarry[i].num+'</td></tr>';
        }
    }
    $("#GZT_TOP5").html(defhtml); 
}
function _refreshMarker(){
    var tmpdata=styleimg_pars.markerdata;
    if(tmpdata && tmpdata.length>0){
        var imgpars={
            left:($("#GZT_TP>img").offset().left-$("#GZT_TP").offset().left),
            top:($("#GZT_TP>img").offset().top-$("#GZT_TP").offset().top),
            width:$("#GZT_TP>img").width(),
            height:$("#GZT_TP>img").height()
        }
    
        $("#GZT_TP>span").remove();
        for(var i=0;i<tmpdata.length;i++){
            $("#GZT_TP").append(_styleMarkerFormat(tmpdata[i].PositionX,tmpdata[i].PositionY,imgpars));
        }
    }
}
function _styleMarkerFormat(_x,_y,_par){
    var _left=parseInt(_par.width*_x)+_par.left;
    var _top=parseInt(_par.width*_y)+_par.top;
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
function refreshCharts(){
    DAL.GetFTTHistory(LineCode,function(rlt){
        if(rlt && rlt.code==200){
            chars=[];
            var d_title="每日  FTT趋势图";
            var d_data=filterFTTData(rlt.data,"DAY");
            initFTT_Chart('FTT_Day',d_title,d_data.x,d_data.y,"line",900);
        
            var w_title="周  FTT趋势图";
            var w_data=filterFTTData(rlt.data,"WEEK");
            initFTT_Chart('FTT_Week',w_title,w_data.x,w_data.y,"column",450);
        
            var m_title="月  FTT趋势图";
            var m_data=filterFTTData(rlt.data,"MONTH");
            initFTT_Chart('FTT_Month',m_title,m_data.x,m_data.y,"area",450);      
        }
    });
}

//2.6.刷新车缝KPI指标数据
function refreshSWLive(){
    DAL.GetSWLive(LineCode,function(rlt){ 
        if(rlt && rlt.code==200 && rlt.data.length>0){ 
            $("#sw_live_title").html(getlineName(LineCode)+" 生产看板");
            let tmpdata=rlt.data[0]; 
            //款式
            $("#kip_styleno").html(tmpdata.BUY+'-'+tmpdata.StyleNo);
            //目标
            $("#kip_targetQty").html(tmpdata.TargetQty+" 件");
             //实际
             $("#kip_smQty").html(tmpdata.Qty+" 件");
            //效率
            var xl_val=parseInt((tmpdata.Qty*tmpdata.NormalFS)/(tmpdata.TotalUserNum*tmpdata.WorkTime)*100);
            $("#kip_xl").html(xl_val+" %");
            //WIP
            var wip_val=0;
            if(tmpdata.TargetQty>0){
                wip_val=((tmpdata.SplitQty-tmpdata.SumQty)/tmpdata.TargetQty).toFixed(1)
            }
            $("#kip_wip").html(wip_val);
            //生产周期
            $("#kip_cycledays").html(tmpdata.CycleDays+" 天");
            //生产天数
            $("#kip_smdays").html(tmpdata.WorkDays+" 天");
            //节拍时间
            //$("#kip_steptime").html(formatStepTIme(tmpdata.NormalFS));
            $("#kip_steptime").html(calcstepTime(tmpdata.TargetQty));
            //班组人数
            $("#kip_usersnum").html(tmpdata.TotalUserNum);
        }
        else
        {
            $("#sw_live_title").html(getlineName(LineCode)+" 生产看板"); 
            $("#kip_styleno").html('NOT FOUND');
        }
    });
}
function calcstepTime(targetQty){
    if(targetQty && targetQty>0){
       return (660/targetQty).toFixed(1)+" 分钟";
    }
    return "0 分钟";
}
function formatStepTIme(_fs){
    if(_fs && _fs!=''){
        let nfs=_fs+'';
        let fgcharIndex=nfs.indexOf('.');
        if(fgcharIndex>-1){
            let scenum=parseFloat("0"+nfs.substring(fgcharIndex,(nfs.length-1)));
            scenum=parseInt(scenum*60);    
            return nfs.substring(0,fgcharIndex)+'分'+scenum+'秒';
        }else{
            return nfs+'分0秒';
        }
    }
    return '';
}
 
//定时切换
var sw_live_Change_timnum=switchnum;
function sw_live_Change(){
    var tindex = $("#SW_Live table").index($("table.sw_live_table.actived"))
    var total=$("#SW_Live table.sw_live_table").length;
    var _index=tindex+1;
    if(_index>=total){
        _index=0;
    }
 
    $("#SW_Live table.sw_live_table").eq(tindex).removeClass("actived");
    $("#SW_Live table.sw_live_table").eq(_index).addClass("actived");   
    setTimeout(sw_live_Change,sw_live_Change_timnum);
}
 
 
//2.5.1.图表初始化
function initFTT_Chart(_contairID,_title,_xdata,_ydata,_type,minheight){
    if(_type && _type!=""){}else{
        _type="line";
    } 
    var sdata=formatFTTData(_xdata,_ydata,_type);

   return Highcharts.chart(_contairID, {
        chart: {
            type:_type,
            height:minheight,
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
                    color: '#000000',
                    fontSize:'2em'
			    },
                useHTML:true
            }
        },
        yAxis:{
            title:{
                text: "",
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
            min:80,
            max:100
        },
        plotOptions:{
            series:{
                dataLabels:{
                    enabled:true,
                    format:"{y} %",
                    style: {
                        color: '#20b879', 
                        fontSize:'3em'
                    },
                    y:-15
                },
                lineWidth:5,
                color:'#20b879',
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
            // itemStyle:{
            //     "color": "#333333",
            //     "cursor": "pointer", 
            //     "fontSize": "2em", 
            //     "fontWeight": "bold" 
            // },
            // margin:30
        },
        series: [{
            name: 'FTT达成',
            data:sdata
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
function formatFTTData(_xdata,_ydata,_type){
    var seriesdata=[];
    var tcolor='#20b879';
    for(var i=0;i<_ydata.length;i++){
        tcolor='#20b879';
        if(_ydata[i]>90){
            tcolor='#e53333';
        }
        seriesdata.push({
            x:i,
            y:_ydata[i],
            color:tcolor,
            dataLabels:{
                style: {
                    color:tcolor, 
                    fontSize:'3em'
                },
            }
        });
        if(_type!="column"){
            seriesdata[i].marker={fillColor:tcolor}
        }
    }
    return seriesdata;
}

function getlineName(lineCode){
    var lineName="";
    for(var i=0;i<sys_lines.length;i++){
        if(sys_lines[i].LineCode==lineCode){
            lineName=sys_lines[i].LineName;
            break;
        }
    }
    return lineName;
}
//endregion 数据处理--end
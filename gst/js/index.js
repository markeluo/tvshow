var styleStepData={
    styleinfo:{
        ksbh:'AWDQB71',//款号
        kslx:'卫衣',//款式名称
        mbtc:'68',//目标台产
        mbxl:'100%',//目标效率
        ddsl:'10565',//订单量
        gstgs:'9.2',//GST工时
        jpsj:'',//节拍时间(为空，无数据)
        rs:'',//班组人数(空,无数据)
        styleimg:'img/nostyleimg.jpg',//款式图片
    },
    groupdata:[
        {groupNo:'1',groupName:'领',steps:[{stepno:'1',stepname:'合罗纹领/压线/翻/走线一段*1',sj:'0.34',jq:'平车'}]},
        {groupNo:'2',groupName:'袖',steps:[{stepno:'2',stepname:'合罗纹领/压线/翻/走线一段*2',sj:'1.06',jq:'平车'}]},
        {groupNo:'3',groupName:'前幅',steps:[{stepno:'3',stepname:'落样点前胸章位',sj:'0.25',jq:'手工'},{stepno:'4',stepname:'车前胸章四周*1',sj:0.56,jq:'平车'}]},
        {groupNo:'4',groupName:'后幅',steps:[{stepno:'5',stepname:'合罗纹领/压线/翻/走线一段*1',sj:'0.55',jq:'平车'}]},
        {groupNo:'5',groupName:'组装',steps:[
            {stepno:'6',stepname:'纳膊连清剪（连松膊带）*2',sj:'0.57',jq:'四线车'},
            {stepno:'7',stepname:'及上罗纹领*1',sj:'0.64',jq:'四线车'},
            {stepno:'8',stepname:'拉后领捆捆条	(点位/松)',sj:'0.48',jq:'平车'},
            {stepno:'9',stepname:'压后领捆单明线/清剪/折两端/落主唛',sj:'0.65',jq:'平车'},
            {stepno:'10',stepname:'压前领单明线',sj:'0.38',jq:'坎车'},
            {stepno:'11',stepname:'及上袖*2',sj:'0.85',jq:'四线车'},
            {stepno:'12',stepname:'合侧缝一段*1',sj:'0.30',jq:'四线车'},
            {stepno:'13',stepname:'四线埋夹*2',sj:'0.80',jq:'四线车'},
            {stepno:'14',stepname:'剪落洗水/压线*1',sj:'0.37',jq:'平车'},
            {stepno:'15',stepname:'及上罗纹袖口*2',sj:'0.79',jq:'四线车'},
            {stepno:'16',stepname:'及上罗纹下脚一周',sj:'0.63',jq:'四线车'},
            {stepno:'17',stepname:'打枣',sj:'0.4',jq:'打枣车'},
    ]},
]}

function DataFormat(_serverdata){
    styleStepData.styleinfo.ksbh=_serverdata.StyleCode;
    styleStepData.styleinfo.kslx=_serverdata.StyleSpec;
    styleStepData.styleinfo.mbtc=_serverdata.PlannedQty;
    styleStepData.styleinfo.mbxl=_serverdata.PlannedKPI;
    styleStepData.styleinfo.ddsl=_serverdata.Qty;
    styleStepData.styleinfo.gstgs=_serverdata.GSTTotalFS;
    if(_serverdata.PhotoBase64 && _serverdata.PhotoBase64!=''){
        styleStepData.styleinfo.styleimg=_serverdata.PhotoBase64;
    }

    //工序数据组织
    var groupKeys=[];
    styleStepData.groupdata=[];
    var tempIndex=-1;
    if(_serverdata.Items!=null && _serverdata.Items.length>0){
        _serverdata.Items.forEach(element => {
            //PartSortID,PartName,SN,StepName,JQName,TotalFS
            tempIndex=groupKeys.indexOf(element.PartSortID);
            if(tempIndex>-1){
                styleStepData.groupdata[tempIndex].steps.push({
                    stepno:element.SN,
                    stepname:element.StepName,
                    sj:element.TotalFS,
                    jq:element.JQName
                })
            }else{
                groupKeys.push(element.PartSortID);
                styleStepData.groupdata.push({
                    groupNo:element.PartSortID,
                    groupName:element.PartName,
                    steps:[{
                        stepno:element.SN,
                        stepname:element.StepName,
                        sj:element.TotalFS,
                        jq:element.JQName
                    }]
                }); 
            }
        });
    }
    return styleStepData;
}

/**
*解析获取页面URL参数
**/
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
 
function InitData(_data){
    //1.初始化分组表格
    var htmlContent='';
    var _grdata=_data.groupdata;
    for(var i=0;i<_grdata.length;i++){
        htmlContent+='<div class="group_item">';
            htmlContent+='<div class="group_node">';
                htmlContent+='<div class="top_grpname"><div class="grpname_txt">'+_grdata[i].groupName+'</div></div>';
                htmlContent+='<div class="bottom_img"><div class="img_sanjiao"></div><div class="group_num">'+_grdata[i].groupNo+'</div></div>';
            htmlContent+='</div>';
            //2.加载分组下的工序列表
            htmlContent+=getstepsHtml(_grdata[i]);
        htmlContent+='</div>';
    }
    $('#style_steps').html(htmlContent);

    //2.初始化款式信息
    $("#ksbh").html(_data.styleinfo.ksbh);
    $("#kslx").html(_data.styleinfo.kslx);
    $("#gstgs").html(_data.styleinfo.gstgs);

    // $("#mbtc").html(_data.styleinfo.mbtc);
    // $("#mbxl").html(_data.styleinfo.mbxl);
    // $("#ddsl").html(_data.styleinfo.ddsl);
    // $("#jpsj").html(_data.styleinfo.jpsj);
    // $("#rs").html(_data.styleinfo.rs);
    $("#style_img").attr("src",_data.styleinfo.styleimg);

    //3.加载设备需求表
    reloadSBXQ(_data);
}
function getstepsHtml(_groupData){
    var stepNodeHtml='';
    if(_groupData.steps && _groupData.steps.length>0){
        for(var i=0;i<_groupData.steps.length;i++){
            stepNodeHtml+='<div class="step_item">';
                stepNodeHtml+='<div class="step_top"><div class="top_line"></div><div class="top_jt"></div></div>';
                stepNodeHtml+='<div class="step_bottom">';
                    if(i<(_groupData.steps.length-1)){
                        stepNodeHtml+='<div class="left_img"><div class="squar">'+_groupData.steps[i].stepno+'</div><div class="top_line"></div></div>';
                    }else{
                        stepNodeHtml+='<div class="left_img"><div class="squar">'+_groupData.steps[i].stepno+'</div></div>';
                    }
                    stepNodeHtml+='<div class="right_txt">';
                        stepNodeHtml+='<div class="stepname"><span>'+_groupData.steps[i].stepname+'</span></div>';
                        stepNodeHtml+='<div class="stepsj">工时：<span>'+_groupData.steps[i].sj+'</span></div>';
                        stepNodeHtml+='<div class="stepjq">机器：<span>'+_groupData.steps[i].jq+'</span></div>';
                    stepNodeHtml+='</div>';
                stepNodeHtml+='</div>';
            stepNodeHtml+='</div>';
        }
    }
    return stepNodeHtml;
}
var sbxqList=[];
function reloadSBXQ(_data){
    var sblist="";
    var sbtypes=[];
    sbxqList=[];
    var tempIndex=-1;
    _data.groupdata.forEach(element => {
        if(element.steps && element.steps.length>0){
            element.steps.forEach(step => {
                tempIndex=sbtypes.indexOf(step.jq);
                if(tempIndex<0){
                    sbtypes.push(step.jq);
                    sbxqList.push({'jq':step.jq,'num':step.sj});  
                }else{
                    sbxqList[tempIndex].num=sbxqList[tempIndex].num+1;
                }
            });
        }
    });

    if(sbxqList && sbxqList.length>0){
        sbxqList.forEach(element => {
            sblist+='<tr><td>'+element.jq+'</td><td>'+element.num.toFixed(2)+'</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
        });
        $("#sbxq_table .sbxq tbody").html(sblist);
    }

    //计算位置
    var position=$("#style_steps").offset().top+$("#style_steps").height();
    //var topNum=position-$(".style_other").height();
    $(".style_other").css({"top":(position+20)+"px"});
}

$(document.body).ready(function(){
    var pagepars=getQueryObject();
    if(pagepars && pagepars.id>0){
        DAL.GetGSTData(pagepars.id,function(_rlt){
            if(_rlt.code==200){//数据获取成功
                //执行数据转换
                styleStepData=DataFormat(_rlt.data);
                //加载数据
                InitData(styleStepData);
            }else{
                alert('获取GST数据失败,无法加载报表!');
            }
        }); 
    }else{
        alert('参数错误,无法加载!');
    }
})

function renshuchange(){ 
    reCalc_JPSJ();
    reCalc_DeviceReqTable();
}
function taichanchange(){ 
    reCalc_JPSJ();
}
//计算节拍时间
function reCalc_JPSJ(){
    var _renshu=$("#rs_input").val();
    var _taichan=$("#tc_input").val();
    if(_renshu && _renshu>0 && _taichan && _taichan>0){
        var _tmpval=(600/parseInt(_renshu)/parseFloat(_taichan)).toFixed(2);
        $("#jpsj").html(_tmpval);
    }else{
        $("#jpsj").html("");
    }
}
//根据班组人数和GST时间重新计算设备需求表中的理论台数
function reCalc_DeviceReqTable(){
    var _renshu=$("#rs_input").val();
    if(_renshu && _renshu>0){
        _renshu=parseInt(_renshu);
        
        var sblist="";
        if(sbxqList && sbxqList.length>0){
            var _gstval=styleStepData.styleinfo.gstgs;
            sbxqList.forEach(element => {
                sblist+='<tr><td>'+element.jq+'</td><td>'+element.num.toFixed(2)+'</td><td>'+(element.num/_gstval*_renshu).toFixed(2)+'</td><td></td><td></td><td></td><td></td><td></td></tr>';
            });
            
            $("#sbxq_table .sbxq tbody").html(sblist);
            //计算位置
            var position=$("#style_steps").offset().top+$("#style_steps").height();
            //var topNum=position-$(".style_other").height();
            $(".style_other").css({"top":(position+20)+"px"});
        }
    }
}

function print_report(){
    $(".page_menu").hide();
    $(".styleinfo .table_input").addClass("print");
    window.print();
    $(".page_menu").show();
    $(".styleinfo .table_input").removeClass("print");
}
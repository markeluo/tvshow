/*
数据访问处理
*/
(function(window){
    var u={
        serverpth:'http://172.18.8.5:5000/api/mes/',
        //serverpth:'http://localhost:5000/api/mes/',
    }
    u._get=function(url,para,callfun){
        $.getJSON(u.serverpth+url,function(data,status){
            var _result={
                code:500,
                data:null,
                msg:""
            }
            if(status=="success"){
                _result.code=200;
                _result.msg="获取数据成功!";
                _result.data=data;
            }
            callfun(_result);
        });
    } 
    //1.获取目标和待完成数据
    u.GetTarget=function(_linecode,_call){
        u._get("TV/mbwc/"+_linecode,null,function(_rtl){
            _call(_rtl);
        });

        // //测试数据
        // var data={
        //     code:200,
        //     data:{
        //         TargetQty:200,
        //         PassQty:120
        //     },
        //     msg:""
        // }
        // _call(data);
    }

    //2.
    u.GetStyleMarkers=function(_linecode,_call){
        u._get("TV/gzt/"+_linecode,null,function(_rtl){
            _call(_rtl);
        });
        // var data={code:200,data:[{
        //         FactoryName:"一车间",
        //         LineCode:"CJM1F01",
        //         LineName:"一组",
        //         StyleNo:"5517666",
        //         CPO:"CPO1144512254",
        //         ImgCode:"1001",
        //         ImgName:"kouzhao.jpg",
        //         DefectCode:204,
        //         Name:"车线不到位",
        //         DefectGroupName:"制作不良",
        //         PositionX:0.221789883268482,
        //         PositionY:0.292110874200426
        //     }, {
        //         FactoryName:"一车间",
        //         LineCode:"CJM1F01",
        //         LineName:"一组",
        //         StyleNo:"5517666",
        //         CPO:"CPO1144512254",
        //         ImgCode:"1001",
        //         ImgName:"kouzhao.jpg",
        //         DefectCode:109,
        //         Name:"拼合色差",
        //         DefectGroupName:"布料不良",
        //         PositionX:0.140077821011673,
        //         PositionY:0.304904051172708
        //     }],
        //     msg:""
        // };
        // _call(data);
    }

    //3.
    u.GetFTTRate=function(_linecode,_call){
        u._get("TV/ftt/"+_linecode,null,function(_rtl){
            _call(_rtl);
        });
        // var data={code:200,data:{
        //     FTTQty:75
        // },msg:""};
        // _call(data);
    }

    //4.
    u.GetDefRate=function(_linecode,_call){
        u._get("TV/xcp/"+_linecode,null,function(_rtl){
            _call(_rtl);
        });
        // var data={code:200,data:{
        //     DefRate:9
        // },msg:""};
        // _call(data);
    }

    //5.
    u.GetFTTHistory=function(_linecode,_call){
        u._get("TV/fttls/"+_linecode,null,function(_rtl){
            _call(_rtl);
        });
        // var FTT_data=[
        //     {NM:"03/23##周1",FTT_RT:"78",TYP:"DAY"},
        //     {NM:"03/24##周2",FTT_RT:"80",TYP:"DAY"},
        //     {NM:"03/25##周3",FTT_RT:"75",TYP:"DAY"},
        //     {NM:"03/26##周4",FTT_RT:"82",TYP:"DAY"},
        //     {NM:"03/27##周5",FTT_RT:"80",TYP:"DAY"},
        //     {NM:"03/28##周6",FTT_RT:"75",TYP:"DAY"},
        //     {NM:"第9周",FTT_RT:"87",TYP:"WEEK"},
        //     {NM:"第10周",FTT_RT:"90",TYP:"WEEK"},
        //     {NM:"第11周",FTT_RT:"85",TYP:"WEEK"},
        //     {NM:"第12周",FTT_RT:"80",TYP:"WEEK"},
        //     {NM:"第13周",FTT_RT:"89",TYP:"WEEK"},
        //     {NM:"1月",FTT_RT:"89",TYP:"MONTH"},
        //     {NM:"2月",FTT_RT:"90",TYP:"MONTH"},
        //     {NM:"3月",FTT_RT:"75",TYP:"MONTH"},
        // ];
        // var data={code:200,data:FTT_data,msg:""};
        // _call(data);
    }
    //8.车缝班组产量目标与达成
    u.GetSWLive=function(_linecode,_call){
        u._get("TV/swlive/"+_linecode,null,function(_rtl){
            _call(_rtl);
        });
        // var FTT_data=[
        //     {NM:"03/23##周1",FTT_RT:"78",TYP:"DAY"},
        //     {NM:"03/24##周2",FTT_RT:"80",TYP:"DAY"},
        //     {NM:"03/25##周3",FTT_RT:"75",TYP:"DAY"},
        //     {NM:"03/26##周4",FTT_RT:"82",TYP:"DAY"},
        //     {NM:"03/27##周5",FTT_RT:"80",TYP:"DAY"},
        //     {NM:"03/28##周6",FTT_RT:"75",TYP:"DAY"},
        //     {NM:"第9周",FTT_RT:"87",TYP:"WEEK"},
        //     {NM:"第10周",FTT_RT:"90",TYP:"WEEK"},
        //     {NM:"第11周",FTT_RT:"85",TYP:"WEEK"},
        //     {NM:"第12周",FTT_RT:"80",TYP:"WEEK"},
        //     {NM:"第13周",FTT_RT:"89",TYP:"WEEK"},
        //     {NM:"1月",FTT_RT:"89",TYP:"MONTH"},
        //     {NM:"2月",FTT_RT:"90",TYP:"MONTH"},
        //     {NM:"3月",FTT_RT:"75",TYP:"MONTH"},
        // ];
        // var data={code:200,data:FTT_data,msg:""};
        // _call(data);
    }
    //9.车缝班组工序平衡图数据
    u.GetStepDiagram=function(_linecode,_call){
        u._get("TV/stepdiagram/"+_linecode,null,function(_rtl){
            _call(_rtl);
        });
        //var data=[
        // {
        //     "UserCode": "600018",
        //     "UserName": "李艳梅",
        //     "LineName": "一车间 12组",
        //     "StepCounter": 3,
        //     "TotalFS": 1.6603
        // },
        // {
        //     "UserCode": "600036",
        //     "UserName": "王爱丽",
        //     "LineName": "一车间 12组",
        //     "StepCounter": 1,
        //     "TotalFS": 2.4611
        // }]
    }

    /**
     * 9.获取班组信息
     * @param {*} _lineCode 班组代码 
     * @param {*} _call 回调处理函数
     */
    u.GetLineInfo=function(_lineCode,_call){
        u._get("Line/info/"+_lineCode,null,function(_rtl){
            _call(_rtl);
        });
    }

    /**
     * 10.获取今日裁床统计数据
     * @param {*} _lineCode 班组代码
     * @param {*} _call 回调函数
     */
    u.GetCutTodayTotal=function(_lineCode,_call){
        u._get("TV/cut/todaytotal/"+_lineCode,null,function(_rtl){
            _call(_rtl);
        });
    }

    /**
     * 11.获取本周裁床款式疵点统计数据
     * @param {*} _lineCode 班组代码
     * @param {*} _call 回调函数
     */
     u.GetCutWeekTotal=function(_lineCode,_call){
        u._get("TV/cut/weektotal/"+_lineCode,null,function(_rtl){
            _call(_rtl);
        });
     }

     /**
     * 12.获取30天统计历史数据
     * @param {*} _lineCode 班组代码
     * @param {*} _call 回调函数
     */
      u.GetCutDayHistory=function(_lineCode,_call){
        u._get("TV/cut/dayhistory/"+_lineCode,null,function(_rtl){
            _call(_rtl);
        });
      }

      /**
       * 13.获取每月统计历史数据
       * @param {*} _lineCode 
       * @param {*} _call 
       */
       u.GetCutMonthHistory=function(_lineCode,_call){
        u._get("TV/cut/monthhistory/"+_lineCode,null,function(_rtl){
            _call(_rtl);
        });
       }

    window.DAL= u;
  })(window);
  
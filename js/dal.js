/*
数据访问处理
*/
(function(window){
    var u={} 
    //1.获取目标和待完成数据
    u.GetTarget=function(_linecode,_call){
        //测试数据
        var data={
            code:200,
            data:null,
            msg:""
        }
        _call(data);
    }

    //2.
    u.GetStyleMarkers=function(_linecode,_call){
      var data={code:200,data:null,msg:""};
      _call(data);
    }

    //3.
    u.GetFTTRate=function(_linecode,_call){
        var data={code:200,data:null,msg:""};
        _call(data);
    }

    //4.
    u.GetDefRate=function(_linecode,_call){
        var data={code:200,data:null,msg:""};
        _call(data);
    }

    //5.
    u.GetFTTHistory=function(_linecode,_call){
        var FTT_data=[
            {NM:"03/23##周1",FTT_RT:"78",TYP:"DAY"},
            {NM:"03/24##周2",FTT_RT:"80",TYP:"DAY"},
            {NM:"03/25##周3",FTT_RT:"75",TYP:"DAY"},
            {NM:"03/26##周4",FTT_RT:"82",TYP:"DAY"},
            {NM:"03/27##周5",FTT_RT:"80",TYP:"DAY"},
            {NM:"03/28##周6",FTT_RT:"75",TYP:"DAY"},
            {NM:"第9周",FTT_RT:"87",TYP:"WEEK"},
            {NM:"第10周",FTT_RT:"90",TYP:"WEEK"},
            {NM:"第11周",FTT_RT:"85",TYP:"WEEK"},
            {NM:"第12周",FTT_RT:"80",TYP:"WEEK"},
            {NM:"第13周",FTT_RT:"89",TYP:"WEEK"},
            {NM:"1月",FTT_RT:"89",TYP:"MONTH"},
            {NM:"2月",FTT_RT:"90",TYP:"MONTH"},
            {NM:"3月",FTT_RT:"75",TYP:"MONTH"},
        ];
        var data={code:200,data:FTT_data,msg:""};
        _call(data);
    }

    window.DAL= u;
  })(window);
  
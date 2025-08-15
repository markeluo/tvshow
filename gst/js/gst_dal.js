/*
数据访问处理
*/
(function(window){
    var u={
        serverpth:'http://172.18.8.1:5000/api/mes/',
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
    u.GetGSTData=function(_id,_call){
        u._get("TV/gst/"+_id,null,function(_rtl){
            _call(_rtl);
        });
    }
    window.DAL= u;
  })(window);
  
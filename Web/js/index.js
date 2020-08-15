$(document.body).ready(function(){ 
    InitCharts();
})
 
function InitCharts(){
    _initchart1('container1','订单出货百分比',[{
        name: '',
        colorByPoint: true,
        data: [{
            name: '已完成',
            y: 61.41,
            color:'#1dbe87',
            sliced: true,
            selected: true
        }, {
            name: '待完成',
            y: 11.84,
            color:'#f18f8e'
        }]
    }]);

    _initchart2('container2','车间产量与疵品率',[
        {name:'一车间1组',qty:1400,defrat:9},
        {name:'一车间5组',qty:1200,defrat:8},
        {name:'一厂7组',qty:2800,defrat:8},
        {name:'二厂2组',qty:1900,defrat:7},
        {name:'二厂3组',qty:2000,defrat:9},
    ]);
}

function _initchart1(_container,_title,data){
    Highcharts.chart(_container, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            height:300
        },
        credits:{
            enabled:false
        },
        title: {
            text:_title
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series:data
    });
}
function _initchart2(_container,_title,_data){
    var xvalues=[];
    var series=[{name:'车间产量',type:'column',yAxis:0,data:[]},{name:'疵品率',yAxis:1,data:[]}]
    for(var i=0;i<_data.length;i++){
        xvalues.push(_data[i].name);
        series[0].data.push(_data[i].qty);
        series[1].data.push(_data[i].defrat);
    }

    Highcharts.chart(_container, {
       chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false, 
            height:300
        },
        credits:{
            enabled:false
        },
        colors: ['#1dbe87','#f18f8e'],
        title: {
            text: _title
        },
        xAxis:{
            categories:xvalues
        },
        yAxis: [{ 
            title: {
                text: '产量(件)'
            }
        }, 
        { 
            opposite: true,
            title: {
                text:'疵品率'
            }
        }],
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            series: {
                dataLabels: {
                    align: 'left',
                    enabled: true
                }
            },
            column: {
                borderRadius: 5
            },
            line:{
                dataLabels: {
                    format:'{y}%',
                    color:'#097ca6'
                }
            }
        },
        series:series
    });
}
 
  
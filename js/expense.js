function getExpenseHistory(pageNo){
    var access_token=getAccessToken1();
    var pageSize=5;
    var totalPage;
    $.ajax({
        url:'http://127.0.0.1:8083/api/getHistoryExpense/'+pageNo+'/'+pageSize,
        method:'get',
        headers: {'Authorization':access_token},
        async:false,
        success:function(data){
            totalPage=data.totalPage;
            $(".oldTr").remove();
            $.each(data.result,function(i,item){
                addRow(data.result[i].expenseDate,data.result[i].waterCount,
                        data.result[i].waterPrice,data.result[i].elecCount,
                        data.result[i].elecPrice);
            });
            setEchart(data);
        },
        error:function(jqXHR,textStatus,errorThrown){
            if(jqXHR.status===401){
              refreshAccessToken();
              getExpenseHistory(pageNo);
            }
        }
    });
    return totalPage;
}

function setExpenseHistory(){
    var access_token=getAccessToken1();
    var formData=new FormData(document.getElementById('newData'));
    var jsonData={};
    formData.forEach(function(value,key){
        jsonData[key]=value;
    });
    var jsonObject=JSON.stringify(jsonData);
    $.ajax({
        url:'http://127.0.0.1:8083/api/setHistoryExpense',
        method:'post',
        headers: {'Authorization':access_token},
        data:jsonObject,
        async:false,
        contentType: "application/json",
        success:function(){
            alert('success');
        },
        error:function(jqXHR,textStatus,errorThrown){
            if(jqXHR.status==401){
              refreshAccessToken();
              setExpenseHistory();
            }else{
                alert(jqXHR.status);
            }
        }
    });
}

function addRow(date,water,waterPrice,electricity,elecPrice){
    var waterTotal=water*waterPrice;
    var elecTotal=electricity*elecPrice;
    var totalExpense=waterTotal+elecTotal;
    var trHtml='<tr class="oldTr">'
                +'<td name="date">'+date+'</td>'
                +'<td name="water">'+water+'</td>'
                +'<td name="waterTotal">'+waterTotal+'</td>'
                +'<td name="electricity">'+electricity+'</td>'
                +'<td name="elecTotal">'+elecTotal+'</td>'
                +'<td name="totalExpense">'+totalExpense+'</td>'
              +'</tr>'
    $('#historyTable').append(trHtml);
}

function addNewData(){
    setExpenseHistory();
    getExpenseHistory(1);
}

function setEchart(data){
    var myChart = echarts.init(document.getElementById('echartMain'));
    
    // 指定图表的配置项和数据
    var option = {
        title: data.addition.title,
        tooltip: {},
        toolbox: {
            show: true,
            right: '5%',
            feature: {
                dataView: {
                    readOnly: true              
                },
                magicType: {type: ['line', 'bar']}
            }
        },
        legend: data.addition.legend,
        xAxis: data.addition.xAxis,
        yAxis: {
            type:'value',
            axisLabel:{formatter:'{value}元'}
        },
        series:data.addition.series
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
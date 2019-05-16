function getExpenseHistory(pageNo){
    var access_token=getAccessToken1();
    var pageSize=10;
    var totalPage;
    $.ajax({
        url:serverAddr+'/api/getHistoryExpense/'+pageNo+'/'+pageSize,
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
            if(jqXHR.status===401 && refreshAccessToken()){
              totalPage=getExpenseHistory(pageNo);
            }else{
                console.log(jqXHR.status);
                console.log(textStatus);
                console.log(errorThrown);
            }
        }
    });
    return totalPage;
}

function setExpenseHistory(){
    var access_token=getAccessToken1();
    var jsonObject=getJsonformData('newData');
    $.ajax({
        url:serverAddr+'/api/setHistoryExpense',
        method:'post',
        headers: {'Authorization':access_token},
        data:jsonObject,
        async:false,
        contentType: "application/json",
        success:function(data){
            if(data.errorCode==1001){
                showMessageBox(data.errors);
            }else{
                getExpenseHistory(1);
            }
        },
        error:function(jqXHR,textStatus,errorThrown){
            if(jqXHR.status==401 && refreshAccessToken()){
              setExpenseHistory();
            }else{
                showMessageBox(jqXHR.responseJSON.errors);
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

//返回文件链接以此下载
// function getExcel(typeValue){
//     var access_token=getAccessToken1();
//     $.ajax({
//         url:serverAddr+'/api/getExcel/'+typeValue,
//         method:'get',
//         headers: {'Authorization':access_token},
//         success:function(data){
//             var index=data.result.lastIndexOf('\/');
//             var fileName=data.result.substring(index+1,data.result.length);
//             var a = document.createElement('a');
//             a.href = data.result;
//             a.download = fileName;
//             a.click();
//         },
//         error:function(jqXHR,textStatus,errorThrown){
//             if(jqXHR.status==401 && refreshAccessToken()){
//                 getExcel(typeValue);
//             }else{
//                 alert(jqXHR.status);
//             }
//         }
//     });
// }

//返回文件流以此下载
function getExcel(typeValue){
    var access_token=getAccessToken1();
    var url=serverAddr+'/api/getExcel/'+typeValue;
    var xhr=new XMLHttpRequest();
    xhr.open('get',url,true);
    xhr.responseType="blob";
    xhr.setRequestHeader('Authorization',access_token);
    xhr.onload=function(){
        if(this.status==200){
            var blob=this.response;
            var disposition=this.getResponseHeader("Content-Disposition");
            var start=disposition.indexOf('\"')+1;
            var end=disposition.lastIndexOf('"');
            var filename=disposition.substring(start,end);
            var a=document.createElement('a');
            a.href=window.URL.createObjectURL(blob);
            a.download=filename;
            $("body").append(a);
            a.click();
            window.URL.revokeObjectURL(a.href);
            $(a).remove();
        }
    };
    xhr.onerror=function(jqXHR,textStatus,errorThrown){
        if(jqXHR.status==401 && refreshAccessToken()){
            getExcel(typeValue);
        }else{
            alert(jqXHR.status);
        }
    }
    xhr.send();
}

// function importExcel(){
//     var access_token=getAccessToken1();
//     // var files = $('#importFile').prop('files');
//     // var formData = new FormData();
//     // formData.append('importFile', files[0]);
//     var formData=new FormData(document.getElementById('fileUploadForm'));
//     $.ajax({
//         url:serverAddr+'/api/importMeterData',
//         method:'POST',
//         data:formData,
//         headers: {'Authorization':access_token},
//         cache: false,
//         // 告诉jQuery不要去处理发送的数据
//         processData: false,
//         // 告诉jQuery不要去设置Content-Type请求头
//         contentType: false,
//         success:function(data){
//             if(data.errorCode===1001){
//                 var index=data.result.lastIndexOf('\/');
//                 var fileName=data.result.substring(index+1,data.result.length);
//                 var a = document.createElement('a');
//                 a.href = data.result;
//                 a.download = fileName;
//                 a.click();
//             }else{
//                 alert(data.result);
//                 getExpenseHistory(1);
//             }
//         },
//         error:function(jqXHR){
//             if(jqXHR.status==401 && refreshAccessToken()){
//                 importExcel();
//             }else{
//                 alert(jqXHR.status);
//             }
//         }
//     });
// }

function importExcel(){
    var access_token=getAccessToken1();
    var url=serverAddr+'/api/importMeterData';
    var xhr=new XMLHttpRequest();
    var formData=new FormData(document.getElementById('fileUploadForm'));
    xhr.open('post',url,true);
    // xhr.responseType="blob";
    xhr.responseType="arraybuffer";
    xhr.setRequestHeader('Authorization',access_token);
    xhr.onload=function(){
        if(this.status==409){
            var blob = new Blob([this.response]); 
            var disposition=this.getResponseHeader("Content-Disposition");
            var start=disposition.indexOf('\"')+1;
            var end=disposition.lastIndexOf('"');
            var filename=disposition.substring(start,end);
            var a=document.createElement('a');
            a.href=window.URL.createObjectURL(blob);
            a.download=filename;
            $("body").append(a);
            a.click();
            window.URL.revokeObjectURL(a.href);
            $(a).remove();
        }else if(this.status==200){
            var stringData = new TextDecoder("utf8").decode(this.response);
            var jsonData=JSON.parse(stringData);
            alert(jsonData.result);
            getExpenseHistory(1);
        }
    };
    xhr.onerror=function(jqXHR,textStatus,errorThrown){
        if(this.status==401 && refreshAccessToken()){
            importExcel();
        }else{
            alert(jqXHR.status);
        }
    }
    xhr.send(formData);
}
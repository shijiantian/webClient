var serverAddr='http://127.0.0.1:8083';
var serverIp='http://127.0.0.1';

function getJsonformData(formId){
    var formData=new FormData(document.getElementById(formId));
    var jsonData={};
    formData.forEach(function(value,key){
        jsonData[key]=value;
    });
    return JSON.stringify(jsonData);
}

function getAccessToken1(){
    var result=window.localStorage.getItem('access_type')+' '+window.localStorage.getItem('access_token');
    return result;
}
  
function getAccessToken2(){
    return window.localStorage.getItem('access_token');
}

function getRefreshToken(){
    return window.localStorage.getItem('refresh_token');
}
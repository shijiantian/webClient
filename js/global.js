var serverAddr='http://127.0.0.1:8083';
var serverIp='http://127.0.0.1';
var login_page='/webClient/login.html';

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

function refreshAccessToken(){
    var refresh_token=getRefreshToken();
    var result=false;
    $.ajax({
      async:false,
      type:'POST',
      url:serverAddr+'/oauth/token',
      data:{
        grant_type:'refresh_token',
        client_id:'myClient',
        client_secret:'mypassword',
        refresh_token:refresh_token
      },
      success:function(data){
        var access_type=data['token_type'];
        var access_token=data['access_token'];
        var refresh_token=data['refresh_token'];
        window.localStorage.setItem('access_token',access_token);
        window.localStorage.setItem('access_type',access_type);
        window.localStorage.setItem('refresh_token',refresh_token);
        result=true;
      },
      error:function(jqXHR,textStatus,errorThrown){
        window.location.href=serverIp+login_page;
      }
    });
    return result;
  }

function showMessageBox(errors){
    var len=errors.length;
    for(var i=0;i<len;i++){
        var inputElement = document.getElementById(errors[i].field);
        var Box = new MessageBox(inputElement, errors[i].field, errors[i].defaultMessage,0, 10); 
        Box.Show();
    }
}

function removeMsgBox(id){
    var inputElement = document.getElementById(id);
    var Box = new MessageBox(inputElement, id, ); 
    Box.Remove(true);
}
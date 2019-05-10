function getUsers(){
  var access_token=getAccessToken1();
  $.ajax({
    url: serverAddr+'/api/loginUser',
    type: 'GET',
    headers: {'Authorization':access_token},
    success:function(data){
      $('#userInfoLable').text(data.result);
    },
    error:function(jqXHR,textStatus,errorThrown){
      if(jqXHR.status==401){
        refreshAccessToken();
        getUsers();
      }
    }
  });
}

function comparePasswd(){
  var passwd=$("#password").val();
  var repeatPasswd=$("#repeatPasswd").val();
  if(passwd===repeatPasswd){
    $('#errorInfo').empty();
  }else{
    $('#errorInfo').empty().append("请重新确认密码！");
  }
}

function userRegister(){
  var passwd=$("#password").val();
  var repeatPasswd=$("#repeatPasswd").val();
  if(passwd===repeatPasswd){
    var jsonData=getJsonformData('formData');
    $.ajax({
      url:serverAddr+'/openapi/userRegister',
      data:jsonData,
      type:'POST',
      contentType: "application/json",
      success:function(data){
        alert(data.result);
      },
      error:function(jqXHR){

      }
    });
  }else{
    $('#errorInfo').empty().append("请重新确认密码！");
  }
}

function loginFunc(){
  var userName=$("#username").val();
  var passWord=$("#password").val();
  $.ajax({
      type:'POST',
      url:serverAddr+'/oauth/token',
      data:{
        grant_type:'password',
        username:userName,
        password:passWord,
        client_id:'myClient',
        client_secret:'mypassword'
      },
      success:function(data){
        var access_type=data['token_type'];
        var access_token=data['access_token'];
        var refresh_token=data['refresh_token'];
        window.localStorage.setItem('access_token',access_token);
        window.localStorage.setItem('access_type',access_type);
        window.localStorage.setItem('refresh_token',refresh_token);
        window.location.href='page/expense.html';
      },
      error:function(){
        alert("登录时发生错误!")
      }

  });
}

function refreshAccessToken(){
  var refresh_token=getRefreshToken();
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
    },
    error:function(jqXHR,textStatus,errorThrown){
      window.location.href='/webClient/login.html';
    }
  });
}

function logoutFunc(){
  var access_token=getAccessToken2();
  var refresh_token=getRefreshToken();
  var redirect_dir=serverIp+'/webClient/login.html';
  $.ajax({
    type:'POST',
    url:serverAddr+'/api/logout',
    headers: {'Authorization':getAccessToken1()},
    data:{
      refresh_token:refresh_token,
      redirect_dir:redirect_dir
    },
    complete:function(jqXHR){
      if(jqXHR.status===200){
        window.location.href=jqXHR.getResponseHeader("Location");
      }else{
        window.location.href=redirect_dir;
      }
    }
  });
}


function keyDown(event){
  //使用keyCode和which支持不同浏览器
  var keyValue = event.which || event.keyCode;
  if(keyValue===13){
    loginFunc();
  }
}
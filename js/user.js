function getUsers(){
  var access_token=getAccessToken1();
  $.ajax({
    url: 'http://127.0.0.1:8083/api/login',
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

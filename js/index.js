$("#login-button").click(function(event){
  event.preventDefault();
  $('form').fadeOut(500);
  $('.wrapper').addClass('form-success');
  setTimeout(function(){$('#authenticationLbl').fadeIn()}, 700);

  var inputs = $('input');
  var postData = {
    username: inputs.eq(0).val(),
    password: inputs.eq(1).val()
  }
  $.ajax({ 
    url: 'https://badbatchalertstaging.herokuapp.com/webadmin/receive',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify( postData ), 
    success: onLoginResponse,
    error: onError
  });

  function onLoginResponse(response) {
    setTimeout(function(){
      if (response.err != null) {
        $('.wrapper').removeClass('form-success');
        $('form').fadeIn(500);
        $('#loginFailedLbl').show();
        $('#authenticationLbl').hide();
      } else {
        window.location.href = "http://mike-legrand.com/bad_batch_alert_web_admin/adminPanel.html" + '?token=' + response.token;
      }
    }, 1500);
  };

  function onError() {
    cnsole.log("an unexpected error has ocurred");
    $('.wrapper').removeClass('form-success');
    $('form').fadeIn(500);
  }
});

function testDavon(){
 
    var postData = {
      regionNumbers:[1, 2]
    };

    $.ajax({ 
      url:'https://badbatchalertstaging.herokuapp.com/webadmin/getusersinregions',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify( postData ), 
      success: onTestDavonResponse,
      error: onDavonError
    });
  }

  function onTestDavonResponse(response) {
    console.log(response.userCount);
  };


  function onDavonError() {
    console.log("an unexpected error has occurred");
  }
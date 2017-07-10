var environment = 'staging';
var site = 'http://badbatchalert.com/admin/';

$("#login-button").click(function(event){
  event.preventDefault();
  $('form').fadeOut(500);
  $('.wrapper').addClass('form-success');

  setTimeout(function(){$('#authenticationLbl').fadeIn();}, 700);

  var inputs = $('input');
  var postData = {
    username: inputs.eq(0).val(),
    password: inputs.eq(1).val()
  };

  $.ajax({ 
    url: 'https://badbatchalert' + environment + '.herokuapp.com/webadmin/login',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify( postData ), 
    success: onLoginResponse,
    error: onError
  });

  function onLoginResponse(response) {
    setTimeout(function(){
      if (response.err !== null) {
        $('.wrapper').removeClass('form-success');
        $('form').fadeIn(500);
        $('#loginFailedLbl').show();
        $('#authenticationLbl').hide();
      } else {
        window.location.href = site + "adminPanel.html?token=" + response.token;
      }
    }, 1500);
  }

  function onError() {
    console.log("an unexpected error has ocurred");
    $('.wrapper').removeClass('form-success');
    $('form').fadeIn(500);
  }
});

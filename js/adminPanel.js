var _token;//auth token passed from server through url.

var _selectedRegions = [
  false, false, false, false, false, false, false, false, false
]

var _usersInRegions = [];
var _message;

var environment = 'staging';//'staging';


$( document ).ready(function() {
  var params = getQueryParams(location.search);
  console.log(JSON.stringify(params));
  _token = params.token;
  if (!_token) {
    window.location.href = "http://mike-legrand.com/bad_batch_alert_web_admin/index.html"
    return;
  }

  $('path').mouseover(onPathMouseover);
  $('path').mouseleave(onPathMouseleave);
  $('path').click(onPathClick);

  $.ajax({ 
      url:'https://badbatchalert' + environment + '.herokuapp.com/webadmin/getusersinregions',
      type: 'POST',
      contentType: 'application/json',
      data: '', 
      success: onGetUsersInRegionsResponse,
      error: onGetUsersInRegionsError
  });

  $('#sendButton').click(function() {
    showPopup("This will send a real alert to multiple people. Are you sure you wish to continue?", "SEND", function() {
      $('#sendButton').toggleClass('clicked');
      $('#sendButton').val("SENDING...");
      setTimeout(function(){
        $('#sendButton').toggleClass('clicked');
        $('#sendButton').val("SENT");
      }, 2000);
      sendMessage(_message, _selectedRegions, _token, false);
    },
    "CANCEL");
  });

  $('#testButton').click(function() {
    $('#testButton').toggleClass('clicked');
    $('#testButton').val("TESTING...");
    setTimeout(function() {
      $('#testButton').toggleClass('clicked');
      $('#testButton').val("TEST AGAIN");
    }, 2000);
    sendMessage(_message, _selectedRegions, _token, true);
  });

});

function sendMessage(message, regions, authtoken, isTest) {

  console.log(message);
  var postData = {
    message:message,
    regions:regions,
    authtoken:authtoken
  }
  var successCallback = isTest ? onTestMessageSuccess : onSendMessageSuccess;
  $.ajax({ 
      url:'https://badbatchalert' + environment + '.herokuapp.com/webadmin/sendtestmessage',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(postData), 
      success: successCallback,
      error: onMessageError
  });
}


function onTestMessageSuccess(response) {
  if (response.err === "notLoggedIn") {
    console.log("Login expired");
    showPopup("Your login has expired. You must re-log in to continue.", "LOGIN", function() {
      window.location.href = "http://mike-legrand.com/bad_batch_alert_web_admin/index.html";
    });
  } else {
    console.log("Message Successfully Sent.");
    showPopup("A sample message was sent to your phone number", "OK");
  }
}

function onSendMessageSuccess(response) {
  if (response.err === "notLoggedIn") {
    console.log("Login expired");
    showPopup("Your login has expired. You must re-log in to continue.", "LOGIN", function() {
      window.location.href = "http://mike-legrand.com/bad_batch_alert_web_admin/index.html";
    });
  } else {
    console.log("Message Successfully Sent.");
    window.location.href = "http://mike-legrand.com/bad_batch_alert_web_admin/success.html";
  }
}

function onMessageError() {
  console.log("an unexpected error has occurred getting users in regions");
}


function onGetUsersInRegionsResponse(response) {
  console.log(response.userCounts);
  _usersInRegions = response.userCounts;
};


function onGetUsersInRegionsError() {
  console.log("an unexpected error has occurred getting users in regions");
}

function getQueryParams(qs) {
  qs = qs.split('+').join(' ');

  var params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}

function onPathMouseover()
{
  $('.mapImage').addClass('highlight');
}

function onPathMouseleave()
{
  $('.mapImage').removeClass('highlight');
}

function onPathClick()
{

  var index = undefined;
  var paths = $('path');
  for (var i = 0; i < paths.length; i++) {
    if (paths[i] == this) {
      index = i; 
      break;
    }
  }
  var mapMarker = $('.map-marker').eq(index);

  var classes = this.getAttribute('class');
  turnOff = (classes.indexOf('selected') !== -1);
  if (turnOff) {
    classes = classes.replace('selected', ''); 
    mapMarker.hide();
    _selectedRegions[index] = false;
  } else {
    classes = classes + ' selected';
    mapMarker.show();
    _selectedRegions[index] = true;
  }

  var summaryLabel = $('#summaryLabel');
  var totalUsers = 0;
  var regions = [];
  for (var i = 0; i < _usersInRegions.length; i++) {
    if (!_selectedRegions[i]) continue;
    
    totalUsers += _usersInRegions[i];
    regions.push(i+1); 

  }

  var regionsStr = regions.join(', ');
  summaryLabel.text("This alert will be sent to the " + totalUsers + " users registered in region(s) : " + regionsStr);

  $(this).attr("class", classes);
}

function showPopup(text, button1, callback1, button2, callback2) {
  if (button2) {
    $('.cd-popup #cancelButton').show();
  } else {
    $('.cd-popup #cancelButton').hide();
  }

  $('.cd-popup input')[0].value = button1;

  $('.cd-popup h2').text(text);
  $('.cd-popup').addClass('is-visible');
  $('.cd-popup').on('click', function(event) {
    if( $(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup')  || event.target.id == 'cancelButton') {
      event.preventDefault();
      $(this).removeClass('is-visible');
      if (callback2) {callback2();}
    }
    if(event.target.id == 'okButton') {
      event.preventDefault();
      $(this).removeClass('is-visible');
      if (callback1) {callback1();}
    }
  });

  $(document).keyup(function(event){
    if(event.which=='27'){
      $('.cd-popup').removeClass('is-visible');
      if (callback2) {callback2();}
    }
  });
}





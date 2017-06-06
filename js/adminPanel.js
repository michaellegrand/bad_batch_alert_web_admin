var _token;//auth token passed from server through url.

var _selecedRegions = [
  false, false, false, false, false, false, false, false, false
]

var _usersInRegions = [];
var _message;

var environment = 'live';//'staging';


$( document ).ready(function() {
  /*var params = getQueryParams(location.search);
  //console.log(JSON.stringify(params));
  _token = params.token;
  if (!_token) {
    window.location.href = "http://mike-legrand.com/bad_batch_alert_web_admin/index.html"
  }*/

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
    $('#sendButton').toggleClass('clicked');
    $('#sendButton').val("SENDING...");
    setTimeout(function(){
      $('#sendButton').toggleClass('clicked');
      $('#sendButton').val("SENT");
      window.location.href = "http://mike-legrand.com/bad_batch_alert_web_admin/success.html";
    }, 2000);
    sendMessage(_message, _selectedRegions);
  });

  $('#testButton').click(function() {
    $('#testButton').toggleClass('clicked');
    $('#testButton').val("TESTING...");
    setTimeout(function() {
      $('#testButton').toggleClass('clicked');
      $('#testButton').val("TEST AGAIN");
    }, 2000);
    sendMessage(_message, _selectedRegions);
  });

});

function sendMessage(message, regions) {
  var postData = {
    message:message,
    regions:regions
  }
  /*($.ajax({ 
      url:'https://badbatchalert' + environment + '.herokuapp.com/webadmin/sendTestMessage',
      type: 'POST',
      contentType: 'application/json',
      data: postData, 
      success: function(){},
      error: function(){}
  });*/
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
    _selecedRegions[index] = false;
  } else {
    classes = classes + ' selected';
    mapMarker.show();
    _selecedRegions[index] = true;
  }

  var summaryLabel = $('#summaryLabel');
  var totalUsers = 0;
  var regions = [];
  for (var i = 0; i < _usersInRegions.length; i++) {
    if (!_selecedRegions[i]) continue;
    
    totalUsers += _usersInRegions[i];
    regions.push(i+1); 

  }

  var regionsStr = regions.join(', ');
  summaryLabel.text("This alert will be sent to the " + totalUsers + " users registered in region(s) : " + regionsStr);

  $(this).attr("class", classes);
}



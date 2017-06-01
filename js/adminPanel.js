var _token;//auth token passed from server through url.

var _selecedRegions = [
  false, false, false, false, false, false, false, false, false
]

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

});

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
  } else {
    classes = classes + ' selected';
    mapMarker.show();
  }

  $(this).attr("class", classes);
}

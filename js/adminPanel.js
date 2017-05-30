var _token;//auth token passed from server through url.

$( document ).ready(function() {
  var params = getQueryParams(location.search);
  //console.log(JSON.stringify(params));
  _token = params.token;
  if (!_token) {
    window.location.href = "http://mike-legrand.com/bad_batch_alert_web_admin/index.html"
  }

  
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

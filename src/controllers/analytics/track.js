(function () {
  var img = new Image(),
    url = encodeURIComponent(document.location.href),
    title = encodeURIComponent(document.title),
    ref = encodeURIComponent(document.referrer);
  img.src =
    'http://127.0.0.1:8000/api/v1/track/gif?url=' +
    url +
    '&t=' +
    title +
    '&ref=' +
    ref;
})();

var currentPage = 1;
var endOfImages = false;

var searchFlickr = function () {
  if (endOfImages === true) {
    return; // Abort!
  }

  var query = $('#query').val();

  // All requests to the Flickr REST API are based off this URL.
  // The jsoncallback=? allows us to use JSONP, for more on which see Google.
  var flickrUrl = 'https://api.flickr.com/services/rest/?jsoncallback=?';

  $.getJSON(flickrUrl, {
    method: 'flickr.photos.search',
    api_key: '2f5ac274ecfac5a455f38745704ad084',
    text: query,
    format: 'json',
    per_page: 500,
    page: currentPage++
  }).done(processImages); // Our processImages callback displays the images on the page.
};

var throttledSearchFlickr = _.throttle(searchFlickr, 5000);

var processImages = function(result) {

  var photos = result.photos.photo; // Extract just the part of the data we care about.

  if (currentPage > result.photos.pages) {
    endOfImages = true;
  }

  _(photos).each(function (photo) {
    // Construct an image URL from the data Flickr returns for each photo:
    // via https://www.flickr.com/services/api/misc.urls.html
    var url = [
      'https://farm',
      photo.farm,
      '.staticflickr.com/',
      photo.server,
      '/',
      photo.id,
      '_',
      photo.secret,
      '_q.jpg'
    ].join('');

    // Append a new image to the page for the image URL.
    var $img = $('<img>').attr('src', url);
    $img.appendTo('#images');
  });
};

var bottomOfPage = function () {
  return $(document).height() - ($(window).scrollTop() + $(window).height()) < 400;
};

$(document).ready(function () {
  // Click to search:
  $('#search').on('click', searchFlickr);

  $('#query').on('change', function () {
    endOfImages = false;
    currentPage = 1; // Thanks Liam!
    $('#images').empty();
    searchFlickr();
  });

  $(window).on('scroll', function () {
    if (bottomOfPage()) {
      throttledSearchFlickr();
    }
  });
});

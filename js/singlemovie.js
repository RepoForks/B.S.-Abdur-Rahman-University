function successCB(data) {
    console.log("Success callback: " + data);
};

function errorCB(data) {
            console.log("Error callback: " + data);
    };

var movieId;
var moviePos;
var isSimilar = false;
var similarIds = new Array();

var BG_PREFIX = "https://image.tmdb.org/t/p/original";

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('?');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}

// Master function that calls every other function
function readData( ) {
    // var id = unescape(location.search.substring(1, location.search.length));
    // movieId = location.search.split('id=')[1];
    // console.log("\n"+movieId);

    movieId = getQueryVariable('id');
    moviePos = getQueryVariable('pos');
    // similarId = getQueryVariable('similar');
    // similarPos = getQueryVariable('spos');

// if(getQueryVariable('similar') && getQueryVariable('spos')) {
//   movieId = getQueryVariable('similar');
//   moviePos = getQueryVariable('spos');
// } else {
//   movieId = getQueryVariable('id');
//   moviePos = getQueryVariable('pos');
// }
    // similarId = getQueryVariable('similar');
    //
    // if(similarId!=0){
    //   movieId = similarId;
    // }

    console.log(movieId);
    console.log(moviePos);

  setHeaderInfo(moviePos,isSimilar);



        theMovieDb.movies.getById({"id":movieId},function(data){

          // console.log("\nData: " + data);


            var data= JSON.parse(data);

            // Getting movie genre here
            var genres=data.genres;
            var genreString="";
            // genres=genres[0];
            for(var i=0;i<genres.length;i++){
              // console.log("\nGenre: " + genres[i].name);
              if(i==genres.length-1){
                genreString += genres[i].name;
              } else {
              genreString += genres[i].name + ", ";
              }
            }
              $('#desc_genres').text(genreString);

              // Setting movie tagline
              $('#header_tagline').text(data.tagline);

              // Setting rating
              $('#desc_rating').text(data.vote_average + " / 10");


            theMovieDb.movies.getCredits({"id":movieId},function(data){
              // console.log("\n Cast Data: " + data);

              var cast=JSON.parse(data);
              var actors=[];
              // Just 5 cast members is enough
              for (var i=0; i<cast.cast.length / 2; i++) {
                // console.log("\n"+cast.cast[i].name);
                actors[i]=" "+cast.cast[i].name;
              }

              $("#desc_cast").text(""+actors+" and others.");

            },errorCB);


            theMovieDb.movies.getReviews({"id":movieId }, function(data) {
              console.log("\nReview full: " + data);

                var data= JSON.parse(data);
                 var results = data.results;
                 results = results[0];
                 var content=results.content;
                 content.replace('/\n/g','<br/>');

                // console.log("\nReview: " + content);

                $('#desc_review_maintxt').text(content);
                $('#review_author').text("Review by " + results.author);

            }, errorCB)

        },errorCB);

      getImagesForGallery();


      fetchSimilarMovies();

}


function getImagesForGallery(){

theMovieDb.movies.getImages({"id":movieId }, function(data){

// console.log(data);
var d = JSON.parse(data);

var backdrops = d.backdrops;
// console.log(backdrops[0].file_path);

var backdropCount = backdrops.length;
if(backdropCount > 5){
  backdropCount = 5;
}

for(var i=1;i<=backdropCount;i++) {
  setLink('gal_img_'+i,BG_PREFIX + backdrops[i].file_path);

}

}, errorCB);

}

function setLink(linkId,url) {

  console.log(linkId);
  console.log(url);

  var a = document.getElementById(linkId); //or grab it by tagname etc
  a.setAttribute("href", url);

  document.getElementById(linkId + "_src").src=url;

}



function setHeaderInfo(pos,isSimilar) {

if(isSimilar == true) {
  theMovieDb.movies.getNowPlaying({},function(data){
    //You can print data to logs to check JSON output
    // console.log("JSON Data: " + data);

    var data = JSON.parse(data);// parse it

   var results = data.results; // get the 'results'
   results = results[pos]; // get the movie result using moviePos

// // Use this to reference the HTML tag ID. Remember to prefix '#'
// $('#header_title').text(""+results.original_title);
// $('#review_title').text("Review: "+results.original_title);
// // $("#header_date").text(""+results.release_date);
var background = results.backdrop_path; // get the show background
 background = BG_PREFIX + background; // set the background url
// // console.log("header image: " + background);
//
// //  Upon changing CSS class background, its fit style needs to be re-applied (Possible bug?)
// $('.intro').css('background', 'url(' + background + ') no-repeat center center fixed');
// $('.intro').css('background-size', 'cover');
//
//   $('#review_caption').text(results.overview);
//   $('#desc_release_date').text(results.release_date);

setHeaderBackdrop(results,background);


  }, errorCB);

} else {

theMovieDb.movies.getById({"id":movieId }, function(data){

  console.log(data);

  var data = JSON.parse(data);// parse it

 var results = data; // get the 'results'
 var background = data.backdrop_path;
 background = BG_PREFIX + background; // set the background url


setHeaderBackdrop(results,background);

 console.log(data.original_title);

}, errorCB);

}

}


function setHeaderBackdrop(results,background) {

  // Use this to reference the HTML tag ID. Remember to prefix '#'
  $('#header_title').text(""+results.original_title);
  $('#review_title').text("Review: "+results.original_title);
  // $("#header_date").text(""+results.release_date);
  var background = results.backdrop_path; // get the show background
   background = BG_PREFIX + background; // set the background url
  // console.log("header image: " + background);

  //  Upon changing CSS class background, its fit style needs to be re-applied (Possible bug?)
  $('.intro').css('background', 'url(' + background + ') no-repeat center center fixed');
  $('.intro').css('background-size', 'cover');

    $('#review_caption').text(results.overview);
    $('#desc_release_date').text(results.release_date);


}

function fetchSimilarMovies() {

  theMovieDb.movies.getSimilarMovies({"id":movieId }, function(data){
    // console.log("\n Similar" + data);

  var data = JSON.parse(data);
  var results = data.results; // get the 'results'
  // results = results[0]; // We need only the 1st result

  var titleId = '#similar_title_';
  var descId = '#similar_descr_';
  var imgId = '#similar_img_';

  for(var i=0;i<=3;i++) {
    similarIds[i] = results[i].id;
    $(titleId+i).text(results[i].original_title);
    var bg =results[i].backdrop_path;
    bg = "https://image.tmdb.org/t/p/original" + bg;

    $(descId+i).text(results[i].overview.substring(0,160)+"...");
    $(imgId+i).attr("src", bg);
  }
  console.log(similarIds);

  }, errorCB)

}


function doReload(url,pos) {
  isSimilar=true
  var data;
    data=similarIds[pos];
    window.location.search= "?id=" + escape(data) + "?pos=" + escape(pos);
    // window.location.reload();
    // location.href = window.location.href + "?similar=" + escape(data);

}

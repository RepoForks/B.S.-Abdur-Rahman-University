function successCB(data) {
    console.log("Success callback: " + data);
};

function errorCB(data) {
            console.log("Error callback: " + data);
    };


var ids = new Array();

    // Used to get the latest movies running in theatre
    theMovieDb.movies.getNowPlaying({},function(data){
      //You can print data to logs to check JSON output
      console.log("JSON Data: " + data);

      var data = JSON.parse(data);// parse it

     var results = data.results; // get the 'results'
    console.log(results[0]);

// Use this to reference the HTML tag ID. Remember to prefix '#'
$("#header_title").text(""+results[0].original_title);

// $("#header_date").text(""+results.release_date);
var background = results[0].backdrop_path; // get the show background
   background = "https://image.tmdb.org/t/p/original" + background; // set the background url
// console.log("header image: " + background);

  //  Upon changing CSS class background, its fit style needs to be re-applied (Possible bug?)
  $('.intro').css('background', 'url('+background+') no-repeat center center fixed');
  $('.intro').css('background-size', 'cover');

// Passing header movie ID here to pass as URL parameter to review.html
ids[0]=results[0].id;
getMovieCast(ids[0]);

// Setting similar movies here
  getCardMovieDetails(results);



    }, errorCB);

    function getCardMovieDetails(results){

      var titleId = '#current_title_';
      var descId = '#current_descr_';
      var imgId = '#current_img_';

      for(var i=1;i<=3;i++) {
        ids[i]=results[i].id;

        $(titleId+i).text(results[i].original_title);
        var bg =results[i].backdrop_path
        bg = "https://image.tmdb.org/t/p/original" + bg;

        $(descId+i).text(results[i].overview.substring(0,160)+"...");
        $(imgId+i).attr("src", bg);
      }

    }


// Used to get particular movie information
    function getMovieCast(id) {
      // console.log("Movie id: " + id);
      theMovieDb.movies.getById({"id":id}, function(data){
        // console.log("Movie Info: " + data);

        var data= JSON.parse(data);

        theMovieDb.movies.getCredits({"id":id},function(data){
          // console.log("\nCredits: " + data);

          var cast=JSON.parse(data);
          var actors=[];
          // Just 5 cast members is enough
          for (var i=0; i<5; i++) {
            // console.log("\n"+cast.cast[i].name);
            actors[i]=" "+cast.cast[i].name;
          }

          $("#header_desc").text(""+actors+" and others.");

        },errorCB);

      }, errorCB)

    }

    function goNext(url,pos) {
      var data;
        data=ids[pos];
        location.href = url + "?id=" + escape(data) + "?pos=" + escape(pos);

    }

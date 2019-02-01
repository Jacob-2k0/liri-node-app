var env = require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var Spotify = require('node-spotify-api');
var moment = require('moment');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);

var song = process.argv[3];
var artist = process.argv[3];
var movie = process.argv[3];

if (process.argv[2] === "spotify-this-song") {
    spotifyCall(song);
} else if (process.argv[2] === "concert-this") {
    concert(artist);
} else if (process.argv[2] === "movie-this") {
    movieCall(movie);
} else if (process.argv[2] === "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var array = data.split(",");

        song = array[1];
        spotifyCall(song);
    });

} else {
    console.log("\nLiri: Sorry I don't understand that command.\n");
}

function spotifyCall(song) {

    spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var obj = JSON.stringify(data, null, 2);

        if (data.tracks.items[0].album.album_type === "album") {
            console.log("------------------------------------");
            console.log(data.tracks.items[0].album.artists[0].name);
            console.log(data.tracks.items[0].name);
            console.log(data.tracks.items[0].album.external_urls.spotify);
            console.log(data.tracks.items[0].album.name);
            console.log("------------------------------------");
        } else {
            console.log("------------------------------------");
            console.log(data.tracks.items[0].album.artists[0].name);
            console.log(data.tracks.items[0].name);
            console.log(data.tracks.items[0].album.external_urls.spotify);
            console.log(data.tracks.items[0].album.album_type);
            console.log("------------------------------------");
        }
    });

}

function movieCall(movie) {
    request('http://www.omdbapi.com/?apikey=trilogy&type=movie&r=json&t=' + movie, function (error, response, body) {

        var obj = JSON.parse(body);

        console.log("--------------------------------");
        console.log(obj.Title);
        console.log(obj.Year);
        console.log(obj.imdbRating);
        console.log(obj.Country);
        console.log(obj.Language);
        console.log(obj.Plot);
        console.log(obj.Actors);
        console.log("--------------------------------");
    });
}

function concert() {
    request('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp&limit=1', function (error, response, body) {

        if (body.length === 4) {
            console.log("No concerts found for the artist " + artist + ".");
        } else {
            var obj = JSON.parse(body);
            for (var i in obj) {
                var str = obj[i].datetime;
                var res = str.split("T");
                console.log("--------------------------------");
                console.log(obj[i].venue.name);
                console.log(obj[i].venue.city + ", " + obj[i].venue.country);
                console.log(moment(obj[i]).format('MM/DD/YYYY'));
                console.log("--------------------------------");
            }
        }
    });
}
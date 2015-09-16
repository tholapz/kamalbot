// https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token
var tinder = require('tinderjs');
var client = new tinder.TinderClient();
var _ = require('underscore');
var fs = require('fs'),
    request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream('./matches/'+filename)).on('close', callback);
  });
};

var pain_in_the_butt_token = process.argv[2];

var _message = "I'm flattered getting swiped right from you. From that first picture it looks like you have a great personality. I know this might sound a bit crazy but I'm actually looking for something meaningful. What are you hoping to find?\nLet's get together sometimes this week over a cup of boba tea and see if there's any connection? I'm not on tinder that much. Let's text? 424-236-1824";
client.authorize(
	pain_in_the_butt_token,
	'100009999468178',
	function () {
	var defaults = client.getDefaults();
    var recs_size = defaults.globals.recs_size;
    
    client.getRecommendations(recs_size, function(error, data){
    	if(error){
    		console.log('error getRecommendations ' + error);
        return;
    	}
      if(!data.results) {
        console.log('results: '+ JSON.stringify(data));
        return;
      }
      console.log('results count: ' + data.results.length)
      _.chain(data.results)
        .each(function(result) {
          var id = result._id;
          var name = result.name;
          // var imgUrl = result.photos[0].processedFiles[0].url;

          client.like(id, function(error, data) {
          	if(error) {
          		console.log('error like: ' + error);	
          	}
            if (data && data.matched) {
            	console.log('matched: '+id);
              client.sendMessage(id, _message);
            }
          });
        });
    });
  });
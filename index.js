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



var _message = "Hey there! I'm flattered getting swiped right from you 😉I personally think you're really cute 😆 This might sound a bit crazy but I'm actually looking for something meaningful. What are you hoping to find?\nLet's get together sometimes this week over a cup of boba tea and see if there's any connection? I'm not on tinder that much. Let's text? 424-236-1824";
client.authorize(
	'CAAGm0PX4ZCpsBABo1brV97dwJGgaTAfdlhzEMYFczV8ZB4lqP0i3caRvTZAJYC2TLEs47xLJXNZB5bh9wSZCPe6eTSxqZBGYpK7HJcgtvZCEfgpynPg0zDTk9Bry4bE2KEEhZB486sHxiTPfQp4xvhaXmZB3x03VqTRQZAaNWlZC4hLQFZAhWZCBZBoqbfZCrvhEEvlbw3eZAVgW3lh4GZBDhpbl3lI0ZB',
	'100009999468178',
	function () {
	var defaults = client.getDefaults();
    var recs_size = defaults.globals.recs_size;
    
    client.getRecommendations(recs_size, function(error, data){
    	if(error){
    		console.log('error getRecommendations ' + error);	
    	}
      _.chain(data.results)
        .each(function(result) {
          var id = result._id;
          var name = result.name;
          var imgUrl = result.photos[0].processedFiles[0].url;

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
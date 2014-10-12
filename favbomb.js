var Twit = require('twit');

var t = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var user_handle = process.env.USER_HANDLE;
var last_tweets = parseInt(process.env.TWEET_COUNT, 10);

console.log('Faving %s\'s last %s tweets', user_handle, last_tweets);

var fav = function (id, cb) {
  t.post('favorites/create', {
    id: id
  }, cb);
};

var tweets = function () {
  t.get('statuses/user_timeline', {
    count: last_tweets
  }, function (err, tweets) {
    if (err) {
      throw err;
    }

    var i;

    for (i = 0; i < tweets.length - 1; i++) {
      fav(tweets[i].id_str, function () {});
    }
  });
};

t.get('account/verify_credentials', function (err, user) {
  if (err) {
    console.error(err);
    throw err;
  }

  tweets();
});

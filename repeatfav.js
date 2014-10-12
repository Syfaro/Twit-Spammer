var Twit = require('twit');

var t = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var repeat = parseInt(process.env.REPEAT_COUNT, 10);
var status_id = process.env.TWEET_ID;

console.log('Repeatfav-ing %s %s times', status_id, repeat);

var done = 0;

var fav = function (id, cb) {
  t.post('favorites/create', {
    id: id
  }, cb);
};

var unfav = function (id, cb) {
  t.post('favorites/destroy', {
    id: id
  }, cb);
};

var group = function (id, cb) {
  console.log('Loop %s/%s', done, repeat);

  fav(id, function (err) {
    if (err) {
      console.log(err);
      throw err;
    }

    unfav(id, function (err) {
      if (err) {
        throw err;
      }

      cb();
    });
  });
};

var check = function () {
  if (done > repeat - 1) {
   return;
  }

  done++;

  group(status_id, check);
};

t.get('account/verify_credentials', function (err, user) {
  if (err) {
    console.error(err);
    throw err;
  }

  check();
});

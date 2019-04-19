var app = require('./new_server/app');
var config = require('./new_server/config/config');

// start server
var port = process.env.PORT || config.port;
app.listen(port, () => {
  console.log('App listening on port', port);
});

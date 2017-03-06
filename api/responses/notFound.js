module.exports = function(message, code, displayNotification) {

  this.res.status(200);
  this.res.jsonx({status: 404, message, code, displayNotification});

};

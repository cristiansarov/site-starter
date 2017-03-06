module.exports = function(message, code, displayNotification) {

  this.res.status(200);
  this.res.jsonx({status: 403, message, code, displayNotification});

};

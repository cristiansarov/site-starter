module.exports = function(message, code, displayNotification) {

  this.res.status(200);
  if(typeof message === 'object') {
    this.res.jsonx({status: 400, message: message.message, code: message.code});
  } else {
    this.res.jsonx({status: 400, message, code});
  }

};
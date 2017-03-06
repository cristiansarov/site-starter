module.exports = function(variableName, variable) {

  this.res.status(200);
  this.res.send(`var ${variableName} = ${JSON.stringify(variable)};`);

};

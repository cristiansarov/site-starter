const path = require('path');

module.exports = function () {
  this.cacheable();
  const issuerContext = this._module && this._module.issuer && this._module.issuer.context || this.options.context;
  const relativeUrl = issuerContext && path.relative(issuerContext, this.resourcePath).split(path.sep).join('/');
  const filename = relativeUrl && path.basename(relativeUrl);
  return 'module.exports = \'assets/'+filename+'\';';
};
module.exports.raw = true;
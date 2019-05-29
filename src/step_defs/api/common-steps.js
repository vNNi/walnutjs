var helperInfo = require('../../support/helpers/info');
var trest = require('../../support/api/client');

var commonapi = function () {
  /**
   * User prints the current body content (Req|Res)
   */
  this.Given(/^\(api\) user prints the current (REQUEST|RESPONSE) body content$/, function (type, callback) {
    var _this = this;
    var content = type === 'REQUEST' ? trest.requestContent : trest.response.raw_body;

    helperInfo.logInfoFormat('[{0}] content:\n{1}\n', [type, content]);
    _this.delayCallback(callback);
  });

  /**
   * Define a value for request headers [Accept, Content-Type]
   */
  this.Given(/^\(api\) user will send and accept (XML|JSON|HTML)$/, function (type) {
    var accept = 'application/json';
    var contentType = 'application/json';

    switch (type) {
      case 'XML':
        accept = 'application/xml';
        contentType = 'application/xml';
        break;

      case 'HTML':
        accept = 'text/html';
        contentType = 'application/x-www-form-urlencoded';
        break;

      default:
        break;
    }
    trest.addHeader('Accept', accept);
    trest.addHeader('Content-Type', contentType);
  });
};

module.exports = commonapi;

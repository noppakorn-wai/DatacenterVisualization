var readline = require("linebyline");
var HostSystemQuery = require('../model/vCenter/HostSystemQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------HostSystemQuery------");
      var results = [];
      var rl = readline(rootPath+'/HostSystemQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new HostSystemQuery(json));
      })
      .on('error', function(e) {
        console.log(e);
      })
    	.on('end', function(e) {
    		callback(null, results);
    	});
    }
  };
};

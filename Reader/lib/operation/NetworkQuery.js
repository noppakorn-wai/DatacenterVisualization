var readline = require("linebyline");
var NetworkQuery = require('../model/vCenter/NetworkQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------NetworkQuery------");
      var results = [];
      var rl = readline(rootPath+'/NetworkQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new NetworkQuery(json));
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

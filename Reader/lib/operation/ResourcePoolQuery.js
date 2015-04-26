var readline = require("linebyline");
var ResourcePoolQuery = require('../model/vCenter/ResourcePoolQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------ResourcePoolQuery------");
      var results = [];
      var rl = readline(rootPath+'/ResourcePoolQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new ResourcePoolQuery(json));
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

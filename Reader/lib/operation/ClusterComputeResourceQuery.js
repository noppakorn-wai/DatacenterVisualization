var readline = require("linebyline");
var ClusterComputeResourceQuery = require('../model/vCenter/ClusterComputeResourceQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------ClusterComputeResourceQuery------");
      var results = [];
      var rl = readline(rootPath+'/ClusterComputeResourceQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new ClusterComputeResourceQuery(json));
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

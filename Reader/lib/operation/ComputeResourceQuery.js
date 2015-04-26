var readline = require("linebyline");
var ComputeResourceQuery = require('../model/vCenter/ComputeResourceQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------ComputeResourceQuery------");
      var results = [];
      var rl = readline(rootPath+'/ComputeResourceQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new ComputeResourceQuery(json));
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

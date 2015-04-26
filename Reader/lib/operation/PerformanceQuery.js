var readline = require("linebyline");
var PerformanceQuery = require('../model/vCenter/PerformanceQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------PerformanceQuery------");
      var results = [];
      var rl = readline(rootPath+'/PerformanceQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        if(results.length===0)
          results.push(new PerformanceQuery(json));
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

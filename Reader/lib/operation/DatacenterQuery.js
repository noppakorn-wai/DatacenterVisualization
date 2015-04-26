var readline = require("linebyline");
var DatacenterQuery = require('../model/vCenter/DatacenterQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------DatacenterQuery------");
      var results = [];
      var rl = readline(rootPath+'/DatacenterQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new DatacenterQuery(json));
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

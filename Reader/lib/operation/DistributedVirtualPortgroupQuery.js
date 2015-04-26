var readline = require("linebyline");
var DistributedVirtualPortgroupQuery = require('../model/vCenter/DistributedVirtualPortgroupQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------DistributedVirtualPortgroupQuery------");
      var results = [];
      var rl = readline(rootPath+'/DistributedVirtualPortgroupQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new DistributedVirtualPortgroupQuery(json));
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

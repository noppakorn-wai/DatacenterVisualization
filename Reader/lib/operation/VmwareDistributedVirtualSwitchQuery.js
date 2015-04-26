var readline = require("linebyline");
var VmwareDistributedVirtualSwitchQuery = require('../model/vCenter/VmwareDistributedVirtualSwitchQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------VmwareDistributedVirtualSwitchQuery------");
      var results = [];
      var rl = readline(rootPath+'/VmwareDistributedVirtualSwitchQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new VmwareDistributedVirtualSwitchQuery(json));
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

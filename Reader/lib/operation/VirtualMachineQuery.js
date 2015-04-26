var readline = require("linebyline");
var VirtualMachineQuery = require('../model/vCenter/VirtualMachineQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------VirtualMachineQuery------");
      var results = [];
      var rl = readline(rootPath+'/VirtualMachineQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new VirtualMachineQuery(json));
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

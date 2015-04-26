var readline = require("linebyline");
var VirtualAppQuery = require('../model/vCenter/VirtualAppQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------VirtualAppQuery------");
      var results = [];
      var rl = readline(rootPath+'/VirtualAppQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new VirtualAppQuery(json));
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

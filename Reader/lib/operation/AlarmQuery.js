var readline = require("linebyline");
var AlarmQuery = require('../model/vCenter/AlarmQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------AlarmQuery------");
      var results = [];
      var rl = readline(rootPath+'/AlarmQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new AlarmQuery(json).toBasicNodes());
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

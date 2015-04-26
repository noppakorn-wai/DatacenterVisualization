var readline = require("linebyline");
var DatastoreQuery = require('../model/vCenter/DatastoreQuery');

module.exports = function(rootPath, fileName) {
  return {
    read : function (callback) {
      console.log("------DatastoreQuery------");
      var results = [];
      var rl = readline(rootPath+'/DatastoreQuery/'+fileName);
      rl.on('line', function(line) {
        var json = JSON.parse(line);
        results.push(new DatastoreQuery(json));
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

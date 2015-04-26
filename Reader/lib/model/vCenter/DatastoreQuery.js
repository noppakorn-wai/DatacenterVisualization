var BasicQuery = require("./BasicQuery");

module.exports = (function () {
  function DatastoreQuery (json) {
    BasicQuery.call(this, json);
    this.type = "Datastore";
    this.overallStatus = json.overallStatus;
    this.basedResource = getBasedResource(json);
  }

  function getBasedResource (json) {
    var resURL = json.info.url.split("/");
    return resURL[resURL.length-1];
  }

  return DatastoreQuery;
})();

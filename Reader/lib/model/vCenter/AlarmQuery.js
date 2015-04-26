var BasicQuery = require("./BasicQuery");
var BasicNode = require("../common/BasicNode");

module.exports = (function () {
  function AlarmQuery (json) {
    BasicQuery.call(this, json);
    this.key = json.alarm.val;
    this.lastModifiedTime = json.lastModifiedTime;
    this.description = json.description;
    this.lastModifiedUser = json.lastModifiedUser;
    this.entity = json.entity.val;
  }

  return AlarmQuery;
})();

var BasicQuery = require("./BasicQuery");

module.exports = (function () {
  function FolderQuery (json) {
    BasicQuery.call(this, json);
    this.type = "folder";
    this.childre = getChildren(json);
  }

  function getChildren (json) {
    var children = [];
    for (var i in json.childEntity) {
      children.push(json.childEntity[i].MOR.val);
    }
    return children;
  }

  return FolderQuery;
})();

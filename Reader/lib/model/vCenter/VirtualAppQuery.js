var BasicQuery = require("./BasicQuery");

module.exports = (function () {
  function VirtualAppQuery (json) {
    BasicQuery.call(this, json);
    this.type = "Virtual application";
    this.children = getChildren(json);
  }

  function getChildren (json) {
    var children = [];
    for(var i in json.VMs) {
      var child = json.VMs[i];
      children.push(child.MOR.val);
    }
  }

  return VirtualAppQuery;
})();

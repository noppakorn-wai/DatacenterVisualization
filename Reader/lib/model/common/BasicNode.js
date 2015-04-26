module.exports = (function () {
  function BasicNode (id, key, name, type, validFrom, validTo) {
      this.id = id;
      this.key = key;
      this.name = name;
      this.type = type;
      this.validFrom = validFrom;
      this.validTo = validTo;
  }

  BasicNode.prototype.getId = getId;
  BasicNode.prototype.setId = setId;
  BasicNode.prototype.getKey = getKey;
  BasicNode.prototype.setKey = setKey;
  BasicNode.prototype.getName = getName;
  BasicNode.prototype.setName = setName;
  BasicNode.prototype.getType = getType;
  BasicNode.prototype.setType = setType;
  BasicNode.prototype.getId = getId;

  function getId () {
      return this.id;
  }

  function setId (id) {
      this.id = id;
  }

  function getKey () {
      return this.key;
  }

  function setKey (key) {
      this.key = key;
  }

  function getName () {
      return this.name;
  }

  function setName (name) {
      this.name = name;
  }

  function getType () {
      return this.type;
  }

  function setType (type) {
      this.type = type;
  }

  return BasicNode;
})();

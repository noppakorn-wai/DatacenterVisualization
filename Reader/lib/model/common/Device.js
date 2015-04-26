var BasicNode = require("./BasicNode");

module.exports = (function () {
  function Device (id, key, name, validFrom, validTo) {
    BasicNode.call(this, id, key, name ,"Device", validFrom, validTo);
    this.owners = [];
    this.basedResources = [];
    this.ownedResources = [];
    this.resourcePools = [];
    this.connectWith = [];
  }

  Device.prototype = BasicNode.prototype;
  Device.prototype.getOwners = getOwners;
  Device.prototype.setOwners = setOwners;
  Device.prototype.getBasedResources = getBasedResources;
  Device.prototype.setBasedResources = setBasedResources;
  Device.prototype.getOwnedResources = getOwnedResources;
  Device.prototype.setOwnedResources = setOwnedResources;
  Device.prototype.getResourcePools = getResourcePools;
  Device.prototype.setResourcePools = setResourcePools;
  Device.prototype.getConnectWith = getConnectWith;
  Device.prototype.setConnectWith = setConnectWith;

  function getOwners () {
      return this.owners;
  }

  function setOwners (owners) {
      this.owners = owners;
  }

  function getBasedResources () {
      return this.baseResources;
  }

  function setBasedResources (baseResources) {
      this.baseResources = baseResources;
  }

  function getOwnedResources () {
      return this.ownedResources;
  }

  function setOwnedResources (ownedResources) {
      this.ownedResources = ownedResources;
  }

  function getResourcePools () {
      return this.resourcePools;
  }

  function setResourcePools (resourcePools) {
      this.resourcePools = resourcePools;
  }

  function getConnectWith () {
      return this.connectWith;
  }

  function setConnectWith(connectWith)
  {
      this.connectWith = connectWith;
  }

  return Device;
})();

var BasicQuery = require("./BasicQuery");
var Device = require("../common/Device");

module.exports = (function () {
  function VirtualMachineQuery (json) {
    BasicQuery.call(this, json);
    this.type = "Virtual machine";
    this.parent = json.parent.MOR.val;
    this.powerState = json.summary.runtime.powerState;
    this.getDevicesData = getDevicesData(json);
  }

  function getDevicesData (json) {
    var devicesData = [];
    devicesData.join(getCPUs(json));
    devicesData.join(getMems(json));
    return devicesData;
  }

  function getCPUs (json) {
    var devicesData = [];
    var device = new Device();
    device.setKey(this.key + ".cpu");
    device.setName("CPU");
    device.setType("CPU");
    device.setResourcePools(json.resourcePool.MOR.val);
    device.setBasedResources(json.runtime.host.val+".cpu.0.resource");
    device.setOwners(this.key);
    devicesData.push(device);
    return devicesData;
  }

  function getMems (json) {
    var devicesData = [];
    var device = new Device();
    device.setKey(this.key + ".memory");
    device.setName("memory");
    device.setType("memory");
    device.setResourcePools(json.resourcePool.MOR.val);
    device.setBasedResources(json.runtime.host.val+".memory.resource");
    device.setOwners(this.key);
    devicesData.push(device);
    return devicesData;
  }

  return VirtualMachineQuery;
})();

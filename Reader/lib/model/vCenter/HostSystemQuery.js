var BasicQuery = require("./BasicQuery");
var Device = require("../common/Device");
var Resource = require("../common/Resource");
var AggregationDistribution = require("../common/AggregationDistribution");


module.exports = (function () {
  function HostSystemQuery (json) {
    BasicQuery.call(this, json);
    this.type = "HostSystem";
    this.parent = getParent(json);
    this.powerState = json.summary.runtime.powerState;
    this.devicesData = getDevicesData(json);
  }

  function getParent (json) {
    var parentType = json.parent.class.split(".");
    if (parentType[parentType.length-1]==="ComputeResource"){
      return json.parent.parent.parent.MOR.val;
    } else {
      return json.parent.MOR.val;
    }
  }

  function getDevicesData (json) {
    var devicesData = [];
    devicesData.join(getCPUs(json));
    devicesData.join(getMems(json));
    devicesData.join(getPNICs(json));
    devicesData.join(getVNICs(json));
    // [TODO]
    // device.join(getStorage(json));
    // device.join(getPortGroup(json));
    // device.join(getVSwitch(json));
    return devicesData;
  }

  function getCPUs (json) {
    var devicesData = [];
    for (var i in json.hardware.cpuPkg) {
      var cpu = json.hardware.cpuPkg[i];
      var resource = new Resource();
      resource.setKey(this.key + ".cpu." + cpu.index + ".resource");
      resource.setType("CPU frequenzy");
      resource.setValue(cpu.hz);
      resource.setUnit("hz");
      resource.setOwners(this.key);
      devicesData.push(resource);
      var resourcePool = new AggregationDistribution();
      resourcePool.setKey(json.parent.resourcePool.MOR.val);
      resourcePool.setAggregatesFrom(resource.getKey());
      devicesData.push(resourcePool);
      var device = new Device();
      device.setKey(this.key + ".cpu" + cpu.index);
      device.setName(cpu.description);
      device.setType("CPU");
      device.setResourcePools(json.parent.resourcePool.MOR.val);
      device.setOwnedResources(resource.getKey());
      device.setOwners(this.key);
      devicesData.push(device);
    }
    return devicesData;
  }

  function getMems (json) {
    var devicesData = [];
    var resource = new Resource();
    resource.setKey(this.key + ".memory." + ".resource");
    resource.setType("memory capacity");
    resource.setValue(json.hardware.memorySize);
    resource.setUnit("Mb");
    resource.setOwners(this.key);
    devicesData.push(resource);
    var resourcePool = new AggregationDistribution();
    resourcePool.setKey(json.parent.resourcePool.MOR.val);
    resourcePool.setAggregatesFrom(resource.getKey());
    devicesData.push(resourcePool);
    var device = new Device();
    device.setKey(this.key + ".memory");
    device.setName("memory");
    device.setType("memory");
    device.setResourcePools(json.parent.resourcePool.MOR.val);
    device.setOwnedResources(resource.getKey());
    device.setOwners(this.key);
    devicesData.push(device);
    return devicesData;
  }

  function getPNICs (json) {
    var devicesData = [];
    for (var i in json.config.network.pnic) {
      var nic = json.config.network.pnic[i];
      var resource = new Resource();
      resource.setKey(nic.key + ".resource");
      resource.setType("Bandwidth");
      resource.setValue(nic.linkSpeed.speedMb);
      resource.setUnit("Mb");
      resource.setOwners(this.key);
      devicesData.push(resource);
      var device = new Device();
      device.setKey(nic.key);
      device.setName(nic.device);
      device.setType("physical NIC");
      device.setOwnedResources(resource.getKey());
      device.setOwners(this.key);
      devicesData.push(device);
    }
    return devicesData;
  }

  function getVNICs (json) {
    var devicesData = [];
    for (var i in json.config.network.vnic) {
      var nic = json.config.network.vnic[i];
      var resource = new Resource();
      resource.setKey(nic.key + ".resource");
      resource.setType("Bandwidth");
      resource.setValue(nic.spec.mtu);
      resource.setUnit("Mb");
      resource.setOwners(this.key);
      devicesData.push(resource);
      var device = new Device();
      device.setKey(nic.key);
      device.setName(nic.device);
      device.setType("virtual NIC");
      device.setOwnedResources(resource.getKey());
      device.setOwners(this.key);
      device.setConnectWith(nic.port);
      devicesData.push(device);
    }
    return devicesData;
  }

  return HostSystemQuery;
})();

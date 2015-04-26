module.exports = function (rootPath, fileName) {
  return {
    clusterComputeResourceQuery: require('./ClusterComputeResourceQuery')(rootPath, fileName),
    computeResourceQuery: require('./ComputeResourceQuery')(rootPath, fileName),
    datacenterQuery: require('./DatacenterQuery')(rootPath, fileName),
    datastoreQuery: require('./DatastoreQuery')(rootPath, fileName),
    distributedVirtualPortgroupQuery: require('./DistributedVirtualPortgroupQuery')(rootPath, fileName),
    folderQuery: require('./FolderQuery')(rootPath, fileName),
    hostSystemQuery: require('./HostSystemQuery')(rootPath, fileName),
    networkQuery: require('./NetworkQuery')(rootPath, fileName),
    resourcePoolQuery: require('./ResourcePoolQuery')(rootPath, fileName),
    virtualAppQuery: require('./VirtualAppQuery')(rootPath, fileName),
    virtualMachineQuery: require('./VirtualMachineQuery')(rootPath, fileName),
    vmwareDistributedVirtualSwitchQuery: require('./VmwareDistributedVirtualSwitchQuery')(rootPath, fileName),
    alarmQuery: require('./AlarmQuery')(rootPath, fileName),
    eventQuery: require('./EventQuery')(rootPath, fileName),
    taskQuery: require('./TaskQuery')(rootPath, fileName),
    performanceQuery: require('./PerformanceQuery')(rootPath, fileName),
  };
};

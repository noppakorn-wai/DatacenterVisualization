var initSigma = function(containerId, rootId, nodes, edges) {

  var s = new sigma({
    renderer: {
      container: document.getElementById(containerId),
      type: 'canvas'
    },
    settings: {
      defaultEdgeColor: "#eee",
      nodesPowRatio: 0.5,
      edgesPowRatio: 0.5,
      animationsTime: 1000,
      autoRescale: false,
      maxNodeSize: 23,
      defaultLabelSize: 12,
      zoomingRatio: 1.7,
      zoomMin: 0.0312,
      zoomMax: 4
    }
  });
  initData(s, nodes, edges);
  initRoot(s, rootId);
  return s;

  function initData(s, nodes, edges) {
    var graph = s.graph;
    nodes.forEach(function(node) {
      graph.addNode(node);
    });
    edges.forEach(function(edge) {
      graph.addEdge(edge);
    });
    mockRelationBetweenVMAndHost(graph);
    graph.nodes().forEach(function(node) {
      if (graph.adjacentNodes(node.id).length === 0) {
        graph.dropNode(node.id);
      } else if (["memory", "Folder", "disk", "cdrom", "virtual NIC", "physical NIC", "cpu", "Bandwidth", "CPU frequenzy"].indexOf(node.vis.subType) > -1) {
        if (node.label !== "Datacenters") {
          node.ignore = true;
          graph.dropNode(node.id);
        }
      }
    });
    grouping(graph);
  }

  function mockRelationBetweenVMAndHost(graph) {
    graph.nodeBysubType("VirtualMachine").forEach(function(vm) {
      var vmChildren = graph.children(vm.id);
      var vmVirtualDevices = vmChildren.forEach(function(vdev) {
        if (["cpu", "memory"].indexOf(vdev.vis.subType) > -1) {
          var vdeviceChildren = graph.children(vdev.id);
          var deviceBasedResource = vdeviceChildren.forEach(function(res) {
            if (["Bandwidth", "CPU frequenzy", "memory capacity"].indexOf(res.vis.subType) > -1) {
              var resourceParent = graph.parent(res.id);
              var deviceOfResource = resourceParent.forEach(function(dev) {
                if (["disk", "cdrom", "virtual NIC", "physical NIC", "memory", "cpu"].indexOf(dev.vis.subType) > -1) {
                  var deviceParent = graph.parent(dev.id);
                  var hosts = deviceParent.forEach(function(h) {
                    if (["HostSystem"].indexOf(h.vis.subType) > -1) {
                      try {
                        graph.addEdge({
                          id: h.id + "-" + vm.id,
                          source: h.id,
                          target: vm.id,
                          vis: {
                            type: "dummy"
                          }
                        });
                      } catch (e) {
                        //console.error(e);
                      }
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  }

  function grouping(graph) {
    graph.nodes().forEach(function(n) {
      var children = graph.children(n.id);
      var vms, vmsEdges;
      if (n.vis.subType === "HostSystem") {
        // group host's vms
        vms = children.filter(function(n) {
          if (n.vis.subType === "VirtualMachine") return n;
        });
        if (vms.length > 0) {
          graph.addNode({
            id: (n.id + "/VMs"),
            dummy: true,
            label: ("VMs (" + vms.length + ")"),
            vis: {
              key: (n.vis.key + "/VMs"),
              type: "dummy",
              subType: "VMs"
            }
          });
          graph.addEdge({
            id: (n.id + "-" + n.id + "/VMs"),
            source: (n.id),
            target: (n.id + "/VMs"),
            vis: {
              type: "dummy",
              subType: "grouping"
            }
          });
          vmsEdges = vms.reduce(function(a, vm) {
            return a.concat(graph.edgeBetween(n.id, vm.id));
          }, []);
          vmsEdges.forEach(function(e) {
            graph.dropEdge(e.id);
          });
          vms.forEach(function(vm) {
            graph.addEdge({
              id: (n.id + "/VMs-" + vm.id),
              source: (n.id + "/VMs"),
              target: (vm.id),
              vis: {
                type: "dummy",
                subType: "grouping"
              }
            });
          });
        }
        // group host's network
        var nws = children.filter(function(n) {
          if (n.vis.subType === "network") return n;
        });
        if (nws.length > 0) {
          graph.addNode({
            id: (n.id + "/Networks"),
            dummy: true,
            label: ("Networks (" + nws.length + ")"),
            vis: {
              key: (n.vis.key + "/NWs"),
              type: "dummy",
              subType: "NWs"
            }
          });
          graph.addEdge({
            id: (n.id + "-" + n.id + "/Networks"),
            source: (n.id),
            target: (n.id + "/Networks"),
            vis: {
              type: "dummy",
              subType: "grouping"
            }
          });
          //graph.addEdge({id:(n.id+"/Networks-"+n.id), source:(n.id+"/Networks"), target:(n.id)});
          var nwsEdges = nws.reduce(function(a, nw) {
            return a.concat(graph.edgeBetween(n.id, nw.id));
          }, []);
          nwsEdges.forEach(function(e) {
            graph.dropEdge(e.id);
          });
          nws.forEach(function(nw) {
            graph.addEdge({
              id: (n.id + "/Networks-" + nw.id),
              source: (n.id + "/Networks"),
              target: (nw.id),
              vis: {
                type: "dummy",
                subType: "grouping"
              }
            });
          });
        }
        // group host's datastore
        var datastores = children.filter(function(n) {
          if (n.vis.subType === "Datastore") return n;
        });
        if (datastores.length > 0) {
          graph.addNode({
            id: (n.id + "/DSs"),
            dummy: true,
            label: ("Storages (" + datastores.length + ")"),
            vis: {
              key: (n.vis.key + "/DSs"),
              type: "dummy",
              subType: "DSs"
            }
          });
          graph.addEdge({
            id: (n.id + "-" + n.id + "/DSs"),
            source: (n.id),
            target: (n.id + "/DSs"),
            vis: {
              type: "dummy",
              subType: "grouping"
            }
          });
          //graph.addEdge({id:(n.id+"/Networks-"+n.id), source:(n.id+"/Networks"), target:(n.id)});
          var dcsEdges = datastores.reduce(function(a, dc) {
            return a.concat(graph.edgeBetween(n.id, dc.id));
          }, []);
          dcsEdges.forEach(function(e) {
            graph.dropEdge(e.id);
          });
          datastores.forEach(function(dc) {
            graph.addEdge({
              id: (n.id + "/DSs-" + dc.id),
              source: (n.id + "/DSs"),
              target: (dc.id),
              vis: {
                type: "dummy",
                subType: "grouping"
              }
            });
          });
        }
      } else if (n.cat === "Network") {
        // group network's vms
        /*vms = children.filter(function(n) {
          if (n.cat === "VM") return n;
        });
        if (vms.length > 0) {
          graph.addNode({
            id: (n.id + "/VMs"),
            dummy: true,
            label: ("VMs (" + vms.length + ")"),
            key: (n.key + "/VMs"),
            cat: "VMs"
          });
          graph.addEdge({
            id: (n.id + "-" + n.id + "/VMs"),
            source: (n.id),
            target: (n.id + "/VMs")
          });
          //graph.addEdge({id:(n.id+"/VMs-"+n.id), source:(n.id+"/VMs"), target:(n.id)});
          vmsEdges = vms.reduce(function(a, vm) {
            return a.concat(graph.edgeBetween(n.id, vm.id));
          }, []);
          vmsEdges.forEach(function(e) {
            graph.dropEdge(e.id);
          });
          vms.forEach(function(vm) {
            graph.addEdge({
              id: (n.id + "/VMs-" + vm.id),
              source: (n.id + "/VMs"),
              target: (vm.id)
            });
            graph.addEdge({
              id: (vm.id + "-" + n.id),
              source: (vm.id),
              target: (n.id)
            });
          });
        }
        // group network's hosts
        var hs = children.filter(function(n) {
          if (n.cat === "Host") return n;
        });
        if (hs.length > 0) {
          graph.addNode({
            id: (n.id + "/Hosts"),
            dummy: true,
            label: ("Hosts (" + hs.length + ")"),
            key: (n.key + "/Hosts"),
            cat: "Hosts"
          });
          graph.addEdge({
            id: (n.id + "-" + n.id + "/Hosts"),
            source: (n.id),
            target: (n.id + "/Hosts")
          });
          //graph.addEdge({id:(n.id+"/Hosts-"+n.id), source:(n.id+"/Hosts"), target:(n.id)});
          var hsEdges = hs.reduce(function(a, h) {
            return a.concat(graph.edgeBetween(n.id, h.id));
          }, []);
          hsEdges.forEach(function(e) {
            graph.dropEdge(e.id);
          });
          hs.forEach(function(h) {
            graph.addEdge({
              id: (n.id + "/Hosts-" + h.id),
              source: (n.id + "/Hosts"),
              target: (h.id)
            });
          });
        }*/
      }
    });
  }

  function initRoot(s, rootId) {
    s.root = s.graph.nodeByKey(rootId);
    s.root.ignore = false;
  }
};

sigma.classes.graph.attach('addNode', 'addVisAttribute', function(nodeData) {
  var node = this.nodes(nodeData.id);
  var shapeIcon = {
    "ROOT": "./img/ROOT.png",
    "Datacenter": "./img/Datacenter.png",
    "Cluster": "./img/Cluster.png",
    "HostSystem": "./img/Host.png",
    "Hosts": "./img/Host.png",
    "VirtualMachine": "./img/VM.png",
    "VMs": "./img/VM.png",
    "NWs": "./img/Network.png",
    "network": "./img/Network.png",
    "Datastore": "./img/Storage.png",
    "DSs": "./img/Storage.png",
    "Folder": "./img/Folder.png"
  };

  node.label = node.label || "No name";
  node.type = "vis";
  node.hidden = false;
  node.new_x = node.old_x = node.x = 0;
  node.new_y = node.old_y = node.y = 0;
  node.new_size = node.old_size = node.size = 1;
  node.new_color = node.old_color = node.color = "#fff";

  if (node.id === "n5" || node.id === "n6") {
    node.vis.data.overallStatus = "green";
  }

  if (node.id === "n431" || node.id === "n422" || node.id === "n455" || node.id === "n428" || node.id === "n430") {
    node.vis.data.overallStatus = "yellow";
  }

  node.borderWidth = node.borderWidth || 3;
  node.image = {
    url: shapeIcon[node.vis.subType]
  };

  this.visIndex = this.visIndex || {};
  this.visIndex[node.vis.subType] = this.visIndex[node.vis.subType] || {
    subType: node.vis.subType,
    id: []
  };
  this.visIndex[node.vis.subType].id.push(node.id);

  if (["Folder", "disk", "cdrom", "virtual NIC", "physical NIC", "memory", "cpu", "Bandwidth", "CPU frequenzy", "memory capacity", "cpu", "memory"].indexOf(node.vis.subType) > -1) {
    node.ignore = true;
  }
});

var getKeys = function(obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }
  return keys;
};

sigma.classes.graph.addMethod('edgeTo', function(nodeId, relsubType) {
  return this.edgesArray.filter(function(e) {
    if (e.target === nodeId && (e.vis.subType === relsubType || relsubType === undefined)) return e;
  });
});

sigma.classes.graph.addMethod('edgeFrom', function(nodeId, relsubType) {
  return this.edgesArray.filter(function(e) {
    if (e.source === nodeId && (e.vis.subType === relsubType || relsubType === undefined)) return e;
  });
});

sigma.classes.graph.addMethod('edgeBetween', function(nodeId1, nodeId2, relsubType) {
  return this.edgesArray.filter(function(e) {
    if (((e.source === nodeId1 && e.target === nodeId2) || (e.source === nodeId2 && e.target === nodeId1)) && (e.vis.type === relsubType || relsubType === undefined)) return e;
  });
});

sigma.classes.graph.addMethod('children', function(nodeId) {
  var nodesIndex = this.nodesIndex;
  return getKeys(this.outNeighborsIndex[nodeId]).map(function(nid) {
    return nodesIndex[nid];
  });
});

sigma.classes.graph.addMethod('parent', function(nodeId) {
  var nodesIndex = this.nodesIndex;
  return getKeys(this.inNeighborsIndex[nodeId]).map(function(nid) {
    return nodesIndex[nid];
  });
});

sigma.classes.graph.addMethod('nodeByKey', function(nodeKey) {
  return this.nodesArray.filter(function(n) {
    if (n.vis.key === nodeKey) return n;
  })[0];
});

sigma.classes.graph.addMethod('nodeByName', function(name) {
  return this.nodesArray.filter(function(n) {
    if (n.label === name) return n;
  });
});

sigma.classes.graph.addMethod('nodeBysubType', function(subType) {
  var graph = this;
  if (!this.visIndex[subType]) return null;
  return graph.visIndex[subType].id.map(function(n) {
    return graph.nodes(n);
  });
});

sigma.prototype.reposition = function(currentNodeKey, callback) {
  currentNodeKey = currentNodeKey || "ROOT";
  //set root -> gabage collector -> depthCal -> filter -> group -> layout -> resize -> update
  var current = this.graph.nodeByKey(currentNodeKey);
  this.setCenter(current);
  this.filter();
  //this.computeDepth(0);
  this.computeLayout();
  this.applyLayout();
  this.applyEdgeStyle();
  this.resize();
  this.updateStatusPanel();
  this.updateBreadcrumb();
  var step = 0;
  var prefix = ['old_', 'new_'][step = +!step];
  sigma.plugins.animate(
    s, {
      x: prefix + 'x',
      y: prefix + 'y',
      size: prefix + 'size',
      color: prefix + 'color'
    }, {
      onComplete: function() {
        if (callback !== null && callback !== undefined) {
          callback();
        } else {
          s.camera.goTo({
            x: s.getCenter().x,
            y: s.getCenter().y,
            ratio: s.camera.ratio
          });
          s.refresh();
        }
      }
    }
  );
};

sigma.prototype.getRoot = function() {
  return this.root;
};

sigma.prototype.getCenter = function() {
  return this.current;
};

sigma.prototype.setCenter = function(_current) {
  this.current = _current;
};

sigma.prototype.getPathToRoot = function(startNode, clear) {
  var root = this.getRoot();
  var graph = this.graph;
  var nodes = graph.nodes();
  var that = this;
  var adjs, path;

  if (clear) {
    nodes.forEach(function(elem) {
      elem.vis.extra.flag = false;
    });
  }
  if (startNode.vis.key === root.vis.key) {
    return [startNode];
  } else if (startNode.vis.subType === "VirtualMachine" || startNode.vis.subType === "Datastore") {
    adjs = graph.adjacentNodes(startNode.id).filter(function(n) {
      if (!n.ignore) return n;
    });
    var host = adjs.filter(function(n) {
      if (n.vis.subType === "HostSystem") {
        return n;
      }
    })[0];
    path = that.getPathToRoot(host, false);
    if (path !== null) return [startNode].concat(path);
  } else {
    adjs = graph.adjacentNodes(startNode.id).filter(function(n) {
      if (!n.ignore) return n;
    });
    for (var i = 0; i < adjs.length; i++) {
      var adj = adjs[i];
      if (adj.vis.extra.flag === false) {
        if (adj.vis.extra.depth > startNode.vis.extra.depth && adj.vis.extra.depth <= root.vis.extra.depth) {
          path = that.getPathToRoot(adj, false);
          if (path !== null) return [startNode].concat(path);
        }
      }
      adj.extra.flag = true;
    }
    return null;
  }
};
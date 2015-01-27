/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.common.nodeModel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author B_MW (Wai & May)
 */
public class Device extends BasicNode {

    final String nodeType = "Device";
    List<String> owner = new ArrayList<>();
    List<String> baseResources = new ArrayList<>();
    List<Resource> ownedResources = new ArrayList<>();
    List<String> resourcePools = new ArrayList<>();
    List<String> connect = new ArrayList<>();

    public List<String> getBaseResources() {
        return baseResources;
    }

    public void setBaseResources(List<String> baseResources) {
        this.baseResources = baseResources;
    }

    public List<Resource> getOwnedResources() {
        return ownedResources;
    }

    public void setOwnedResources(List<Resource> ownedResources) {
        this.ownedResources = ownedResources;
    }

    public List<String> getConnect() {
        return connect;
    }

    public void setConnect(List<String> connect) {
        this.connect = connect;
    }

    public List<String> getOwner() {
        return owner;
    }

    public void setOwner(List<String> owner) {
        this.owner = owner;
    }

    public List<String> getResourcePools() {
        return resourcePools;
    }

    public void setResourcePools(List<String> resourcePools) {
        this.resourcePools = resourcePools;
    }

}

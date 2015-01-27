/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.queryadapter.vCenter.dataConverter.nodeConverter;

import com.kmitl.b_mw.common.nodeModel.*;
import java.util.ArrayList;
import java.util.List;
import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author B_MW (Wai & May)
 */
public class VirtualMachine extends BasicModel implements Convertable {

    private static final Logger LOG = Logger.getLogger(VirtualMachine.class.getName());

    public VirtualMachine(String virtualMachineJSONString) throws JSONException {
        this.jsonData = new JSONObject(virtualMachineJSONString);
        String key = jsonData.getJSONObject("MOR").getString("val");
        if (!key.split("-")[0].equals("vm")) {
            throw new JSONException("Couldn't parse input JSON string");
        }
    }

    @Override
    public String getType() {
        return "VirtualMachine";
    }

    public String getParent() {
        try {
            String parent;
            if (jsonData.getJSONObject("parent").getString("class").equals(com.vmware.vim25.mo.Folder.class.getName()) && jsonData.getJSONObject("parent").getString("name").equals("vm")) {
                parent = jsonData.getJSONObject("parent").getJSONObject("parent").getJSONObject("MOR").getString("val");
            } else {
                parent = jsonData.getJSONObject("parent").getJSONObject("MOR").getString("val");
            }
            return parent;
        } catch (JSONException ex) {
            LOG.warn(ex);
            return null;
        }
    }

    public String getState() {
        try {
            return jsonData.getJSONObject("summary").getJSONObject("runtime").getString("powerState");
        } catch (JSONException ex) {
            LOG.warn(ex);
            return "";
        }
    }

    public List<Device> getDevices() {
        List<Device> devices = new ArrayList<>();

        devices.addAll(getCPU());

        devices.addAll(getMemory());

        //[TODO]
        //devices.addAll(getNIC());
        return devices;
    }

    @Override
    public List<BasicNode> toBasicNodes() {
        List<BasicNode> result = new ArrayList<>();

        if (getParent() != null) {
            BasicNode parentNode = new BasicNode();
            parentNode.setKey(getParent());
            result.add(parentNode);
        }

        ComputeUnit computeUnit = new ComputeUnit();
        computeUnit.setKey(getKey());
        computeUnit.setName(getName());
        computeUnit.setType(getType());
        computeUnit.setParent(getParent());
        computeUnit.setState(getState());
        List<String> deviceKeys = new ArrayList<>();
        for (Device device : getDevices()) {
            deviceKeys.add(device.getKey());
        }
        computeUnit.setDevices(deviceKeys);

        result.add(computeUnit);
        result.addAll(getDevices());

        return result;
    }

    private List<Device> getCPU() {
        List<Device> devices = new ArrayList<>();

        Device device = new Device();
        device.setKey(getKey() + ".memory");
        device.setName("memory");
        device.setType("memory");

        String resourcePool = jsonData.getJSONObject("resourcePool").getJSONObject("MOR").getString("val");
        String baseResource = jsonData.getJSONObject("runtime").getJSONObject("host").getString("val") + ".memory.resource";
        List<String> baseResources = new ArrayList<>();
        baseResources.add(resourcePool);
        baseResources.add(baseResource);
        device.setBaseResources(baseResources);

        devices.add(device);
        return devices;
    }

    private List<Device> getMemory() {
        List<Device> devices = new ArrayList<>();

        Device device = new Device();
        device.setKey(getKey() + ".cpu");
        device.setName("CPU");
        device.setType("cpu");

        String resourcePool = jsonData.getJSONObject("resourcePool").getJSONObject("MOR").getString("val");
        String baseResource = jsonData.getJSONObject("runtime").getJSONObject("host").getString("val") + ".cpu.0.resource";
        List<String> baseResources = new ArrayList<>();
        baseResources.add(resourcePool);
        baseResources.add(baseResource);
        device.setBaseResources(baseResources);

        devices.add(device);
        return devices;
    }

    /*private List<Device> getNIC()
     {
     List<Device> devices = new ArrayList<>();
        
     JSONArray networks = jsonData.getJSONArray("networks");
     Map<String, String> networkMap = new HashMap<>();
     for (int j = 0; j < networks.length(); j++)
     {
     JSONObject network = networks.getJSONObject(j);
     networkMap.put(network.getString("name"), network.getJSONObject("MOR").getString("val"));
     }

     JSONArray vDevices = jsonData.getJSONObject("config").getJSONObject("hardware").getJSONArray("device");

     for (int i = 0; i < vDevices.length(); i++)
     {
     JSONObject vdevice = vDevices.getJSONObject(i);
     Class deviceClass;
     try
     {
     deviceClass = Class.forName(vdevice.getString("class"));
     if (deviceClass.newInstance() instanceof VirtualEthernetCard)
     {
     String deviceName = vdevice.getJSONObject("deviceInfo").getString("label");
     Device device = new Device();
     device.setKey(getKey() + "." + deviceName);
     device.setName(deviceName);
     device.setType("virtual NIC");
                    
     String networkKey = networkMap.get(vdevice.getJSONObject("deviceInfo").getString("summary"));
                    
     List<String> connection = new ArrayList<>();
     connection.add(networkKey);
     device.setConnect(connection);
                    
     devices.add(device);
     }
     }
     catch (ClassNotFoundException | InstantiationException | IllegalAccessException ex)
     {
     LOG.error("Cannot detect virtual device type", ex);
     }
     }

     return devices;
     }*/
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.queryadapter.vCenter.dataConverter.nodeConverter;

import com.kmitl.b_mw.common.nodeModel.AggregationDistribution;
import com.kmitl.b_mw.common.nodeModel.BasicNode;
import java.util.ArrayList;
import java.util.List;
import org.apache.log4j.Logger;
import org.json.*;

/**
 *
 * @author B_MW (Wai & May)
 */
public class VirtualApp extends BasicModel implements Convertable {

    private static final Logger LOG = Logger.getLogger(VirtualApp.class.getName());

    public VirtualApp(String virtualAppJSONString) throws JSONException {
        this.jsonData = new JSONObject(virtualAppJSONString);
        String key = jsonData.getJSONObject("MOR").getString("val");
        if (!key.split("-")[0].equals("resgroup")) {
            throw new JSONException("Couldn't parse input JSON string");
        }
    }

    @Override
    public String getType() {
        return "Virtual application";
    }

    @Override
    public List<BasicNode> toBasicNodes() {
        List<BasicNode> result = new ArrayList<>();

        AggregationDistribution ag = new AggregationDistribution();
        ag.setKey(getKey());
        ag.setName(getName());
        ag.setType(getType());

        List<String> aggregations = new ArrayList<>();
        JSONArray vms = jsonData.getJSONArray("VMs");
        for (int i = 0; i < vms.length(); i++) {
            JSONObject vm = vms.getJSONObject(i);
            aggregations.add(vm.getJSONObject("MOR").getString("val"));
        }
        ag.setAggregate(aggregations);
        result.add(ag);

        return result;
    }

}

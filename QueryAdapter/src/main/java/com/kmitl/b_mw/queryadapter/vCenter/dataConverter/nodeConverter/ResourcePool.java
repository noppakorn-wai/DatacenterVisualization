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
public class ResourcePool extends BasicModel implements Convertable {

    private static final Logger LOG = Logger.getLogger(ResourcePool.class.getName());

    public ResourcePool(String resourcePoolJSONString) throws JSONException {
        this.jsonData = new JSONObject(resourcePoolJSONString);
        String key = jsonData.getJSONObject("MOR").getString("val");
        if (!key.split("-")[0].equals("resgroup")) {
            throw new JSONException("Couldn't parse input JSON string");
        }
    }

    @Override
    public String getType() {
        return "resource pool";
    }

    @Override
    public List<BasicNode> toBasicNodes() {
        List<BasicNode> result = new ArrayList<>();

        AggregationDistribution ag = new AggregationDistribution();
        ag.setKey(getKey());
        ag.setName(getName());
        ag.setType(getType());

        JSONArray childResourcePools = jsonData.getJSONArray("resourcePools");
        if (childResourcePools.length() != 0) {
            List<String> distributedNode = new ArrayList<>();
            for (int i = 0; i < childResourcePools.length(); i++) {
                JSONObject childResourcePool = childResourcePools.getJSONObject(i);
                distributedNode.add(childResourcePool.getJSONObject("MOR").getString("val"));
            }
            ag.setDistribute(distributedNode);
        }

        result.add(ag);

        return result;
    }

}

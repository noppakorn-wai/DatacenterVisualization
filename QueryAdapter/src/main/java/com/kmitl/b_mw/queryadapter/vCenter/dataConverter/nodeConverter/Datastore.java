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
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author B_MW (Wai & May)
 */
public class Datastore extends BasicModel implements Convertable {

    private static final Logger LOG = Logger.getLogger(HostSystem.class.getName());

    public Datastore(String datastoreJSONString) throws JSONException {
        this.jsonData = new JSONObject(datastoreJSONString);
        String key = jsonData.getJSONObject("MOR").getString("val");
        if (!key.split("-")[0].equals("datastore")) {
            throw new JSONException("Couldn't parse input JSON string");
        }
    }

    public String getOverallStatus() {
        try {
            return jsonData.getString("overallStatus");
        } catch (JSONException ex) {
            LOG.warn(ex);
            return "Unknown";
        }
    }

    @Override
    public String getType() {
        return "Datastore";
    }

    public String getBasedResource() {
        try {
            String[] ans = jsonData.getJSONObject("info").getString("url").split("/");
            return ans[ans.length - 1];
        } catch (JSONException ex) {
            LOG.warn(ex);
            return "";
        }
    }

    @Override
    public List<BasicNode> toBasicNodes() {
        List<BasicNode> result = new ArrayList<>();

        AggregationDistribution ag = new AggregationDistribution();
        ag.setKey(getKey());
        ag.setName(getName());
        ag.setType(getType());
        List<String> pool = new ArrayList<>();
        pool.add(getBasedResource());
        ag.setAggregate(pool);
        result.add(ag);

        return result;
    }

}

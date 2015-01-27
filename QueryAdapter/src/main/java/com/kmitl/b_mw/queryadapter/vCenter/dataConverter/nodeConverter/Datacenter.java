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
public class Datacenter extends BasicModel implements Convertable {

    private static final Logger LOG = Logger.getLogger(HostSystem.class.getName());

    public Datacenter(String datacenterJSONString) throws JSONException {
        this.jsonData = new JSONObject(datacenterJSONString);
        String key = jsonData.getJSONObject("MOR").getString("val");
        if (!key.split("-")[0].equals("datacenter")) {
            throw new JSONException("Couldn't parse input JSON string");
        }
    }

    @Override
    public String getType() {
        return "Datacenter";
    }

    public String getParent() {
        try {
            return jsonData.getJSONObject("parent").getJSONObject("MOR").getString("val");
        } catch (JSONException ex) {
            LOG.warn(ex);
            return "";
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

    public List<String> getChild() {
        List<String> children = new ArrayList<>();

        try {
            JSONArray jsonChildren = jsonData.getJSONObject("hostFolder").getJSONArray("childEntity");
            for (int i = 0; i < jsonChildren.length(); i++) {
                JSONObject jsonChild = jsonChildren.getJSONObject(i);
                if (jsonChild.getString("class").equals(com.vmware.vim25.mo.ComputeResource.class.getName())) {
                    JSONArray childKeys = jsonChild.getJSONArray("hosts");
                    for (int j = 0; j < childKeys.length(); j++) {
                        String key = childKeys.getJSONObject(j).getJSONObject("MOR").getString("val");
                        children.add(key);
                    }
                }
            }
        } catch (JSONException ex) {
            LOG.warn(ex);
        }

        return children;
    }

    @Override
    public List<BasicNode> toBasicNodes() {
        List<BasicNode> result = new ArrayList<>();

        AggregationDistribution ag = new AggregationDistribution();
        ag.setKey(getKey());
        ag.setName(getName());
        ag.setType(getType());
        List<String> distributions = new ArrayList<>();
        distributions.add(getParent());
        ag.setDistribute(distributions);
        List<String> aggregations = new ArrayList<>();
        aggregations.addAll(getChild());
        ag.setAggregate(aggregations);
        result.add(ag);

        return result;
    }

}

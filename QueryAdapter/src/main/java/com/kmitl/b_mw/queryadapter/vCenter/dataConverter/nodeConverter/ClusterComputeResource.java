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
public class ClusterComputeResource extends BasicModel implements Convertable {

    private static final Logger LOG = Logger.getLogger(ClusterComputeResource.class.getName());

    public ClusterComputeResource(String clusterComputeResourceJSONString) throws JSONException {
        this.jsonData = new JSONObject(clusterComputeResourceJSONString);
        String key = jsonData.getJSONObject("MOR").getString("val");
        if (!key.split("-")[0].equals("domain")) {
            throw new JSONException("Couldn't parse input JSON string");
        }
    }

    @Override
    public String getType() {
        return "HostCluster";
    }

    public String getParent() {
        try {
            return jsonData.getJSONObject("parent").getJSONObject("parent").getJSONObject("MOR").getString("val");
        } catch (JSONException ex) {
            LOG.warn(ex);
            return "";
        }
    }

    public List<String> getHosts() {
        List<String> hosts = new ArrayList<>();
        try {
            JSONArray jsonHosts = jsonData.getJSONArray("hosts");
            for (int i = 0; i < jsonHosts.length(); i++) {
                JSONObject jsonHost = jsonHosts.getJSONObject(i);
                hosts.add(jsonHost.getJSONObject("MOR").getString("val"));
            }
        } catch (JSONException ex) {
            LOG.warn(ex);
        }
        return hosts;
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
    public List<BasicNode> toBasicNodes() {
        List<BasicNode> result = new ArrayList<>();

        AggregationDistribution adNode = new AggregationDistribution();
        adNode.setKey(getKey());
        adNode.setName(getName());
        adNode.setType(getType());
        adNode.setAggregate(getHosts());
        List<String> distributions = new ArrayList<>();
        distributions.add(getParent());
        adNode.setDistribute(distributions);

        result.add(adNode);

        return result;
    }

}

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
public class Folder extends BasicModel implements Convertable {

    private static final Logger LOG = Logger.getLogger(Folder.class.getName());

    public Folder(String folderJSONString) throws JSONException {
        this.jsonData = new JSONObject(folderJSONString);
        String key = jsonData.getJSONObject("MOR").getString("val");
        if (!key.split("-")[0].equals("group")) {
            throw new JSONException("Couldn't parse input JSON string");
        }
    }

    @Override
    public String getType() {
        return "folder";
    }

    public List<String> getChild() {
        try {
            List<String> result = new ArrayList<>();
            JSONArray children = jsonData.getJSONArray("childEntity");
            for (int i = 0; i < children.length(); i++) {
                String name = children.getJSONObject(i).getString("name");
                String key = children.getJSONObject(i).getJSONObject("MOR").getString("val");
                String type = children.getJSONObject(i).getString("class");
                if (!type.equals(com.vmware.vim25.mo.ComputeResource.class.getName())) {
                    if (!(name.equals("vm") || name.equals("host") || name.equals("network") || name.equals("datastore"))) {
                        result.add(key);
                    }
                }
            }
            return result;
        } catch (JSONException ex) {
            LOG.warn(ex);
            return new ArrayList<>();
        }
    }

    @Override
    public List<BasicNode> toBasicNodes() {
        List<BasicNode> result = new ArrayList<>();
        String name = getName();
        if (!(name.equals("vm") || name.equals("host") || name.equals("network") || name.equals("datastore"))) {
            AggregationDistribution ag = new AggregationDistribution();
            ag.setKey(getKey());
            ag.setName(getName());
            ag.setType(getType());
            ag.setAggregate(getChild());

            result.add(ag);
        }

        return result;
    }

}

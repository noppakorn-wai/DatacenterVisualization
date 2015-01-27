/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.queryadapter.vCenter.dataConverter.nodeConverter;

import com.kmitl.b_mw.common.nodeModel.BasicNode;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author B_MW (Wai & May)
 */
public class ComputeResource extends BasicModel implements Convertable {

    public ComputeResource(String computeResourceJSONString) throws JSONException {
        this.jsonData = new JSONObject(computeResourceJSONString);
        String key = jsonData.getJSONObject("MOR").getString("val");
        if (!key.split("-")[0].equals("domain")) {
            throw new JSONException("Couldn't parse input JSON string");
        }
    }

    @Override
    public String getType() {
        return "ComputeResource";
    }

    public String getHost() {
        return jsonData.getJSONArray("hosts").getJSONObject(0).getJSONObject("MOR").getString("val");
    }

    @Override
    public List<BasicNode> toBasicNodes() {
        List<BasicNode> result = new ArrayList<>();
        BasicNode node = new BasicNode();
        node.setKey(getHost());
        result.add(node);
        return result;
    }

}

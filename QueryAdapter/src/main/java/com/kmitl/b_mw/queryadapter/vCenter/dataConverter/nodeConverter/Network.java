/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.queryadapter.vCenter.dataConverter.nodeConverter;

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
public class Network extends BasicModel implements Convertable {

    private static final Logger LOG = Logger.getLogger(Network.class.getName());

    public Network(String networkResourceJSONString) throws JSONException {
        this.jsonData = new JSONObject(networkResourceJSONString);
        String key = jsonData.getJSONObject("MOR").getString("val");
        if (!key.split("-")[0].equals("network")) {
            throw new JSONException("Couldn't parse input JSON string");
        }
    }

    @Override
    public String getType() {
        return "Network";
    }

    @Override
    public List<BasicNode> toBasicNodes() {
        List<BasicNode> result = new ArrayList<>();

        com.kmitl.b_mw.common.nodeModel.Network network = new com.kmitl.b_mw.common.nodeModel.Network();

        network.setKey(getKey());
        network.setName(getName());
        network.setType("network");

        result.add(network);

        return result;
    }

}

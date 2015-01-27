/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.queryadapter.vCenter.dataConverter.nodeConverter;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author B_MW (Wai & May)
 */
public abstract class BasicModel {

    private static final Logger LOG = Logger.getLogger(BasicModel.class.getName());
    JSONObject jsonData;

    public String getKey() {
        String key;
        try {
            key = jsonData.getJSONObject("MOR").getString("val");
        } catch (JSONException ex) {
            LOG.warn(ex);
            key = "";
        }
        return key;
    }

    public String getName() {
        String name;
        try {
            name = jsonData.getString("name");
        } catch (JSONException ex) {
            LOG.warn(ex);
            name = "";
        }
        return name;
    }

    public abstract String getType();

}

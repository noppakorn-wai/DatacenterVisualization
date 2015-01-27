/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.common.nodeModel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author B_MW (Wai & May)
 */
public class Network extends BasicNode {

    final String nodeType = "Network";
    List<String> connect = new ArrayList<>();

    public List<String> getConnect() {
        return connect;
    }

    public void setConnect(List<String> connect) {
        this.connect = connect;
    }

}

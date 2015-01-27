/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.queryadapter.vCenter.dataConverter.nodeConverter;

import com.kmitl.b_mw.common.nodeModel.BasicNode;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author B_MW (Wai & May)
 */
public class DistributedVirtualPortgroup extends BasicModel implements Convertable {

    @Override
    public String getType() {
        return "Distributed virtual port group (VMware)";
    }

    @Override
    public List<BasicNode> toBasicNodes() {
        return new ArrayList<>();
    }

}

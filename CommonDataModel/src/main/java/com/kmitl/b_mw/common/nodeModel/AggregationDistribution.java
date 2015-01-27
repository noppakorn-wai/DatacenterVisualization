/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.common.nodeModel;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author B_MW (Wai & May)
 */
public class AggregationDistribution extends BasicNode {

    final String nodeType = "AggregationDistribution";

    List<String> aggregate = new ArrayList<>();
    List<String> distribute = new ArrayList<>();

    public List<String> getAggregate() {
        return aggregate;
    }

    public void setAggregate(List<String> aggregate) {
        this.aggregate = aggregate;
    }

    public List<String> getDistribute() {
        return distribute;
    }

    public void setDistribute(List<String> distribute) {
        this.distribute = distribute;
    }
}

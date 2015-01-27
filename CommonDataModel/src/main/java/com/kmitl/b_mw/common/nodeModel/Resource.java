/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.common.nodeModel;

import java.util.*;

/**
 *
 * @author B_MW (Wai & May)
 */
public class Resource extends BasicNode {

    final String nodeType = "Resource";
    double value;
    String unit;
    List<String> owner = new ArrayList<>();

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public List<String> getOwner() {
        return owner;
    }

    public void setOwner(List<String> owner) {
        this.owner = owner;
    }

}

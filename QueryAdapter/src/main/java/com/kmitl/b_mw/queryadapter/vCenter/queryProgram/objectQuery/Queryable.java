/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.queryadapter.vCenter.queryProgram.objectQuery;

import org.json.JSONObject;

/**

 @author B_MW (Wai & May)
 */
public interface Queryable
{

    public JSONObject excuteQuery() throws Exception;
}

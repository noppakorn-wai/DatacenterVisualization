/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.queryadapter.vCenter.queryProgram.jobTask;

import com.kmitl.b_mw.queryadapter.vCenter.Main;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.dataIO.StorageConnecter;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.objectQuery.Queryable;
import java.io.IOException;
import java.util.concurrent.Callable;
import org.apache.log4j.Logger;
import org.json.*;

/**

 @author B_MW (Wai & May)
 */
public class QueryTask implements Callable<JSONObject>
{

    private static final Logger LOG = Logger.getLogger(Main.class.getName());

    Queryable objectQuery;
    StorageConnecter storageConnecter;

    public QueryTask(Queryable objectQuery, StorageConnecter storageConnecter)
    {
        this.objectQuery = objectQuery;
        this.storageConnecter = storageConnecter;
    }

    @Override
    public JSONObject call()
    {
        try
        {
            JSONObject results = objectQuery.excuteQuery();
            LOG.info("Query data succeed : " + objectQuery.getClass().getSimpleName());
            JSONArray data = results.getJSONArray("data");
            for (int i = 0; i < data.length(); i++)
            {
                storageConnecter.writeFile(data.getJSONObject(i).toString(), objectQuery.getClass().getSimpleName());
            }
            LOG.info("Push data succeed : " + objectQuery.getClass().getSimpleName());
            return results;
        }
        catch (IOException ex)
        {
            LOG.info("Push data fail : " + objectQuery.getClass().getSimpleName(), ex);
        }
        catch (JSONException ex)
        {
            LOG.error("Fail to write " + objectQuery.getClass().getSimpleName() + " data", ex);
        }
        catch (Exception ex)
        {
            LOG.error("Fail to write " + objectQuery.getClass().getSimpleName() + " data", ex);
        }
        return new JSONObject();
    }
}

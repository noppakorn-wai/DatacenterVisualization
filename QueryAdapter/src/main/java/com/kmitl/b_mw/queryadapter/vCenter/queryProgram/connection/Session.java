/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.queryadapter.vCenter.queryProgram.connection;

import com.vmware.vim25.mo.*;
import flexjson.JSONException;
import flexjson.JSONSerializer;
import java.rmi.RemoteException;
import java.util.*;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import com.kmitl.b_mw.queryadapter.vCenter.configuration.Configuration;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.dataIO.StorageConnecter;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.dataTranformation.CalendarTransformer;

/**

 @author B_MW (Wai & May)
 */
public class Session
{

    private static final Logger LOG = Logger.getLogger(Session.class.getName());

    private final StorageConnecter storageConnecter;
    private final Connection connection;
    private final List<ManagedEntity> entities;
    private final Configuration config;
    private final Calendar startTime;
    private final Calendar endTime;

//    private final List<String> datacenterFilter;
//    private final List<String> resourcePoolFilter;
    private List<ManagedEntity> searchedEntities = new ArrayList<>();

    public Session(Configuration config) throws RemoteException
    {
        /*
        connection = new Connection(config.getUsername(), config.getPassword(), config.getvCenter());

        if (connection.connect() == false)
        {
            LOG.error("Connection fail...");
            throw new RemoteException();
        }

        LOG.info("Create connection success...");
//        this.datacenterFilter = config.getDataCenters();
//        this.resourcePoolFilter = config.getResourcePools();
        this.startTime = connection.getService().currentTime();
        this.endTime = (Calendar) startTime.clone();
        startTime.add(Calendar.DATE, -1);
        */
        connection = null;
        
        this.config = config;
        this.endTime = null;
        this. startTime = null;

        entities = new ArrayList<>();
//        //LOG.info("Start query entities list using given filter");

//        Folder rootFolder = connection.getService().getRootFolder();
//        entities.addAll(Arrays.asList(new InventoryNavigator(rootFolder).searchManagedEntities(true)));

        storageConnecter = new StorageConnecter(config.getDataPath(), endTime);
    }

    private List<ManagedEntity> searchEntities(ManagedEntity currentPosition) throws Exception
    {
        LOG.info("Start query entities list using given filter");
        try
        {
            String[][] typeinfo = new String[][]
            {
                new String[]
                {
                    "ManagedEntity",
                }
            };
            ManagedEntity[] childEntities = new InventoryNavigator(currentPosition).searchManagedEntities(typeinfo, false);
            for (ManagedEntity inspectedEntity : childEntities)
            {
                if (!searchedEntities.contains(inspectedEntity))
                {
                    //if (!datacenterFilter.contains("all") || !(inspectedEntity.getClass().getSimpleName().equals("Datacenter") && datacenterFilter.contains(inspectedEntity.getName()))) {
                    //if (!resourcePoolFilter.contains("all") || !(inspectedEntity.getClass().getSimpleName().equals("ResourcePool") && resourcePoolFilter.contains(inspectedEntity.getName()))) {
                    //LOG.log(Priority.INFO,("Add entity : " + inspectedEntity.getMOR().getVal() + "/" + inspectedEntity.getName());
                    //System.out.println("Add entity : " + inspectedEntity.getMOR().getVal() + "/" + inspectedEntity.getName());
                    System.out.println(inspectedEntity.getClass().getSimpleName() + ":" + inspectedEntity.getName());
                    searchedEntities.add(inspectedEntity);
                    searchEntities(inspectedEntity);
                    //}
                    //}
                }
            }
        }
        catch (RemoteException ex)
        {
            LOG.error("Could not retrive managedEntities", ex);
            throw new Exception("Could not retrive managedEntities", ex);
        }
        return searchedEntities;
    }

    public List<ManagedEntity> getEntities()
    {
        return entities;
    }

    public TaskManager getTaskManager()
    {
        return connection.getService().getTaskManager();
    }

    public EventManager getEventManager()
    {
        return connection.getService().getEventManager();
    }

    public PerformanceManager gerPerformanceManager()
    {
        return connection.getService().getPerformanceManager();
    }

    public Calendar getStartTime()
    {
        return startTime;
    }

    public Calendar getEndTime()
    {
        return endTime;
    }

    public StorageConnecter getStorageConnecter()
    {
        return storageConnecter;
    }

    public Configuration getConfig()
    {
        return config;
    }

    public JSONObject query(Class queryType, String[] includeFields)
    {
        String json;
        try
        {
            JSONSerializer serializer = new JSONSerializer();
            json = "{\"data\":[ ";
            if (entities != null)
            {
                for (ManagedEntity entitie : entities)
                {
                    try
                    {
                        LOG.info("Query data for : " + entitie.getMOR().getVal() + "/" + entitie.getName());
                        if (entitie.getClass().equals(queryType))
                        {
                            serializer.include(includeFields);
                            serializer.transform(new CalendarTransformer(), Calendar.class);
                            serializer.exclude("*");
                            json = json + serializer.serialize(Class.forName(queryType.getName()).cast(entitie)) + ",";
                        }
                    }
                    catch (JSONException ex)
                    {
                        LOG.error("Found JSON exception", ex);
                    }
                }
            }
            json = json.substring(0, json.length() - 1) + "]}";
        }
        catch (Exception ex)
        {
            LOG.error("Query fail: Exception raise", ex);
            json = "{\"data\":[]}";
        }
        return new JSONObject(json);
    }

    public void destroy()
    {
        LOG.info("Disconnect...");
        this.connection.disconnect();
    }

    @Override
    protected void finalize() throws Throwable
    {
        try
        {
            this.connection.disconnect();
        }
        finally
        {
            super.finalize();
        }
    }
}

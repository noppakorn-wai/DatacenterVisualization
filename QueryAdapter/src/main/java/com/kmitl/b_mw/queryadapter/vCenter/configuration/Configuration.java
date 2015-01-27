/*
 * Copyright 2014 B_MW (Wai & May).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.kmitl.b_mw.queryadapter.vCenter.configuration;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**

 @author B_MW (Wai & May)
 */
public class Configuration
{

    private final Properties prop;

    public Configuration(String configPath)
    {
        prop = new Properties();
        InputStream inputStream = null;
        try
        {
            if (configPath != null)
            {

                inputStream = new FileInputStream(configPath);
                prop.load(inputStream);
            }
        }
        catch (IOException ex)
        {
            Logger.getLogger(Configuration.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public Properties getProp()
    {
        return prop;
    }

    public int getTimeLimit()
    {
        return Integer.parseInt(prop.getProperty("timeLimit", "30"));
    }

    public int getThreadLimit()
    {
        return Integer.parseInt(prop.getProperty("threadLimit", "1"));
    }

    public int getMaxRetry()
    {
        return Integer.parseInt(prop.getProperty("maxRetry", "3"));
    }

    public String getDataPath()
    {
        return prop.getProperty("dataPath", "data");
    }

    public String getUsername()
    {
        return prop.getProperty("username", null);
    }

    public String getPassword()
    {
        return prop.getProperty("password", null);
    }

    public String getvCenter()
    {
        return prop.getProperty("vCenter", null);
    }

    public List<String> getQueryType()
    {
        return Arrays.asList(prop.getProperty("queryType", "AlarmQuery, TaskQuery, ClusterComputeResourceQuery, ComputeResourceQuery, DatacenterQuery, DatastoreQuery, DistributedVirtualSwitchQuery, DistributedVirtualPortgroupQuery, EventQuery, FolderQuery, HostSystemQuery, NetworkQuery, PerformanceQuery, ResourcePoolQuery, VirtualAppQuery, VirtualMachineQuery").split(",\\s*"));
    }
    
    public String getStorageHostname()
    {
        return prop.getProperty("storegeHostname", "localhost");
    }
    
    public String getDatabaseHostname()
    {
        return prop.getProperty("databaseHostname", "localhost");
    }
}

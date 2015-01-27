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
package com.kmitl.b_mw.queryadapter.vCenter.queryProgram.connection;

import com.vmware.vim25.mo.ServerConnection;
import com.vmware.vim25.mo.ServiceInstance;
import java.net.MalformedURLException;
import java.net.URL;
import java.rmi.RemoteException;
import org.apache.log4j.Logger;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.jobTask.QueryTask;

/**
 *
 * @author B_MW (Wai & May)
 */
public class Connection
{

    private static final Logger LOG = Logger.getLogger(QueryTask.class.getName());

    private final String username;
    private final String password;
    private final String ipAddress;
    protected ServiceInstance service;

    public Connection(String username, String password, String ipAddress)
    {
        this.username = username;
        this.password = password;
        this.ipAddress = ipAddress;
    }

    public ServiceInstance getService()
    {
        return service;
    }

    public ServerConnection getConnection()
    {
        return this.service.getServerConnection();
    }

    public boolean connect()
    {
        boolean connectionResult;
        try
        {
            String url = "https://" + this.ipAddress + "/sdk/vimService";
            this.service = new ServiceInstance(new URL(url), this.username, this.password, true);
            connectionResult = true;
        }
        catch (RemoteException | MalformedURLException ex)
        {
            if (this.service == null)
            {
                LOG.error("Create connector fail.", ex);
            }
            connectionResult = false;
        }
        return connectionResult;
    }

    public void disconnect()
    {
        this.service.getServerConnection().logout();
    }

}

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
package com.kmitl.b_mw.queryadapter.vCenter.queryProgram.objectQuery;

import com.vmware.vim25.mo.*;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.List;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.connection.Session;

/**

 @author B_MW (Wai & May)
 */
public class VmwareDistributedVirtualSwitchQuery implements Queryable
{

    private static final Logger LOG = Logger.getLogger(VmwareDistributedVirtualSwitchQuery.class.getName());
    private final Session session;

    public VmwareDistributedVirtualSwitchQuery(Session session)
    {
        this.session = session;
    }

    @Override
    public JSONObject excuteQuery() throws Exception
    {
        LOG.info("Start DistributedVirtualSwitchQuery.run");

        List<String> includeFields = new ArrayList<>();

        includeFields.add("MOR.val");
        includeFields.add("alarmActionEabled");
        includeFields.add("availableField.*");
        includeFields.add("capability.*");
        includeFields.add("config.*");
        includeFields.add("configIssue.*");
        includeFields.add("configStatus.*");
        includeFields.add("customValue.*");
        includeFields.add("disabledMethod");
        includeFields.add("effectiveRole");
        includeFields.add("name");
        includeFields.add("networkResourcePool.*");
        includeFields.add("overallStatus");
        includeFields.add("parent.MOR.val");
        includeFields.add("permission.*");
        includeFields.add("portgroup.key");
        includeFields.add("recentTasks.MOR.val");
        includeFields.add("runtime.*");
        includeFields.add("summary.*");
        includeFields.add("tag");
        includeFields.add("triggeredAlarmState.alarm.val");
        includeFields.add("triggeredAlarmState.overallStatus");
        includeFields.add("triggeredAlarmState.time");
        includeFields.add("uuid");
        includeFields.add("values");

        JSONObject json = session.query(VmwareDistributedVirtualSwitch.class, includeFields.toArray(new String[0]));

        return json;
    }
}

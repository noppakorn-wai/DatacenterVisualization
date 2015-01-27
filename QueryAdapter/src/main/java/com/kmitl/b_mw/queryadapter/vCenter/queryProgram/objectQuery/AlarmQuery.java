/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.queryadapter.vCenter.queryProgram.objectQuery;

import com.vmware.vim25.*;
import com.vmware.vim25.mo.*;
import flexjson.JSONSerializer;
import java.util.*;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.connection.Session;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.dataTranformation.CalendarTransformer;

/**

 @author B_MW (Wai & May)
 */
public class AlarmQuery implements Queryable
{

    private static final Logger LOG = Logger.getLogger(AlarmQuery.class.getName());
    private final Session session;

    public AlarmQuery(Session session)
    {
        this.session = session;
    }

    @Override
    public JSONObject excuteQuery()
    {
        LOG.info("Start AlarmQuery.run");
        Map<String, AlarmInfo> alarmsMap = new HashMap<>();
        JSONSerializer serializer = new JSONSerializer();
        List<ManagedEntity> entities = session.getEntities();
        if (entities != null)
        {
            for (ManagedEntity entity : entities)
            {
                LOG.info("Get alarms from " + entity.getMOR().getVal() + "/" + entity.getName());
                AlarmState[] alarmstates = entity.getDeclaredAlarmState();
                if (alarmstates != null)
                {
                    for (AlarmState alarmState : alarmstates)
                    {
                        Alarm alarm = new Alarm(entity.getServerConnection(), alarmState.getAlarm());
                        alarmsMap.put(alarm.getMOR().getVal(), alarm.getAlarmInfo());
                    }
                }
            }
        }
        serializer.transform(new CalendarTransformer(), Calendar.class);
        serializer.include("*");

        JSONObject data = new JSONObject();
        JSONArray arr = new JSONArray();
        for (String key : alarmsMap.keySet())
        {
            arr.put(new JSONObject(serializer.serialize(alarmsMap.get(key))));
        }
        data.put("data", arr);
        return data;
    }
}

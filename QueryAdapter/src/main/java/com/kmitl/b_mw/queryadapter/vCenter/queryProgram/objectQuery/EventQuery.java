/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.queryadapter.vCenter.queryProgram.objectQuery;

import com.vmware.vim25.*;
import com.vmware.vim25.mo.*;
import flexjson.JSONSerializer;
import java.rmi.RemoteException;
import java.util.*;
import java.util.logging.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.Priority;
import org.json.*;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.connection.Session;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.dataTranformation.CalendarTransformer;

/**

 @author B_MW (Wai & May)
 */
public class EventQuery implements Queryable
{

    private static final Logger LOG = Logger.getLogger(EventQuery.class.getName());
    private final Session session;
    private final Calendar startTime;
    private final Calendar endTime;

    public EventQuery(Session session)
    {
        this.session = session;
        this.startTime = session.getStartTime();
        this.endTime = session.getEndTime();
    }

    @Override
    public JSONObject excuteQuery()
    {
        LOG.info("Start EventQuery.run to get events from " + startTime.getTime() + " to " + endTime.getTime());

        List<ManagedEntity> entities = session.getEntities();

        JSONSerializer serializer;
        serializer = new JSONSerializer();
        serializer.transform(new CalendarTransformer(), Calendar.class);
        serializer.transform(new CalendarTransformer(), GregorianCalendar.class);
        serializer.include("*");

        JSONObject data = new JSONObject();
        JSONArray events = new JSONArray();
        data.put("data", events);

        Map<String, List<Event>> objects_event = new HashMap<>();
        EventManager eventManager = session.getEventManager();

        if (entities != null)
        {
            EventFilterSpec efs = new EventFilterSpec();
            EventFilterSpecByTime spec_time = new EventFilterSpecByTime();
            EventFilterSpecByEntity spec_entity = new EventFilterSpecByEntity();

            spec_time.beginTime = startTime;
            spec_time.endTime = endTime;
            efs.setTime(spec_time);

            for (ManagedEntity entity : entities)
            {

                LOG.info("Get events from " + entity.getMOR().getVal() + "/" + entity.getName());
                String entityName = entity.getMOR().getVal();

                spec_entity.setEntity(entity.getMOR());
                spec_entity.setRecursion(EventFilterSpecRecursionOption.self);
                efs.setEntity(spec_entity);

                EventHistoryCollector eventCollector;
                try
                {
                    eventCollector = eventManager.createCollectorForEvents(efs);
                    Event[] e = eventCollector.readNextEvents(1);
                    while (e != null)
                    {
                        events.put(new JSONObject(e[0]));
                        try
                        {
                            e = eventCollector.readNextEvents(1);
                        }
                        catch (RemoteException ex)
                        {
                            LOG.warn("End of event collection " + entityName, ex);
                        }
                    }
                    eventCollector.destroyCollector();
                }
                catch (RemoteException ex)
                {
                    LOG.error("Fail to retrive events from " + entityName, ex);
                }
                break;
            }
        }

        return data;
    }
}

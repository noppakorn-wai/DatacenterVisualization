/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.queryadapter.vCenter.queryProgram.objectQuery;

import com.vmware.vim25.*;
import com.vmware.vim25.mo.TaskHistoryCollector;
import com.vmware.vim25.mo.TaskManager;
import flexjson.JSONSerializer;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.connection.Session;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.dataTranformation.CalendarTransformer;

/**

 @author B_MW (Wai & May)
 */
public class TaskQuery implements Queryable
{

    private static final Logger LOG = Logger.getLogger(AlarmQuery.class.getName());
    private final Session session;

    public TaskQuery(Session session)
    {
        this.session = session;
    }

    @Override
    public JSONObject excuteQuery()
    {
        TaskManager taskManager = session.getTaskManager();
        TaskFilterSpec taskSpec = new TaskFilterSpec();
        TaskFilterSpecByTime taskTime = new TaskFilterSpecByTime();
        taskTime.setBeginTime(session.getStartTime());
        taskTime.setEndTime(session.getEndTime());
        taskTime.setTimeType(TaskFilterSpecTimeOption.startedTime);

        JSONSerializer serializer;
        serializer = new JSONSerializer();
        serializer.transform(new CalendarTransformer(), Calendar.class);
        serializer.include("*");

        JSONObject data = new JSONObject();
        JSONArray tasks = new JSONArray();
        data.put("data", tasks);
        try
        {
            TaskHistoryCollector taskHis = taskManager.createCollectorForTasks(taskSpec);
            while (true)
            {
                TaskInfo[] result = taskHis.readNextTasks(1);
                if (result != null)
                {
                    TaskInfo taskInfo = result[0];
                    SimpleTask task = new SimpleTask();
                    if (taskInfo.getState().equals(TaskInfoState.success))
                    {
                        task.endTime = taskInfo.getCompleteTime().getTime().getTime();
                    }
                    task.startTime = taskInfo.getStartTime().getTime().getTime();
                    task.eventId = taskInfo.getEventChainId();
                    task.key = taskInfo.getKey();
                    task.name = taskInfo.getName();
                    task.target = taskInfo.getEntityName();
                    task.description = taskInfo.getDescriptionId();
                    task.name = taskInfo.getState().name();
                    tasks.put(new JSONObject(serializer.serialize(task)));
                }
                else
                {
                    break;
                }
            }
        }
        catch (RemoteException ex)
        {
            LOG.error("Caugh exception : ", ex);
        }

        return data;
    }

    public class SimpleTask
    {

        public long startTime;
        public long endTime;
        public String key;
        public String name;
        public String description;
        public int eventId;
        public String target;
        public String state;
    }
}

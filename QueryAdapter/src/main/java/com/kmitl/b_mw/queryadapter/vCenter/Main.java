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
package com.kmitl.b_mw.queryadapter.vCenter;

import com.kmitl.b_mw.common.nodeModel.BasicNode;
import com.kmitl.b_mw.queryadapter.vCenter.configuration.Configuration;
import com.kmitl.b_mw.queryadapter.vCenter.dataConverter.nodeConverter.Convertable;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.connection.Session;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.dataIO.StorageConnecter;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.jobTask.QueryTask;
import com.kmitl.b_mw.queryadapter.vCenter.queryProgram.objectQuery.Queryable;
import com.kmitl.b_mw.storageadapter.rabbitmq.RabbitMQAdapter;
import flexjson.JSONSerializer;
import java.io.File;
import java.io.IOException;
import static java.lang.System.exit;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.nio.file.FileSystems;
import java.rmi.RemoteException;
import java.util.*;
import java.util.concurrent.*;
import org.apache.commons.io.LineIterator;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

/**

 @author B_MW (Wai & May)
 */
public class Main
{

    private static final Logger LOG = Logger.getLogger(Main.class.getName());

    public static void main(String args[]) throws InterruptedException, RemoteException, IOException
    {
        Configuration config = getConfig(args);

        if (config == null)
        {
            LOG.error("Get configuration fail");
            exit(0);
        }
        Session session = createSession(config);

//        //[TODO : Debug only]
        Calendar c = Calendar.getInstance();
        c.setTimeZone(TimeZone.getDefault());
        c.set(2014, 11, 1, 23, 00, 02);
        session.getStorageConnecter().setEndTime(c);
//        //[TODO : Debug only]

        queryData(session);
        generateNode(session);
        session.destroy();
    }

    public static Configuration getConfig(String args[])
    {
        String configPath = FileSystems.getDefault().getPath(new File(System.getProperty("user.dir")).getAbsolutePath(), "config.properties").toString();
        Configuration config;

        if (args.length < 1)
        {
            PropertyConfigurator.configure(configPath);
            LOG.info("Going to use default path: " + configPath);
        }
        else
        {
            PropertyConfigurator.configure(args[0]);
            config = new Configuration(args[0]);
        }

        try
        {
            return new Configuration(configPath);
        }
        catch (Exception ex)
        {
            System.out.println("Could not get config file");
            return null;
        }
    }

    public static Session createSession(Configuration config)
    {
        Session session = null;
        for (int i = 0; session == null && i < config.getMaxRetry(); i++)
        {
            try
            {
                session = new Session(config);
            }
            catch (RemoteException ex)
            {
                LOG.info("Could not create session : Count " + i, ex);
            }
        }

        if (session == null)
        {
            LOG.error("Get session fail, couldn't initial connection.");
            exit(0);
        }

        return session;
    }

    private static void queryData(Session session)
    {
        StorageConnecter storageConnecter = session.getStorageConnecter();
        ExecutorService executor = Executors.newFixedThreadPool(session.getConfig().getThreadLimit());

        Map<String, Future> results = new HashMap<>();
        for (String queryType : session.getConfig().getQueryType())
        {
            try
            {
                Class queryClass = Class.forName("queryAdapter.vCenter.queryProgram.objectQuery." + queryType);
                Constructor constructor = queryClass.getConstructor(Session.class);
                Object instanceOfMyClass = constructor.newInstance(session);
                Queryable queryClassInstance = ((Queryable) instanceOfMyClass);
                QueryTask queryTask = new QueryTask(queryClassInstance, storageConnecter);
                Future submitedTask = executor.submit(queryTask);
                results.put(queryType, submitedTask);
            }
            catch (IllegalArgumentException | InvocationTargetException | ClassNotFoundException | InstantiationException | IllegalAccessException | NoSuchMethodException | SecurityException ex)
            {
                LOG.error("No query class for : " + queryType, ex);
            }
        }

        LOG.info("Time limit is set to " + session.getConfig().getTimeLimit() + " minutes");

        try
        {
            executor.shutdown();
            executor.awaitTermination(session.getConfig().getTimeLimit(), TimeUnit.MINUTES);
        }
        catch (InterruptedException ex)
        {
            LOG.error(null, ex);
        }

        String runningStatus = "";
        for (String resultName : results.keySet())
        {
            runningStatus = runningStatus.concat("\n " + resultName + " status : " + results.get(resultName).isDone());
        }

        LOG.info(runningStatus);
    }

    private static void generateNode(Session session) throws IOException
    {
        RabbitMQAdapter storage = new RabbitMQAdapter(session.getConfig().getStorageHostname());
        StorageConnecter p = session.getStorageConnecter();
        for (String queryType : session.getConfig().getQueryType())
        {
            LOG.info(queryType);
            LineIterator li = p.openFile(queryType);
            queryType = "queryAdapter.vCenter.dataConverter.objectModel." + queryType.subSequence(0, queryType.length() - 5);
            if (li != null)
            {
                while (true)
                {
                    String readResult = p.readLine(li);
                    if (readResult == null)
                    {
                        break;
                    }
                    else
                    {
                        Object instanceOfMyClass;
                        try
                        {
                            Class queryClass = Class.forName(queryType);
                            Constructor constructor = queryClass.getConstructor(String.class);
                            instanceOfMyClass = constructor.newInstance(readResult);
                        }
                        catch (IllegalArgumentException | InvocationTargetException | ClassNotFoundException | InstantiationException | IllegalAccessException | NoSuchMethodException | SecurityException ex)
                        {
                            LOG.error("No query class for : " + queryType, ex);
                            break;
                        }
                        List<BasicNode> convertResult = ((Convertable) instanceOfMyClass).toBasicNodes();
                        for (BasicNode node : convertResult)
                        {
                            if (node.getClass().getName().equals(BasicNode.class.getName()))
                            {
                                String data = new JSONSerializer().deepSerialize(node);
                                storage.send(data);
                            }
                            else
                            {
                                try
                                {
                                    String data = new JSONSerializer().deepSerialize(Class.forName(node.getClass().getName()).cast(node));
                                    LOG.info("Retrive data success");
                                    storage.send(data);
                                }
                                catch (ClassNotFoundException ex)
                                {
                                    LOG.error("Couldn't cast result", ex);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

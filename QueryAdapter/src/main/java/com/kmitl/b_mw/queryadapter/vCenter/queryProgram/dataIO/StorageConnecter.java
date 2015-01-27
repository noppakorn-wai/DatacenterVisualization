/**
 * **************************************************************************
 Copyright Peerawit Praphanwittaya & Apirat Puttaraksa * * Licensed under the
 Apache License, Version 2.0 (the "License"); * you may not use this file except
 in compliance with the License. * You may obtain a copy of the License at * *
 http://www.apache.org/licenses/LICENSE-2.0 * * Unless required by applicable
 law or agreed to in writing, software	* distributed under the License is
 distributed on an "AS IS" BASIS, * WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied. * See the License for the specific language
 governing permissions and * limitations under the License. *
 */
package com.kmitl.b_mw.queryadapter.vCenter.queryProgram.dataIO;

import java.io.*;
import java.nio.file.*;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.LineIterator;
import org.apache.log4j.Logger;

public class StorageConnecter
{

    private static final Logger LOG = Logger.getLogger(StorageConnecter.class.getName());

    private final String path;
    private Calendar endTime;
    private final SimpleDateFormat format;

    public StorageConnecter(String path, Calendar endTime)
    {
        this.path = path;
        this.endTime = endTime;
        format = new SimpleDateFormat("dd-MM-yyy(HH.mm.ss)");
    }

    public void writeFile(String json, String subPath)
    {
        try
        {
            Path folder = Paths.get(this.path, subPath).toAbsolutePath().normalize();
            try
            {
                folder = Files.createDirectories(folder);
            }
            catch (IOException ex)
            {
                LOG.error("Create folder fail", ex);
                return;
            }
            File file = new File(folder.toString(), String.valueOf(format.format(endTime.getTime().getTime())));
            file.setWritable(true);
            try
            {
                if (file.createNewFile())
                {
                    LOG.info("Create file succeed : " + file.getName());
                }
                else
                {
                    LOG.error("Create file fail : " + file.getName());
                }
            }
            catch (IOException ex)
            {
                LOG.error(ex);
                return;
            }
            Path filePath = folder.resolve(String.valueOf(format.format(endTime.getTime().getTime())));
            try
            {
                try (PrintWriter writer = new PrintWriter(new FileWriter(file, true)))
                {
                    writer.append(json + "\n");
                }
            }
            catch (IOException ex)
            {
                LOG.error("Write operation fail", ex);
            }
            catch (Exception ex)
            {
                LOG.error(ex);
            }
        }
        catch (Exception ex)
        {
            LOG.error(ex);
        }
    }

    public LineIterator openFile(String subPath)
    {
        Path folder = Paths.get(this.path, subPath).toAbsolutePath().normalize();
        Path filePath = folder.resolve(String.valueOf(format.format(endTime.getTime().getTime())));
        LineIterator li;
        try
        {
            li = FileUtils.lineIterator(filePath.toFile(), "UTF-8");
            LOG.info("Open file : " + filePath.toString() + " secceed.");
        }
        catch (IOException ex)
        {
            LOG.error(ex);
            li = null;
        }
        return li;
    }

    public void setEndTime(Calendar endTime)
    {
        this.endTime = endTime;
    }

    public String readLine(LineIterator li)
    {
        String readResult;
        try
        {
            readResult = (String) li.next();
        }
        catch (Exception ex)
        {
            LOG.error(ex);
            readResult = null;
        }
        return readResult;
    }
}

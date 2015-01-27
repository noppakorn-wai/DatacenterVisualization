/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.queryadapter.vCenter.queryProgram.dataTranformation;

import flexjson.ObjectBinder;
import flexjson.ObjectFactory;
import flexjson.transformer.AbstractTransformer;
import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import org.json.JSONException;

/**

 @author B_MW (Wai & May)
 */
public class CalendarTransformer extends AbstractTransformer implements ObjectFactory
{

    @Override
    public void transform(Object object)
    {
        Calendar c = (Calendar) object;
        getContext().transform(c.get(Calendar.DAY_OF_MONTH) + "/" + c.get(Calendar.MONTH) + "/" + c.get(Calendar.YEAR) + " " + c.get(Calendar.HOUR_OF_DAY) + ":" + c.get(Calendar.MINUTE) + ":" + c.get(Calendar.SECOND) + "." + c.get(Calendar.MILLISECOND) + " " + c.get(Calendar.ZONE_OFFSET));
    }

    @Override
    public Object instantiate(ObjectBinder context, Object value, Type targetType, Class targetClass)
    {
        try
        {
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss.SSS Z");
            return sdf.parse(value.toString());
        }
        catch (ParseException ex)
        {
            throw new JSONException(String.format("Failed to parse %s", value));
        }
    }
}

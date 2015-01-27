/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kmitl.b_mw.storageadapter.rabbitmq;

import com.rabbitmq.client.*;
import java.io.IOException;
import org.apache.log4j.Logger;

/**

 @author B_MW (Wai & May)
 */
public class RabbitMQAdapter
{

    private static final Logger LOG = Logger.getLogger(RabbitMQAdapter.class.getName());

    private final String TASK_QUEUE_NAME = "task_queue";
    private final Channel channel;
    private final Connection connection;
    private final QueueingConsumer consumer;

    public RabbitMQAdapter(String hostname) throws IOException
    {
        ConnectionFactory factory = new ConnectionFactory();

        // [TODO : Fix this]
        factory.setHost(hostname);
//        factory.setUsername("wait");
//        factory.setPassword("wait");

        connection = factory.newConnection();

        channel = connection.createChannel();

        channel.queueDeclare(TASK_QUEUE_NAME, true, false, false, null);

        consumer = new QueueingConsumer(channel);

        channel.basicConsume(TASK_QUEUE_NAME, false, consumer);
    }

    public void send(String message) throws IOException
    {
        channel.basicPublish("", TASK_QUEUE_NAME, MessageProperties.PERSISTENT_TEXT_PLAIN, message.getBytes());
        LOG.info(" [x] Sent '" + message + "'");
    }

    public String receive() throws InterruptedException, ConsumerCancelledException, ShutdownSignalException, IOException
    {
        String message;
        channel.basicQos(1);

        QueueingConsumer.Delivery delivery = consumer.nextDelivery(60000);
        
        if (delivery != null)
        {
            message = new String(delivery.getBody());

            LOG.info(" [x] Received '" + message + "'");

            channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
        }
        else
        {
            message = null;
        }
        return message;
    }

    public void destroy()
    {
        try
        {
            channel.close();
            connection.close();
        }
        catch (IOException ex)
        {
            LOG.info("Session already destroy");
        }
    }
}

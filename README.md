# Journey Reminder

A Jorney Remainder which will help you to set email remainder for your journey

## Demo

## Tech Stack
+ Node JS
+ Java
+ Mysql

```bash 
$ git clone https://github.com/agaraman0/journeyReminder.git
$ cd journeyReminder/
```

Application is going to run into two parts 
1. Email Scheduling : This will be responsible for email scheduling to send remainder email at particular time. 
2. Application Server: This will be our main server on which our application will run and pass it to Email Scheduling Server.

## Email Scheduling
We are using Mysql database so install mysql database if you have not installed it and follow instrunctions manually

1. create a Database name **schedule_email**. 
2. Please download the following SQL script and run it in your MySQL database to create all the Quartz specific tables.
+ [Jobs Database table Script](https://github.com/quartznet/quartznet/blob/master/database/tables/tables_mysql_innodb.sql)
```bash
mysql> source <PATH_TO_Jobs_Database_table_Script.sql> 
``` 
4. change to folder name **email_scheduler** in cloned repo.
```bash
$ cd email_scheduler
```
5. update `spring.datasource.username` and `spring.datasource.password` in [application.properties](/email-scheduler/src/main/resources/application.properties) according to system Mysql Configuration. ( or parse as argument via CLI)
6. [optional] if we want to run our email scheduler on specific port so for that we can add ``server.port=<port_number>`` in [application.properties](/email-scheduler/src/main/resources/application.properties) 
7. Run application
```bash
$ mvn spring-boot:run -Dspring-boot.run.arguments=--spring.mail.password=<password>,--spring.mail.username=<email>
```

Now our email scheduler server is running at http://localhost:8080

*Note:* 8080 is default port number but you can define port number by following step 5
Note that, Gmail’s SMTP access is disabled by default. To allow email scheduler to send emails using your Gmail account -

-   Go to [https://myaccount.google.com/security?pli=1#connectedapps](https://myaccount.google.com/security?pli=1#connectedapps)
-   Set ‘Allow less secure apps’ to YES

Now we are good to move on our Application Server as Email Scheduler is running fine

## Application Server

Open Another Terminal and run following commands in cloned repo 

```bash
$ cd conwoTask
$ npm install
```

Add Google Map API key and Scheduler port in `.env_sample` or parse via CLI

```bash
$ node index.js
```
Run on specific port 

```bash
$ PORT=<port> node index.js
```

open browser and check at this address

http://localhost:3000/

# Journey Reminder

A Jorney Remainder which will help you to set email remainder for your journey

## Tech Stack
+ Node JS
+ Java
+ Mysql

**Clone The Application**

```bash 
$ git clone https://github.com/agaraman0/journeyReminder.git
$ cd journeyReminder/
```

Application is going to run into two parts 
1. Email Scheduling : This will be responsible for email scheduling to send remainder email at particular time. 
2. Application Server: This will be our main server on which our application will run and pass it to Email Scheduling Server.

## Email Scheduling
We are using Mysql database so install mysql database if you have not installed it and follow instrunctions manually

#### Create a Database name **schedule_email**. 
```bash
mysql> create database schedule_email;
mysql> use schedule_email;
mysql> GRANT ALL PRIVILEGES ON schedule_email.* TO 'username'@'localhost';
```
#### Download the following SQL script and run it in your MySQL database to create all the Quartz specific tables.
	+ [Jobs Database table Script](https://github.com/quartznet/quartznet/blob/master/database/tables/tables_mysql_innodb.sql)
```bash
mysql> source <PATH_TO_Jobs_Database_table_Script.sql> 
``` 

#### Update `spring.datasource.username` and `spring.datasource.password` in [application.properties](/email-scheduler/src/main/resources/application.properties) according to your Mysql Configuration. ( or parse as argument via CLI)

####  Change to folder **email_scheduler** in cloned repo.
```bash
$ cd email_scheduler
``` 
####  **Run application**
```bash
$ mvn spring-boot:run -Dspring-boot.run.arguments=--spring.mail.password=<password>,--spring.mail.username=<email>
```

**NOTE**
    +  8080 is default port number but you can define port number by following step 4
    + Gmail’s SMTP access is disabled by default. To allow email scheduler to send emails using your Gmail account -

        -   Go to [https://myaccount.google.com/security?pli=1#connectedapps](https://myaccount.google.com/security?pli=1#connectedapps)
        -   Set ‘Allow less secure apps’ to YES


Now we are good to move on our Application Server as Email Scheduler is running fine

## Application Server

#### Open Another Terminal and run following commands in cloned repo 

```bash
$ cd conwoTask
$ npm install
```

#### Add Google Map API key and Scheduler port in `.env_sample` and rename it as `.env` or parse via CLI

![Screenshot from 2020-06-26 11-11-24](https://user-images.githubusercontent.com/29687692/85826827-9e801300-b7a2-11ea-8d21-1f9c044d10e5.png)

#### **Run Application**

```bash
$ node index.js
```
To Run App on specific port 

```bash
$ PORT=<port> node index.js
```

open browser and check at this address

http://localhost:3000/



## Resource
+ [Spring Boot Quartz Scheduler Example: Building an Email Scheduling app](https://www.callicoder.com/spring-boot-quartz-scheduler-email-scheduling-example/)



## Screenshots

![Screenshot_2020-06-26 Document](https://user-images.githubusercontent.com/29687692/85827439-ef443b80-b7a3-11ea-8415-e19a688079d9.png)


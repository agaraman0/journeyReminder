// Utilities Import
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request')
const moment = require('moment');
require('dotenv').config();


const app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))


// console.log(process.env.SCHEDULER_PORT)

// Function will return Reaminder time to send mail
function timeConstructor(dateTime,timeSec){

    var utcOffset = 19800

    var newUnixTimeStamp = moment(dateTime, 'YYYY-MM-DDTHH:mm').unix()
    var timeNow = Math.floor(Date.now() / 1000)

    newUnixTimeStamp = newUnixTimeStamp - timeSec
    
    if (newUnixTimeStamp > timeNow){
        
        var remainderTime = new Date((newUnixTimeStamp + utcOffset)*1000)

        console.log(remainderTime,1)

        return remainderTime.toISOString()
    } 
    else{

        var remainderTime = new Date(Date.now()+(utcOffset*1000))

        console.log(remainderTime,0)

        return remainderTime.toISOString()
    }

}

// Mail Format Function

function mailFormat(source,destination,time,email){
  
    return "Source: " + source + "<br><br>" + "Destination: " + destination + "<br><br>" + "Time: " + time + "<br><br>" + "Email: " + email + "<br><br>";
}


app.listen( process.env.PORT || 3000, function() {
    console.log("Hey There, Server is listening")
})

app.post('/', function(req,res){

    var slat = req.body.sourceLat
    var slong = req.body.sourceLong

    var dlat = req.body.desLat
    var dlong = req.body.desLong

    var dateTime = req.body.time 

    var email = req.body.mail

    // console.log(process.env.GOOGLE_MAP_API)

    var options = {
        url : "https://maps.googleapis.com/maps/api/distancematrix/json",
        method : "GET",
        qs : {
            origins: slat + ',' + slong,
            destinations:dlat + ',' + dlong,
            key: process.env.GOOGLE_MAP_API
        }
    }

    request(options, function(error,response,body){

        // console.log(response.body)

        if(error){
            res.send("<h1>Request Failure Try Again Later</h1>")
        }
        else {
            if (response.statusCode == 200){
                var data = JSON.parse(body)
                
                var durationData = data.rows[0].elements[0]
                
                var destination_addresses = data.destination_addresses[0]
                var origin_addresses = data.origin_addresses[0]
                

                if (durationData.status == "OK"){
                    timeSec = durationData.duration.value
                    // console.log(timeSec)

                    var emailRemain = timeConstructor(dateTime,timeSec)
                    var mailMsg = mailFormat(origin_addresses,destination_addresses,dateTime,email)

                    console.log(mailMsg)
                    console.log(emailRemain.slice(0,19))

                    var headers = {
                        'Content-Type': 'application/json'
                    };
                    
                    var dataString = {
                        "email":email,
                        "subject":"Time To Leave",
                        "body":mailMsg,
                        "dateTime":emailRemain.slice(0,19),
                        "timeZone":"Asia/Kolkata"
                    };
                    
                    var scheduleJourney = {
                        url: 'http://localhost:'+process.env.SCHEDULER_PORT+'/scheduleEmail',
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(dataString)
                    };

                    request(scheduleJourney, function(err,respo,body){
                        if (err){
                            res.send("Some Error Occured, Try later")
                        }
                        else if (respo.statusCode==200){
                            
                            var result = JSON.parse(body)
                            res.send(result.message)
                        }

                        else {
                            res.send("Try Again Later, Service Offline")
                        }

                    })


                }
                else if (durationData.status == 'ZERO_RESULTS'){
                    console.log("indicates no route could be found between the origin and destination.")
                    res.send("indicates no route could be found between the origin and destination.")
                }
                else if (durationData.status == 'NOT_FOUND'){
                    console.log("indicates that the origin and/or destination of this pairing could not be geocoded.")
                    res.send("indicates that the origin and/or destination of this pairing could not be geocoded.")
                }
                else if(durationData.status == "MAX_ROUTE_LENGTH_EXCEEDED"){
                    console.log("indicates the requested route is too long and cannot be processed.")
                    res.send("indicates the requested route is too long and cannot be processed.")
                }

            }
        }

    })

})

app.get('/', function(req,res){

    res.sendFile(__dirname + '/index.html')
})
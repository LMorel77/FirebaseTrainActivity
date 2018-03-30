$(document).ready(function(){

    var database = firebase.database();
    var trainSchedule = [];

    // Firebase and HTML update on page load/reload/value update
    database.ref().on("value", function (snapshot) {

        if (snapshot.child("trainInfo").exists()) {

            // Copy Firebase Data Into Local Object Array and Print to HTML
            trainSchedule = snapshot.val().trainInfo;
            updateWebPage(trainSchedule);

        }
        else {

            trainSchedule = [
                {
                    trainName: "Trenton Local",
                    destination: "Trenton, NJ",
                    frequency: 25,
                    firstTrain: "05:00",
                },
                {
                    trainName: "Polar Express",
                    destination: "North Pole, Canada",
                    frequency: 3600,
                    firstTrain: "01:00",
                },
                {
                    trainName: "Stonybrook Wagon",
                    destination: "Stonybrook, NY",
                    frequency: 15,
                    firstTrain: "9:00",
                },
                {
                    trainName: "London High Speed",
                    destination: "Heathrow Airport",
                    frequency: 45,
                    firstTrain: "4:00",
                },
                {
                    trainName: "Bullet Maglev",
                    destination: "Tokyo, Japan",
                    frequency: 60,
                    firstTrain: "6:00"
                }
            ];

            database.ref().update({
                trainInfo: trainSchedule
            });

            updateWebPage(trainSchedule);

        }

        // Log any errors. 
    }, function (errorObject) {

        console.log("A Firebase error has occurred: " + errorObject.code);

    });

    // Update the Schedule on the Web Page
    function updateWebPage(objectArray) {

        $("#train-schedule").empty();

        for (let i = 0; i < objectArray.length; i++) {

            var tFreq = objectArray[i].frequency;
            var tFirst = objectArray[i].firstTrain;
    
            // Performing Time Calculations
            var timeDiff = moment().diff(moment.unix(tFirst), "minutes");
            var tRemain = moment().diff(moment.unix(tFirst), "minutes") % tFreq;
            var tMinutes = tFreq - tRemain;
            var tArrival = moment().add(tMinutes, "m").format("hh:mm A");
            
            // Update Schedule on Web Page
            var tableRow = $("<tr>");
            var trainNameTd = $("<td>").append(objectArray[i].trainName);
            var destinationTd = $("<td>").append(objectArray[i].destination);
            var frequencyTd = $("<td>").append(tFreq);
            var nextTrainTd = $("<td>").append(tArrival);
            var minutesAwayTd = $("<td>").append(tMinutes);
            tableRow.append(trainNameTd, destinationTd, frequencyTd, nextTrainTd, minutesAwayTd);
            $("#train-schedule").append(tableRow);
        }
    }

    // Add New Train
    $("#add-train").on("click", function (event) {

        // Preventing page refresh
        event.preventDefault();

        // Gather New Train Input
        var tNameInput = $("#train-name-input").val().trim();
        var tDestInput = $("#destination-input").val().trim();
        var tFreqInput = $("#frequency-input").val().trim();
        var tTimeInput = moment($("#train-time-input").val().trim(), "HH:mm").subtract(10, "years").format("X");

        // Stop code execution if fields are blank
        if (tNameInput === "" && tDestInput === "" && tFreqInput === "" && tTimeInput === "") {
            return;
        }

        // Store New Train In New Object
        var newTrain = {
            trainName: tNameInput,
            destination: tDestInput,
            frequency: tFreqInput,
            firstTrain: tTimeInput
        }

        // Add New Train to Object Array and Update Firebase
        trainSchedule.push(newTrain);
        database.ref().update({
            trainInfo: trainSchedule
        });

        // Clear Input Fields
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#train-time-input").val("");
        $("#frequency-input").val("");

    });

});
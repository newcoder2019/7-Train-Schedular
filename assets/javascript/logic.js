<script src="https://www.gstatic.com/firebasejs/5.5.8/firebase.js"></script>

//   Initialize Firebase
var config = {
  apiKey: "AIzaSyAeET9dh3T6KCn0ECslTEN1xdTRT9t7u-A",
  authDomain: "fire-base-train-schedule.firebaseapp.com",
  databaseURL: "https://fire-base-train-schedule.firebaseio.com",
  projectId: "fire-base-train-schedule",
  storageBucket: "fire-base-train-schedule.appspot.com",
  messagingSenderId: "241063767190"
};

firebase.initializeApp(config);

function displayRealTime() {
  setInterval(function () {
    $('#current-time').html(moment().format
      ('hh:mm A'))
  }, 1000);
}

displayRealTime();

var tRow = "";
var getKey = "";

$("submit-button").on("click", function () {
  event.preventDefault();

  var trainName = $("#train-name").val().trim();
  var destination = $("destination").val().trim();
  var firstTrainTime = $("#first-train-time").val().trim();
  var trainFrequency = $("frequency").val().trim();

  console.log(trainName);
  console.log(destination);
  console.log(firstTrainTime);
  console.log(trainFrequency);

  if (trainName === "" || destination === "" || firstTrainTime === "" || trainFrequency === "") {
    $("#not-military-time").empty();
    $("#missing-field").html("ALL fields are required to add a train to schedule.");
    return false;
  }
  else if (trainName === null || destination === null || firstTraintime === null || trainFrequency === null) {
    $("#not-military-time").empty();
    $("#not-a-number").empty();
    $("#missing-field").html("All fields are required to add a train to the schedule.");
    return false;
  }

  else if (firstTraintime.lenght !== 5 || firstTrainTime.substring(2, 3) !== ":") {
    $("#missing-field").empty();
    $("#not-a-number").empty();
    $("#not-military-time").html("Time must be in military format: HH:mm. For example, 17:00.");
    return false;
  }

  else if (isNaN(trainFrequency)) {
    $("#missing-field").empty();
    $("#not-military-time").empty();
    $("#not-a-number").html("Not a number. Enter a number (in minutes).");
    return false;
  } else {
    $("#not-military-time").empty();
    $("#missing-field").empty();
    $("#not-a-number").empty();

    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

    var tMinutesTillTrain = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrain = moment().add
      (tMinutesTillTrain, "minutes").format("hh:mm A");
    console.log("ARRIVAL TIME: " + moment
      (nextTrain).format("hh:mm"));

    var newTrain = {
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      trainFrequency: trainFrequency,
      nextTrain: nextTrain,
      tMinutesTillTrain: tMinutesTillTrain,
      currentTime: currentTime.format("hh:mm A")
    };

    database.ref().push(newTrain);

    console.log("train name in database: " + newTrain.trainName);
    console.log("destination in database: " + newTrain.destination);
    console.log("first train time in database: " + newTrain.firstTrainTime);
    console.log("train frequency in database: " + newTrain.trainFrequency);
    console.log("next train in database: " + newTrain.nextTrain);
    console.log("minutes away in database: " + newTrain.tMinutesTillTrain);
    console.log("current time in database: " + newTrain.currentTime);

    $(".add-train-modal").html("<p>" + newTrain.trainName + " was successfully added to the current schedule");
    $('addTrain').modal();

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequecy").val("");
  }
});

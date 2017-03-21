// Initialize Firebase
var config = {
    apiKey: "AIzaSyCTjgBGJSHmDQ_I_cEOCj2MJFMQbSyRt-Q",
    authDomain: "maps-project-2da39.firebaseapp.com",
    databaseURL: "https://maps-project-2da39.firebaseio.com",
    storageBucket: "maps-project-2da39.appspot.com",
    messagingSenderId: "51725429296"
};
firebase.initializeApp(config);

//database variable
var database = firebase.database();


//map creation function
function initMap() {
    var savannah = {lat: 32.076176, lng: -81.088371};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: savannah
    });

    //for each child added to database, run populateMap function
    database.ref().on("child_added", function(childSnapshot){
        populateMap(childSnapshot.val());
    });

    //a variable for an infoWindow that uses contentString for the text
    var infowindow = new google.maps.InfoWindow({
        content: "contentString"
    });

    //populates map with markers and text for contentString from database
    function populateMap(db) {


        //creates markers for locations
        if (db.city === "Savannah") {
            var marker = new google.maps.Marker({
                position: {lat: JSON.parse(db.coordinateLat), lng: JSON.parse(db.coordinateLng)},
                icon: 'Savannah_official_seal.png',
                map: map
            })
        } else {
            var marker = new google.maps.Marker({
                position: {lat: JSON.parse(db.coordinateLat), lng: JSON.parse(db.coordinateLng)},
                map: map
            })
        };

        //variable to join city and state
        if (db.city === "") {
            var cityState = db.state
        } else {
            var cityState = [db.city, db.state].join(", ")
        };
        

        //text for infowindows
        var contentString = '<div id="content">'+
        '<h1 id="firstHeading" class="firstHeading">' + cityState + '</h1>'+
        '<h3>Incentives</h3>' +
        '<div id="bodyContent">'+
        '<ul>' +
        '<li>Expenditure Percentage: ' + db.expendPer + '</li>' +
        '<li>Labor Percentage: ' + db.laborPer + '</li>' +
        '<li>Type of requirement: ' + db.typeExpense + '</li>' +
        '<li>Minimum Expense Requirement: ' + db.minExpense + '</li>' +
        '<li>Maximum Expense Requirement: ' + db.maxExpense + '</li>' +
        '<ul>' +
        '</div>'+
        '</div>';

        //When a map marker is clicked, open an infowindow
        google.maps.event.addListener(marker,'click', (function(marker,contentString,infowindow){ 
            return function() {
                infowindow.close();
                infowindow.setContent(contentString);
                infowindow.open(map,marker);
            };
        })(marker,contentString,infowindow));  
        

    }; //end populateMap

} //end initMap

$('window').on('click',"#firstHeading", function(){
    console.log("Hello world!")
});
        

$(document).ready(function() {

//firebase reader
$(searcherSub).on("click", function(e){

	e.preventDefault();

	//firebase searcher
	database.ref().on("child_added", function(childSnapshot) {
		//console.log(childSnapshot.val());

		//console.log(childSnapshot.val().city);
  		
  		if (childSnapshot.val().city.toLowerCase()===$("#searcher").val().trim().toLowerCase()) {
			
			console.log("RESULT FOUND");

			newState=childSnapshot.val().state.toLowerCase(); //

			database.ref().on("child_added", function(childSnapshot) {
				if (newState===childSnapshot.val().state.toLowerCase()){
					$("#table").append("<tr>" +
					"<th>" + childSnapshot.val().state + "<br>" + childSnapshot.val().city + "</th>" +
					"<th>" + childSnapshot.val().laborPer + "%<br>" + childSnapshot.val().laborReq + "</th>" +
					"<th>" + childSnapshot.val().expendPer + "%<br>" + childSnapshot.val().expendReq + "</th>" +
					"<th>$" + childSnapshot.val().minExpense + "-" + childSnapshot.val().maxExpense + "<br>" + childSnapshot.val().typeExpense + "</th>" +
					"<th>" + childSnapshot.val().incentiveOth + "</th>" +
					"</tr>"
					);
				};


			});
  		};

  		if (childSnapshot.val().state.toLowerCase()===$("#searcher").val().trim().toLowerCase()) {
			console.log("RESULT FOUND");

			//putting stuff on table
			$("#table").append("<tr>" +
				"<th>" + childSnapshot.val().state + "<br>" + childSnapshot.val().city + "</th>" +
				"<th>" + childSnapshot.val().laborPer + "%<br>" + childSnapshot.val().laborReq + "</th>" +
				"<th>" + childSnapshot.val().expendPer + "%<br>" + childSnapshot.val().expendReq + "</th>" +
				"<th>$" + childSnapshot.val().minExpense + "-" + childSnapshot.val().maxExpense + "<br>" + childSnapshot.val().typeExpense + "</th>" +
				"<th>" + childSnapshot.val().incentiveOth + "</th>" +
			"</tr>"
			);
			//end putting stuff on table
  		};
	});
	//end firebase searcher

});
//end firebase reader



}); //end document on ready
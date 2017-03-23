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
    var savannah = {lat: 35, lng: -106};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
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
                icon: 'marker50px.png',
                map: map
            })
        } else {
            var marker = new google.maps.Marker({
                position: {lat: JSON.parse(db.coordinateLat), lng: JSON.parse(db.coordinateLng)},
                map: map
            })
        };

        //variable to join city and state and create a city data element for onclick functionality with data well
        if (db.city === "") {
            var cityState = db.state;
            var city = db.state
        } else {
            var cityState = [db.city, db.state].join(", ");
            var city = db.city
        };
        

        //text for infowindows
        var contentString = '<div id="content">'+
        '<h1 id="firstHeading" class="firstHeading heading">' + cityState + '</h1>'+
        '<h3>Incentives</h3>' +
        '<div id="bodyContent">'+
        '<ul>' +
        '<li>Expenditure Tax Credit Percentage: ' + db.expendPer + '</li>' +
        '<li>Labor Tax Credit Percentage: ' + db.laborPer + '</li>' +
        '<li>Type of requirement: ' + db.typeExpense + '</li>' +
        '<li>Minimum Expense Requirement: ' + db.minExpense + '</li>' +
        '<li>Maximum Expense Requirement: ' + db.maxExpense + '</li>' +
        '<ul>' +
        '</div>'+
        '<button data-city="' + city + '" id="addDetails">Click here to compare details below</button>' +
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

    jQuery(document).on('click', '#addDetails', function(event){
        console.log("addDetails clicked");
        searchVal=$(this).attr("data-city").trim().toLowerCase();
        console.log($(this).text());
        $('html, body').animate({
        scrollTop: $("#table").offset().top
        }, 1000);
        reader();
    });

}; //end initMap


//firebase reader
$("#searcherSub").on("click", function(){
	searchVal=$("#searcher").val().trim().toLowerCase();
    console.log(searchVal);
	reader();
});
	
function reader(){
	
	//firebase searcher
	database.ref().on("child_added", function(childSnapshot) {
		//console.log(childSnapshot.val());

		//console.log(childSnapshot.val().city);
  		
  		if (childSnapshot.val().city.toLowerCase()===searchVal) {
			
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

  		if (childSnapshot.val().state.toLowerCase()===searchVal) {
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
};
//end firebase reader


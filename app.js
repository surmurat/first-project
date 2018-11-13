$(document).ready(function(){
// $("#map").show();  
// $("#showData").hide();
interval = setInterval(startTicker, 3000);
interval1 = setInterval(getNews, 60000);
$("#newsNew").hover(function(){
    stopTicker();
}, 
function(){
    interval = setInterval(startTicker, 3000);
})
}); 

function blinker() {
    $('.blink_me').fadeOut(500);
    $('.blink_me').fadeIn(500);
}
function testEvent() {
    map.clickMapObject(map.dataProvider);
  }

setInterval(blinker, 1000);

var stateInput;
var births;
var deaths;
var birthRateArray = [];
var deathRateArray = [];
var data = [];
var articles = [];
var apiResponse;
var queryResponse;

var queryURL = "https://api.census.gov/data/2014/pep/natstprc?get=STNAME,POP,BIRTHS,DEATHS,DENSITY,DIVISION&DATE=7&for=state:*&key=01583ab5bf70e73693ce188c438e8e312568ae00";
var query = "https://newsapi.org/v2/top-headlines?sources=usa-today&apiKey=e66bdc8eb9fa498abce2bdd00c3049fe";

$.ajax({
url: queryURL,
method: "GET"
}).then(function(response) {
    apiResponse = response;
});

$.when( $.ajax( query ) ).then(function( data, textStatus, jqXHR ) {
    afterResponse(data);
});
function afterResponse(queryResponse){
    $("#newsNew").empty();
    $.each(queryResponse.articles, function(index, value){
        var obj1 = value.description;
        console.log(obj1);
        articles.push(obj1);
        var list = "<li class='list'>" + obj1 + "</li>";
        $("#newsNew").append(list);
})
console.log(articles);
}

$("#addState").on('click', function(){
stateInput = $('#selectState').find(":selected").val();;
map.clickMapObject(map.getObjectById(stateInput));

});


var map = AmCharts.makeChart( "chartdiv", {
"type": "map",
"theme": "black",

"panEventsEnabled": true,
"dataProvider": {
"map": "usaLow",
"getAreasFromMap": true
},
"areasSettings": {
"autoZoom": false,
"color": "black",
"colorSolid": "#5EB7DE",
"selectedColor": "#5EB7DE",
"outlineColor": "#666666",
"rollOverColor": "#88CAE7",
"rollOverOutlineColor": "#FFFFFF",
"selectable": true
},
"listeners": [ {
"event": "clickMapObject",
"method": function( event ) {

    map.selectedObject = map.dataProvider;
    event.mapObject.showAsSelected = !event.mapObject.showAsSelected;

    map.returnInitialColor( event.mapObject );

    var states = [];
    for ( var i in map.dataProvider.areas ) {
    var area = map.dataProvider.areas[ i ];
    if ( area.showAsSelected ) {
        states.push( area.title );
    }
    }
    $("#dataTable").empty();
    $.each(apiResponse, function(index, value){

        if(index == 0){
            return;
    }
    else{
        if(states.indexOf(value[0]) >= 0){
            var state = value[0];
            var pop = value[1];
            var birth = value[2];
            var death = value[3];

            var row = "<tr>" + "<td>" + state + "</td>"
                        + "<td>" + pop + "</td>" 
                        + "<td>" + birth + "</td>"
                        + "<td>" + death + "</td>"
                        + "</tr>";
            $("#dataTable").append(row);
        }
    }
    });
}
} ],
"export": {
"enabled": true
}
});
// map.updateSelection = function() {
//     var areas = [];
//     // jQuery(".section-map-list input:checked").each(function() {
//     //   var CC = this.value;

//       areas.push({
//         id: stateInput,
//         showAsSelected: true
//       });
//    // });
//     map.dataProvider.areas = areas;
//     map.validateData();
//     return areas;
//   }

function startTicker(){
    $("#newsNew li:first").slideUp(function(){
        $(this).appendTo($("#newsNew")).slideDown();
    });
}

function stopTicker()
{
    clearInterval(interval);
}

function getNews(){
    $.when( $.ajax( query ) ).then(function( data, textStatus, jqXHR ) {
        afterResponse(data);
    });
}
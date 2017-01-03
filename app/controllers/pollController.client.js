'use strict';

(function () {

   var pollOptions = document.querySelector('#poll-options') || null;
   var pollName = document.querySelector('#poll-name') || null;
   var sharelink = document.querySelector('#sharelink') || null;
   var pollform = document.querySelector('#pollform') || null;
   
   
   
   // var currentPoll = window.location.pathname.split('/')
   // if (currentPoll.length > 1 && currentPoll[0]=='api') {
   //    currentPoll = currentPoll[1];
   // } else {currentPoll = "no poll id found";} //in case user tries monkey business
   //var currentPoll = 
   var parser = document.createElement('a');
   parser.href = window.location.href;
   console.log(parser);
   console.log(parser.hash.slice(1));
   var apiUrl = appUrl + '/api/' + parser.hash.slice(1);

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }




   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      console.log(data);
      var userObject = JSON.parse(data);

      if (pollName !== null) {
         updateHtmlElement(userObject, pollName, 'name');   
         sharelink.innerHTML = '<a href=' + appUrl + "/poll#" + userObject.id + '>Share</a>';
         pollform.innerHTML = '<input type="hidden" name="id" value="' + userObject.id + '"></input>';
      }
      
      if (pollOptions !== null) {
         var pollid = userObject.id;
         var chartaccumulator = [];
         if (userObject.options.length > 0){
            var html = "<ul>";
            userObject.options.forEach(function(x){
               var optname = x.optname;
               var optval = x.optval;
               chartaccumulator.push([optname,optval]);
               html += "<li><a href='" + appUrl + '/api/' + pollid + '/' + optname  + "'>" + optname + " (" + optval + ")" + "</a>";
            })
            html += "</ul>";
         } else { html = "No polls found"; }
         pollOptions.innerHTML = html;
         //updateHtmlElement(userObject, profilePolls, 'polls');   
         
      // Load the Visualization API and the corechart package.
         google.charts.load('current', {'packages':['corechart']});
      
         // Set a callback to run when the Google Visualization API is loaded.
         google.charts.setOnLoadCallback(drawChart);
      
         // Callback that creates and populates a data table,
         // instantiates the pie chart, passes in the data and
         // draws it.
         //console.log(chartaccumulator);
         function drawChart() {
      
           // Create the data table.
           var data = new google.visualization.DataTable();
           data.addColumn('string', 'Option');
           data.addColumn('number', 'Votes');
           data.addRows(chartaccumulator);
          
      
           // Set chart options
           var options = {'title':userObject.name,
                          'width':350,
                          'height':250};
      
           // Instantiate and draw our chart, passing in some options.
           var chart = new google.visualization.PieChart(document.getElementById('optionchart'));
           chart.draw(data, options);
         }
         
         
         
      }
      
      

   }));
})();

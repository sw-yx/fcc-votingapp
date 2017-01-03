'use strict';

(function () {

   var allpoll = document.querySelector('#allpoll') || null;
   var apiUrl = appUrl + '/api/all';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }


   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      console.log(data);
      var userObject = JSON.parse(data);


      if (allpoll !== null) {
         var html = "<ul>";
         userObject.forEach(function(x){
            html += "<li><a href='" + appUrl + '/poll#' + x.id + "'>" + x.name + "</a> by " + x.creator;
         })
         html += "</ul>";
         allpoll.innerHTML = html;
         //updateHtmlElement(userObject, profilePolls, 'polls');   
      }
   }));
})();

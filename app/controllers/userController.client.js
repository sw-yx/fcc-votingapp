'use strict';

(function () {

   var profileId = document.querySelector('#profile-id') || null;
   var profileUsername = document.querySelector('#profile-username') || null;
   var profileFollowcount = document.querySelector('#profile-followcount') || null;
   var displayName = document.querySelector('#display-name');
   var profilePolls = document.querySelector('#profile-polls') || null;
   var apiUrl = appUrl + '/api/user/:id';
   console.log('apiUrl:' + apiUrl);

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }


   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      console.log(data);
      var userObject = JSON.parse(data);

      if (userObject.displayName !== null) {
         updateHtmlElement(userObject['twitter'], displayName, 'displayName');
      } else {
         updateHtmlElement(userObject['twitter'], displayName, 'username');
      }

      if (profileId !== null) {
         updateHtmlElement(userObject['twitter'], profileId, 'id');   
      }

      if (profileUsername !== null) {
         updateHtmlElement(userObject['twitter'], profileUsername, 'username');   
      }

      if (profileFollowcount !== null) {
         updateHtmlElement(userObject['twitter'], profileFollowcount, 'followcount');   
      }
      

      if (profilePolls !== null) {
         var html = "<ul>";
         userObject.polls.forEach(function(x){
            html += "<li><a href='" + appUrl + '/poll#' + x.id + "'>" + x.name + "</a> ";
            html += "(<a href='" + appUrl + '/api/delete/' + x.id + "'>Delete</a>)";
            html += "</li>"
         })
         html += "</ul>";
         profilePolls.innerHTML = html;
         //updateHtmlElement(userObject, profilePolls, 'polls');   
      }
   }));
})();

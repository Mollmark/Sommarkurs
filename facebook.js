$(document).ready(function(){
    console.log("Facebook appId!");

    FB.init({

        appId: '',
        status: true,
        cookie: true,
        xfbml: true
    });

    FB.Event.subscribe('auth.login', function(response) {
        window.location.reload();
    });   

    //Är användaren inloggad?
    FB.getLoginStatus(function(response) {

        if (response.status === 'connected') {

            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            
            FB.api('/me', function(response) {

              var smallProfileimage = "http://graph.facebook.com/"+response.id+"/picture?type=square";

              var person = "http://graph.facebook.com/"+response.id;
           
            
              $('<img>').attr({src: smallProfileimage}).appendTo("#profileImg");

                  
            });

        } else if (response.status === 'not_authorized') {
        
        
        } else {

            $("<p></p>").appendTo("#profileImg");
           
        }
    });
});
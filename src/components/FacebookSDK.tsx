"use client";

import Script from "next/script";

export default function FacebookSDK() {
  return (
    <>
      <Script
        id="facebook-sdk"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else {
      // The person is not logged into your app or we are unable to tell.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    }
  }
          function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
          window.fbAsyncInit = function() {
            FB.init({
              appId: '${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}',
              cookie: true,
              xfbml: true,
              version: 'v20.0'
            });
            FB.AppEvents.logPageView();

            function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      console.log('Successfully logged in with Facebook');
    } else {
      // The person is not logged into your app or we are unable to tell.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    }
  }
            
FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
});
          };
          function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }
          (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
        `,
        }}
      />
      <div id="status"></div>
      <div
        className="fb-login-button"
        data-scope="public_profile,pages_manage_engagement,pages_manage_metadata,pages_read_engagement,pages_read_user_content,read_insights,business_management,public_profile"
        data-onlogin="checkLoginState();"
      ></div>
    </>
  );
}

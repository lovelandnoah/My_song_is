// # Place all the behaviors and hooks related to the matching controller here.
// # All this logic will automatically be available in application.js.
// # You can use CoffeeScript in this file: http://coffeescript.org/

  //$( document ).ready(function() {
  //   $( "#cardHolder div div" ).on( "click", function(){
  //   alert("hi")
  //   var $this = $(this); // Wrap in jQuery the element clicked
  //   var station_id = $this.data('station_id');
  //   var the_new_url = 'http://api.dar.fm/player_api.php?station_id='+station_id+'&custom_style=radioslice&partner_token=9388418650';
  //   $('selector_for_the_player').attr('src', the_new_url);
  //   return false;
  // });
  // });

  // $( document ).on( "click", '#cardHolder' function(){
  //   alert("hi");
  // });

//   $( "#dataTable tbody tr" ).on( "click", function() {
//   console.log( $( this ).text() );
// });


  // $('a[data-station_id]').click(function(){
  // $( "h5" ).click(function(){
  //   alert("hi")
  // });

//} 




// $("a[data-station_id]").data('station_id')

!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');

$('.run-css').click(function() {
    $('.cont').toggleClass('toggled');
});

$( "#clickme" ).click(function() {
  $( "#me" ).slideToggle( "slow");
});

$( "#slide" ).click(function() {
  $( "#sli" ).slideToggle( "slow");
});

  
// $( "#delete" ).click(function() {
//     $( "#tobe" ).remove();
// });


// $( "a#playButton" ).find( allAnchorElements )


  $('.button-collapse').sideNav({
      menuWidth: 300, // Default is 240
      edge: 'right', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  );


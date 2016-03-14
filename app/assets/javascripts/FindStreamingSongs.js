	var songNames = [];
	var artistNames = [];
	var playButtons = [];
	var songsData = [];
	var songNamesFound = false;
	var songsDataFilled = false;

	function checkIfMixtapeIsPlaying(){
		var isPlayingMixtape = document.getElementById("playing-mixtape");
		if (isPlayingMixtape && songNamesFound == false) {
			getSongNames();
		};
	}

	function checkForNewSongsAdded(){
		songNamesFound = false;
		getSongNames();
	}

	function getSongNames(){
		songNames = [];	
		artistNames = [];
		playButtons = [];
		songsData = [];

		playButtons = document.getElementsByClassName("play-button");
		var songNameElement = document.getElementsByClassName("song-name");
		var songArtistElement = document.getElementsByClassName("artist-name");

		for(var i=0; i<songNameElement.length; i++){
			songNames[i] = songNameElement[i].innerHTML.replace(/^"(.*)"$/, '$1');
			artistNames[i]= songArtistElement[i].innerHTML.replace(/^"(.*)"$/, '$1');
		};

	 songNamesFound = true;
	 getStreamingSongs();
	};

	function getStreamingSongs(){
		songsData = [];
		for(var i=0; i<songNames.length; i++){
			var name = songNames[i].replace(/\s/g, '%20');
			var artist = artistNames[i].replace(/\s/g, '%20');
			var url = "http://api.dar.fm/playlist.php?q=" + artist + "%20" + name + "&callback=jsonp&web=1&partner_token=1234567890";
			$.ajax({
	      url: url,
	      jsonp: 'callback',
	      type: 'GET',
	      dataType: 'jsonp',
				success: function(data) {
	     		songsData.push(data);
	    	}
			});
		songsDataFilled = false;	
		}
	}

	function play(station){
		player.src = "http://api.dar.fm/player_api.php?station_id=" + station + "&custom_style=radioslice&partner_token=9388418650"
		getStreamingSongs();
	}

	function checkIfSongsDataFilled(){

		if (songsData !== 'undefined' && songNamesFound == true && songsDataFilled == false) {
			
			if (songsData.length == playButtons.length) {
				songsDataFilled == true;
				assignStationID();
			};
		};
	}

	function bestStation(stations){

		var maxTimeRemaining = 0;
		for(var i=0; i<stations.length; i++){
			if (stations[i] > maxTimeRemaining) {
				maxTimeRemaining = i;
			};
		}
		return maxTimeRemaining;
	 }

	 function assignStationID(){

		for(var i=0; i<playButtons.length; i++){
			if (songsData[i].length != 0) {
				  var secondsRemaining = [];
				  for(var j=0; j < songsData[i].length; j++){
				  	secondsRemaining.push(songsData[i][j].seconds_remaining);
				  } 

				  var station = bestStation(secondsRemaining);  
				  playButtons[i].id = songsData[i][station].station_id;
				  playButtons[i].className = playButtons[i].className.replace("button-grey", "");
				  playButtons[i].addEventListener('click', function() {
				  play(this.id);
					});
			}else{
				if (playButtons[i].classList.contains('button-grey') == false) {
					playButtons[i].className += ("button-grey");
				};
			};
		} 
	}

	setInterval(checkIfMixtapeIsPlaying, 1000);
	setInterval(checkIfSongsDataFilled, 513);
	// setInterval(checkForNewSongsAdded, 333);
	
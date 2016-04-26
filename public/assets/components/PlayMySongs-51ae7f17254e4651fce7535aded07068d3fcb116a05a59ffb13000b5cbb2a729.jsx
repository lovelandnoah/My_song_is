  class PlayMySongs extends React.Component{
  constructor(props){
    super(props)
    this.state = { searched: false, mixtape_id: this.props.mixtape_id, mixtapeName: '', mixTapeCategory: '', songs: [], songsSearchedFor: [], songOrArtist: [], results: [], filteredResults: [], stationId: "", eventTriggered: false};
    this.getSongs = this.getSongs.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.filteredSearchResults = this.filteredSearchResults.bind(this);
    this.noArtists = this.noArtists.bind(this);
    this.pass = this.pass.bind(this);
    this.showSuggestions = this.showSuggestions.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.showMySongs = this.showMySongs.bind(this);
    // this.displayUsersMixTapes = this.displayUsersMixTapes.bind(this);
    // this.doSearch = this.doSearch.bind(this);

    //mixtape
    this.songNameInPlayer = this.songNameInPlayer.bind(this);
    this.pictureInPlayer = this.pictureInPlayer.bind(this);
    this.albumCover = this.albumCover.bind(this);
    // this.findPlay = this.findPlay.bind(this);
    // this.shuffle = this.shuffle.bind(this);
    this.playMultipleSongs = this.playMultipleSongs.bind(this);
    this.remove = this.remove.bind(this);
    this.changeHandler = this.changeHandler.bind(this);

    this.checkNewSong = this.checkNewSong.bind(this);
    this.attemptUpdate = this.attemptUpdate.bind(this);

    this.changeStationId = this.changeStationId.bind(this);

    this.playMode = this.playMode.bind(this);
    this.playSingleSong = this.playSingleSong.bind(this);
    this.play = this.play.bind(this);


  }

  componentWillMount(){
    this.setState({mixtapeUrl: "/mixtapes/" + this.props.mixtape_id});

    // $("#main-art").addClass("hidden-desktop");
    // $("#player-bottom").addClass("hidden-desktop");
  }

  componentDidMount(){
    let self = this;
    self.showSuggestions();
    $(document).keypress(function(e) {
      if(e.which == 13) {
        self.filteredSearchResults()
      }
    })
    this.getSongs();
    this.checkNewSong();
  }

  //mixtape methods
  changeHandler(songIndex, title, artist) {
    $.ajax({
      url: '/song/' + this.state.songs[songIndex].song_id,
      type: 'DELETE',
    }).success( data => {
      //       data: {name: self.state.songs[songIndex].song_name, artist: self.state.songs[songIndex].artist_name, mixtape_id: self.props.mixtapeId}
      // this.setState({songs: data.songs});
      this.getSongs();
      if(document.getElementById(title+artist)){
        document.getElementById(title+artist).checked = false;
      }
    });
  }

  playMode(){
    if(this.state.songs.length > 0){
      if(this.props.play_method == "First"){
        this.playSingleSong(this.state.songs[0]);
        this.albumCover(this.state.songs[0].song_name, this.state.songs[0].artist_name);
      } else {  
        this.playMultipleSongs();
      }
    }
  }

  noSongsAdded(){
    if(this.state.songs.length == 0){
      return(<p id="no-songs-notification" className="notification-spacing"> It looks like this user doesn't have any songs added. </p>);
    }else{
      this.playMode();
    }
  }

  playSingleSong(song){
    title = song.song_name.replace(/\s/g, ".")
    artist = song.artist_name.replace(/\s/g, ".")

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      window.open("http://onrad.io/" + artist + "." + title)
      this.albumCover(title, artist);
    } else {
      this.play(title, artist);
    }
  }

  play(title, artist){
    this.songNameInPlayer(title,artist);
    this.pictureInPlayer();
    title = title.replace(/\./g, '%20');
    artist = artist.replace(/\./g, '%20');
    $.ajax({
      url: "http://api.dar.fm/playlist.php?&q=@artist%20" + artist + "%20@title%20" + title + "&callback=jsonp&web=1&partner_token=9388418650",
      jsonp: 'callback',
      type: 'GET',
      dataType: 'jsonp',
    }).success( data => {
      let player = document.getElementById("player")
      if(data.length){
        player.src = "http://api.dar.fm/player_api.php?station_id=" + data[0].station_id + "&custom_style=radioslice&partner_token=9388418650"
        // this.state.changeStationId(data[0].station_id);
      } else {
        //todo: message song is not playing
      }
    });
  }

  playMultipleSongs(){
    let queries = [];
    let that = this;
    // number queries starting with 0 which is blank
    let queryNo = [""]
    for(i=0;i<this.state.songs.length;i++){
      queryNo.push(i + 2);
    }
    queryNo.pop();

      for(i=0;i<this.state.songs.length;i++){
        queries[i] = `&q${queryNo[i]}=(@artist%20${this.state.songs[i].artist_name.replace(/\s/g, '%20')}%20@title%20${this.state.songs[i].song_name.replace(/\s/g, '%20')})`
      }
      $.ajax({
        url: "http://api.dar.fm/msi.php?" + queries.join(separator = [""]) + "&callback=jsonp&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp',
      }).success( data => {
        if(data[0].success){
          if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            window.open("http://onrad.io/" + data[0].result[0].artist + "." + data[0].result[0].title);
            that.albumCover(data[0].songmatch[0].title, data[0].songmatch[0].artist);
          } else {
            let player = document.getElementById("player");
            player.src = "http://api.dar.fm/player_api.php?station_id=" + data[0].result[0].station_id + "&custom_style=radioslice&partner_token=9388418650"
            that.albumCover(data[0].songmatch[0].title, data[0].songmatch[0].artist);
            that.songNameInPlayer(data[0].songmatch[0].title, data[0].songmatch[0].artist);
            that.changeStationId(data[0].result[0].station_id);
          }
        }else{
          alert("song not playing");
        }
    })
  }

  checkNewSong(){
    document.addEventListener('DOMContentLoaded', function(){
    setInterval(self.attemptUpdate, 5000);
    }, true);
    let event = new CustomEvent('DOMContentLoaded', { "detail": "Example of an event" });
    document.dispatchEvent(event);
  }

  attemptUpdate(){
    if(this.state.station_id != "") {
      let that = this;
      $.ajax({
        url: "http://api.dar.fm/playlist.php?station_id=" + that.state.station_id + "&partner_token=9388418650",
        jsonp: 'callback',
        type: 'GET',
        dataType: 'jsonp',
      }).success( data => {
        if(data[0] != undefined){
          if(data[0].title != document.getElementById("player-title").innerHTML || data[0].artist != document.getElementById("player-artist").innerHTML) {
          that.albumCover(data[0].title, data[0].artist);
          that.songNameInPlayer(data[0].title, data[0].artist);
        };
      }
      });
    };
  }

  changeStationId(newId){
    this.state.stationId = newId;
  }

  songNameInPlayer(title, artist){
    let titleDisplay = document.getElementById("player-title").innerHTML = title;
    let artistDisplay = document.getElementById("player-artist").innerHTML = artist;
  }

  pictureInPlayer(){
    let pictureDisplay = document.getElementById("main-art").style.backgroundImage = `url(${this.state.albumCoverUrl})`;
    $("main-art").removeClass("hidden-desktop");
    $("player-bottom").removeClass("hidden-desktop");
  }

  albumCover(title, artist){
    self = this;
    $.ajax({
      url: "http://api.dar.fm/songart.php?artist=" + artist + "&title=" + title + "&res=med&partner_token=9388418650",
      jsonp: 'callback',
      type: 'GET',
      dataType: 'jsonp',
    }).success( data => {
      document.getElementById("song-display").style.backgroundImage = `url(${data[0].arturl})`;
    });
  }
  getSongs(){
    let that = this;
    $.ajax({
      url: '/mixtapes_find_single_mixtape',
      type: 'GET',
      data: {mixtape_id: this.props.mixtape_id}
    }).success( data => {
      // this.setState({mixtapeName: data.name});
      that.setState({songs: data.songs});
    })
  }
  remove(songIndex){
    $.ajax({
      url: '/song/' + self.state.songs[songIndex].song_id,
      type: 'DELETE',
    }).success( data => {
      //       data: {name: self.state.songs[songIndex].song_name, artist: self.state.songs[songIndex].artist_name, mixtape_id: self.props.mixtapeId}
    });
    this.changeHandler();
  }

  // doSearch(){
  //   this.getSearchResults();
  //   this.getImages();
  // }

  getSearchResults(){
    let self = this;
    let searchTerm = self.refs.searchText.value.replace(/\s/g, "%20")
    $.ajax({
      url: "http://api.dar.fm/playlist.php?&q=" + searchTerm + "&callback=jsonp&web=1&partner_token=9388418650",
      jsonp: 'callback',
      type: 'GET',
      dataType: 'jsonp',
    }).success( data => {
      this.state.searched = true;
      this.setState({results: data});
    });
  }

  filteredSearchResults(){
    let self = this;
    let searchTerm = self.refs.searchText.value.replace(/\s/g, "%20")
    self.refs.searchText.value = ""
    $.ajax({
      url: "http://api.dar.fm/songartist.php?&q=*" + searchTerm + "*&callback=jsonp&web=1&partner_token=9388418650",
      jsonp: 'callback',
      type: 'GET',
      dataType: 'jsonp',
    }).success( data => {
      // songOrArtist = ""
      // $.each(data, function (key, value) {
      // if(key == parseInt(key)){
      //   songOrArtist += value;
      // }
      // });
      // this.setState({results: data});
      this.showFilteredResults(data);
    });
    $(".ui-helper-hidden-accessible").hide();
  }

  showFilteredResults(results){
    let self = this;
    $.ajax({
      url: "http://api.dar.fm/allsongs.php?artist=*" + results[0] + "*&callback=jsonp&partner_token=9388418650",
      jsonp: 'callback',
      type: 'GET',
      dataType: 'jsonp',
    }).success( data => {
      this.state.searched = true;
      this.setState({results: data})
    })
  }

  showSuggestions(){
    that = this;
    $("#search").autocomplete( {
      source(request, response){
        $.ajax({
          url: "http://api.dar.fm/songartist.php?q=*" + request.term + "*&callback=jsonp&web=1&partner_token=9388418650",
          jsonp: "callback",
          type: "GET",
          dataType: "jsonp",
        }).success( data => {
          response(data)

        });
      },
    select(event, ui){
      that.filteredSearchResults();
    }
    });
  }

   pass(){
    $("#mixtapeForm").slideToggle("slow");
    $("#cardHolder").slideToggle("slow");
  }

  noArtists(artists){
    if(artists) {
      if(this.state.results[0].songmatch.length == 0) {
        return(<p className='search-placeholder'>No artist or song found with that name. Please enter a search above. </p>);
        // todo: only show when no search value
      }
    }else {
        return(<h5 className='search-placeholder'>Search to find a song!</h5>);
    }
  }

  showPlayer(player){
    if(player.src == ""){
      return;
    }else{
      return player;
    }
  }

  showMySongs(songs) {
    if(this.props.current_user.id == this.props.author_id){
      if(songs.length != 0){
        return(songs);
      } else{
        return(<div id="selected-songs-placeholder">No songs selected</div>);
      }

    }
  }

    //   let songs = this.state.songs.map( song => {
    // let key = `song-${song.song_id}`;
    // return(<Song key={key} artist_name={this.props.artist_name} song_name={this.props.song_name} {...song} getSongs={this.getSongs}/>);

  render(){
    self = this;
    // let searchResultCards = <Artist/>;
    let i = 0;

    // if(this.state.results.length){
    //   searchResultCards = this.state.results[0].songmatch.map( artist => {
    //   return(<Artist rplay={self.playSong} mixtapeId={self.state.mixtape_id} getSongs={self.getSongs}/>)})}
    //}

    // let songsSearchedFor = this.state.songsSearchedFor.map( song => {
    //   let key = `songsSearchedFor-${song.song_id}`
    //   songsSearchedFor.push(<MixTapeSong key={key} {...song}/>);
    // });
    let searchResultCards = null;
    if(this.state.results[0] != undefined) {
      searchResultCards = this.state.results.length ? (
      this.state.results[0].songmatch.map( Sartist => {
        return(<Artist title={Sartist.title} songIndex={"result" + self.state.results[0].songmatch.indexOf(Sartist)} songs={this.state.songs} getSongs={this.getSongs} artist={Sartist.artist} key={`artist-${i += 1}`} rplay={self.playSong} mixtapeId={self.state.mixtape_id} current_user={self.props.current_user} changeStationId={this.changeStationId} songId={Sartist.artist.replace(/\s/g, "")+Sartist.title.replace(/\s/g, "")}/>)
      })):([])
    }
    let songs = self.state.songs.map( song => {
    // let key = `mixtapeSong-${song.song_id}`;
      return(<div className="inline-container"><SelectedArtist songs={this.state.songs} key={`mixtapeSong-${song.song_id}`} songIndex={"favorite" + self.state.songs.indexOf(song)} title={song.song_name} artist={song.artist_name} songId={"selected" + song.song_id} onChange={this.changeHandler} getSongs={this.getSongs} changeStationId={this.changeStationId}/>
      <p className="my-song-title">{song.song_name}</p>
      <p className="my-song-artist">{song.artist_name}</p>
      </div>);
    });

    return(<div id="play-container-not-logged">
            {this.noSongsAdded()}
        </div>)
  }
}

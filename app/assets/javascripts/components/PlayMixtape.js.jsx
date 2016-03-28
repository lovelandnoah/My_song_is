  class PlayMixtape extends React.Component{
  constructor(props){
    super(props)
    this.state = { searched: false, mixtape_id: this.props.mixtape_id, mixtapeName: '', mixTapeCategory: '', songs: [], songsSearchedFor: [], songOrArtist: [], results: [], filteredResults: []};
    this.getSongs = this.getSongs.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.filteredSearchResults = this.filteredSearchResults.bind(this);
    this.noArtists = this.noArtists.bind(this);
    this.pass = this.pass.bind(this);
    this.showSuggestions = this.showSuggestions.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
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
  }

  componentWillMount(){
    this.setState({mixtapeUrl: "/mixtapes/" + this.props.mixtape_id});
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
        let player = document.getElementById("player")
        player.src = "http://api.dar.fm/player_api.php?station_id=" + data[0].result[0].station_id + "&custom_style=radioslice&partner_token=9388418650"
        that.albumCover(data[0].songmatch[0].title, data[0].songmatch[0].artist);
        that.songNameInPlayer(data[0].songmatch[0].title, data[0].songmatch[0].artist);
      }else{
        alert("song not playing");
      }
    })
  }

  songNameInPlayer(title, artist){
    let titleDisplay = document.getElementById("player-title").innerHTML = title;
    let artistDisplay = document.getElementById("player-artist").innerHTML = artist;
  }

  pictureInPlayer(){
    let pictureDisplay = document.getElementById("main-art").style.backgroundImage = `url(${this.state.albumCoverUrl})`;
  }

  albumCover(title, artist){
    self = this;
    $.ajax({
      url: "http://api.dar.fm/songart.php?artist=" + artist + "&title=" + title + "&res=med&partner_token=9388418650",
      jsonp: 'callback',
      type: 'GET',
      dataType: 'jsonp',
    }).success( data => {
      document.getElementById("main-art").style.backgroundImage = `url(${data[0].arturl})`;
    });
  }

  show_mixtape(){

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

  getSongs(){
    $.ajax({
      url: '/mixtapes_find_single_mixtape',
      type: 'GET',
      data: {mixtape_id: this.props.mixtape_id}
    }).success( data => {
      // this.setState({mixtapeName: data.name});
      this.setState({songs: data.songs});

    })
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
      this.showFilteredResults(data)
    });
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
      }
    });
  }

   pass(){
    $("#mixtapeForm").slideToggle("slow");
    $("#cardHolder").slideToggle("slow");
  }

  noArtists(artists){
    if(artists.length == 0 && this.state.searched) {
      if(self.refs.searchText.value == "") {
        return(<h5>Please search for an artist! </h5>);
      }else {
        return(<h5>Could not find {self.refs.searchText.value} playing on a station.</h5>);
      }
    }
  }

  showPlayer(player){
    if(player.src == ""){
      return;
    }else{
      return player;
    }
  }

    // 
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

    searchResultCards = this.state.results.length ? (
    this.state.results[0].songmatch.map( Sartist => {
      return(<Artist title={Sartist.title} songs={this.state.songs} getSongs={this.getSongs} artist={Sartist.artist} key={`artist-${i += 1}`} rplay={self.playSong} mixtapeId={self.state.mixtape_id} current_user={self.props.current_user}/>)
    })):([])

    let songs = self.state.songs.map( song => {
    let key = `mixtapeSong-${song.song_id}`;
      return(<SongDetails key={key} songIndex={self.state.songs.indexOf(song)} songName={song.song_name} artistName={song.artist_name} songId={song.song_id} onChange={this.changeHandler}/>);
    });

    return(<div>
            <div className= 'card-panel mix-color' id="playing-mixtape">
              <div className="pagination">
                <div className='card small cyan z-depth-3 col s6 over playing-mixtape'>
                 <div className="toop">
                  <button className="btn black-text" onClick={this.playMultipleSongs}>Play</button>
                 </div>
                  <div className='card-content white-text boxreset'>
                     {songs}
                  </div>
                </div>
              </div>
            </div>

            <div id="mixtapeForm">
            </div>

            <h5 className="salt">Search for an Artist or Song:</h5>
              <input id='search' className='small-search' type='text' ref='searchText' autofocus='true' placeholder='Artist'/>
            <button onClick={this.filteredSearchResults} className='btn waves-effect waves-light black-text'>Search</button>
            <h4 className='subtit salt'>Songs Playing:</h4>
            <div className='row'>
              {this.noArtists(searchResultCards)}
              {searchResultCards}
            </div>
        </div>)
  }
}

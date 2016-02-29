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
    // this.doSearch = this.doSearch.bind(this);
  }

  componentDidMount(){
    this.getSongs();
    self = this;
    self.showSuggestions();
  }

  // play mixtape original
  getSongs(){
    $.ajax({
      url: '/mixtapes_find_single_mixtape',
      type: 'GET',
      data: {mixtape_id: this.props.mixtape_id}
    }).success( data => {

      this.setState({mixtapeName: data.name});
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
    $.ajax({
      url: "http://api.dar.fm/songartist.php?&q=" + searchTerm + "&callback=jsonp&web=1&partner_token=9388418650",
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


  render(){
    self = this;
    let searchResultCards = <Artist/>;
    let i = 0;
    // if(this.state.results.length){ 
    //   searchResultCards = this.state.results[0].songmatch.map( artist => {
    //   return(<Artist rplay={self.playSong} mixtapeId={self.state.mixtape_id} getSongs={self.getSongs}/>)})}

    searchResultCards = this.state.results.length ? (
        this.state.results[0].songmatch.map( artist => {
          return(<Artist key={`artist-${i += 1}`} {...artist} rplay={self.playSong} mixtapeId={self.state.mixtape_id} getSongs={self.getSongs}/>)
        })):([])

    let songsSearchedFor = this.state.songsSearchedFor.map( song => {
      let key = `songsSearchedFor-${song.song_id}`
      songsSearchedFor.push(<MixTapeSong key={key} {...song}/>);
    });

    let songs = this.state.songs.map( song => {
    let key = `song-${song.song_id}`;

    return(<Song key={key} artist_name={this.props.artist_name} song_name={this.props.song_name} {...song} getSongs={this.getSongs} />);

  });

    return(<div>
            <div className= 'card-panel mix-color' id="playing-mixtape">
              <div className='card-content white-text'>
                <h5 className="center">{this.state.mixtapeName} </h5>
                {songs}
              </div>
            </div>

            <div id="mixtapeForm">
            </div>

            {this.showPlayer(<Player />)}
          
            <h5 className="salt">Search for an Artist or Song:</h5>
            <input id='search' className='small-search' type='text' ref='searchText' autofocus='true' placeholder="Artist"/>
            <button onClick={this.filteredSearchResults} className='btn waves-effect waves-light black-text'>Search</button>
            <br />
            <br />
            <h4 className='subtit salt'>Songs Playing:</h4>
            <br />
            <div className='row'>
              {this.noArtists(searchResultCards)}
              {searchResultCards}

            </div>
          </div>
          )   
  }
}

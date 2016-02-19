  class Search extends React.Component{

  constructor(props){
    super(props);
    this.state = {results: [], searched: false, mixtape_id: 0, mixtapeName: '', mixTapeCategory: '', songs: []};
    this.getSearchResults = this.getSearchResults.bind(this);
    this.createMixtape = this.createMixtape.bind(this);
    this.getSongs = this.getSongs.bind(this);
    this.noArtists = this.noArtists.bind(this);
    this.displayDoneButton = this.displayDoneButton.bind(this);
    this.pass = this.pass.bind(this);
    this.showSuggestions = this.showSuggestions.bind(this);
  }

  componentDidMount(){
    self = this;
    self.showSuggestions();
  }

  getSearchResults(){
    let self = this;
    let searchTerm = self.refs.searchText.value.replace(/\s/g, "%20")
    $.ajax({
      url: "http://api.dar.fm/playlist.php?&q=@artist%" + searchTerm + "&callback=jsonp&web=1&partner_token=9388418650",
      jsonp: 'callback',
      type: 'GET',
      dataType: 'jsonp',
    }).success( data => {
      this.state.searched = true;
      this.setState({results: data});
    });
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

  createMixtape(){
    $.ajax({
      url: '/mixtapes',
      type: 'POST',
      data: {name: this.refs.mixtapeName.value, category: this.refs.category.value}
    }).success( data => {
      this.refs.mixtapeName.value = null;
      this.refs.category.value = null;
      this.setState ({mixtape_id: data.id, mixtapeName: data.name, mixTapeCategory: data.category, songs: []})
      $("#mixtapeForm").slideToggle("slow");
      $("#cardHolder").slideToggle("slow");
    });
  }

  pass(){
    $("#mixtapeForm").slideToggle("slow");
    $("#cardHolder").slideToggle("slow");
  }

  getSongs(){
    $.ajax({
      url: '/mixtapes_find_single_mixtape',
      type: 'GET',
      data: {mixtape_id: this.state.mixtape_id}
    }).success( data => {
      this.setState({songs: data.songs});
    })
  }

  displayDoneButton(){
    if(this.state.songs.length != 0){
      return(<button onClick={this.pass} className='btn'>Done</button>);
    }
    else{
      return<h5>Search for streaming songs to add to your new mixtape.</h5>
    }
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

  render(){
    self = this;
    let i = 0;
    let artists = this.state.results.map( artist => {
      let key = `artist-${i += 1}`
      return(<Artist key={key} {...artist} rplay={self.playSong} mixtapeId={self.state.mixtape_id} getSongs={this.getSongs}/>);
    });

    let songArray = [];
    let songs = this.state.songs.map( song => {
      let key = `song-${song.song_id}`
      songArray.push(<MixTapeSong key={key} {...song}/>);
    });

    return(
        <div>
          <div id="mixtapeForm">
            <div className="row">
              <input className="col s6" autofocus='true' placeholder='MixTape Name' ref='mixtapeName'/>
            </div>
            <div className="row">
              <input className="col s6" placeholder='Category' ref='category'/>
            </div>
              <button onClick={this.createMixtape} className='btn'>Create New Mixtape</button>
          </div>
           <div id='cardHolder' className='row'>
             <div className='card-panel mix-color'>
                <div className='card-content'>
                  <h3> {this.state.mixtapeName}</h3>
                {songArray}
                {this.displayDoneButton()}
                </div>
              </div>
            </div>

          <h5 className="subtit salt center">Search for an artist:</h5>
          <input id='search' type='text' ref='searchText' autofocus='true' placeholder="Artist"/>
          <div className="center">
            <button onClick={this.getSearchResults} className='btn waves-effect waves-light'>Search</button>
          </div>
          <br />
          <br />
          <h4 className='center-align center subtit salt'>Artists playing:</h4>
          <br />
          <div className='row'>
            {this.noArtists(artists)}
            {artists}
          </div>
        </div>)
  }
}

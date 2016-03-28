class Artist extends React.Component{
  constructor(props){
    super(props)
    this.state = {albumCoverUrl: "", songTitle: "", key: "", isMounted: false, isChecked: null}
    this.play = this.play.bind(this)
    this.add = this.add.bind(this)
    this.albumCover = this.albumCover.bind(this)
    this.displayAdd = this.displayAdd.bind(this)
    this.songNameInPlayer = this.songNameInPlayer.bind(this)
    this.pictureInPlayer = this.pictureInPlayer.bind(this)
    // this.getSongs = this.getSongs.bind(this)
  }

  componentWillMount(){
    $(document).ajaxError(function (e, xhr, settings) {
    if (xhr.status == 401) {
      // $('.selector').html(xhr.responseText);
      alert("Create an account to add your own songs!")
    }
    });


  }

  componentDidMount(){
    this.state.isMounted = true;
    this.albumCover();
    this.state.songTitle = self.props.title;
    this.state.key = this.props.key
    // this.state.isChecked = false;
    for(i=0;i<this.props.songs.length;i++){
      if(this.props.songs[i].song_name == this.props.title && this.props.songs[i].artist_name == this.props.artist){
        this.state.isChecked = true;
      }
    }
    document.getElementById(this.props.title + this.props.artist).checked = this.state.isChecked;
  }

  componentWillUnmount(){
    this.state.isMounted = false;
  }

  componentWillUpdate(){
    // this.state.isChecked = false;

    // for(i=0;i<this.props.songs.length;i++){
    //   if(this.props.songs[i].song_name == this.props.title && this.props.songs[i].artist_name == this.props.artist){
    //     this.state.isChecked = true;
    //   }
    // }
    // document.getElementById(this.props.title).checked = this.state.isChecked;
  }

  play(title, artist){
    this.songNameInPlayer(title,artist);
    this.pictureInPlayer();
    title = title.replace(/\s/g, '%20');
    artist = artist.replace(/\s/g, '%20');
    $.ajax({
      url: "http://api.dar.fm/playlist.php?&q=@artist%20" + artist + "%20@title%20" + title + "&callback=jsonp&web=1&partner_token=9388418650",
      jsonp: 'callback',
      type: 'GET',
      dataType: 'jsonp',
    }).success( data => {
      let player = document.getElementById("player")
      if(data.length){
        player.src = "http://api.dar.fm/player_api.php?station_id=" + data[0].station_id + "&custom_style=radioslice&partner_token=9388418650"
      } else {
        //todo: message song is not playing
      }
    });
  }

  songNameInPlayer(title, artist){
    let titleDisplay = document.getElementById("player-title").innerHTML = title;
    let artistDisplay = document.getElementById("player-artist").innerHTML = artist;
  }

  pictureInPlayer(){
    let pictureDisplay = document.getElementById("main-art").style.backgroundImage = `url(${this.state.albumCoverUrl})`;
  }

  add(songName, artist){
    let self = this;
    if(!this.state.isChecked){
      $.ajax({
        url: '/song',
        type: 'POST',
        data: {name: songName, artist: artist, mixtape_id: this.props.mixtapeId}
      }).success( data => {
        this.state.isChecked = true;
        self.props.getSongs();
        $(self.props.title+self.props.artist).attr('checked', true);
      });
    } else {
      let song_id;
      for(i=0;i<this.props.songs.length;i++){
        if(this.props.songs[i].song_name == songName && this.props.songs[i].artist_name == artist){
          song_id = this.props.songs[i].song_id;
        }
      }
      if(song_id){
        // delete song if unchecked
        $.ajax({
        url: '/song/' + song_id,
        type: 'DELETE',
        }).success( data => {
          //       data: {name: self.state.songs[songIndex].song_name, artist: self.state.songs[songIndex].artist_name, mixtape_id: self.props.mixtapeId}
          // this.setState({songs: data.songs});
          this.state.isChecked = false;
          self.props.getSongs();
          $(self.props.title+self.props.artist).attr('checked', false);
        });
      }
    }
  }

  albumCover(){
    self = this;
    $.ajax({
      url: "http://api.dar.fm/songart.php?artist=" + self.props.artist + "&title=" + self.props.title + "&res=med&partner_token=9388418650",
      jsonp: 'callback',
      type: 'GET',
      dataType: 'jsonp',
    }).success( data => {
      if(this.state.isMounted == true) {
        this.setState({albumCoverUrl: data[0].arturl});
      }
    });
  }

  newImage(currentTitle){
    if(this.state.songTitle != currentTitle){
      this.albumCover();
    }
  }

  displayAdd(){
    return(
      <div>
        <input id={this.props.title+this.props.artist} type='checkbox'
          onClick={() => this.add(this.props.title, this.props.artist, this.state.isChecked)}
        ></input>
        <label htmlFor={this.props.title}>Add</label>
      </div>
    );
  }

  render(){
    if(self.props.current_user) {
      checkBox = this.displayAdd()
      }
    return(<div className="search-result-container">
              <div className="nav4 card-panel height mix-color col l4 m6 s12 z-depth-3" onClick={() => this.play(this.props.title, this.props.artist)} >
                <div className="card-content">
                    <span className="searchTitle">{this.props.title}</span>
                    <span className="searchArtist">{this.props.artist}</span>
                  {this.newImage(this.props.title)}
                  <form action="#">
                    {checkBox}
                  </form>
                  <img src={this.state.albumCoverUrl} />
                </div>
              </div>
          </div>
          );
  }
}
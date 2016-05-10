class Artist extends React.Component{
  constructor(props){
    super(props)
    this.state = {albumCoverUrl: "", key: "", title: this.props.title, artist: this.props.artist, isMounted: false, isChecked: false}
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
    this.state.songId = this.props.songId;
  }

  componentDidMount(){
    this.state.isMounted = true;
    this.albumCover();
    this.state.songTitle = self.props.title;
    ////
    this.state.songId = this.props.songId;
    // this.props.unCheck(this);
    for(i=0;i<this.props.songs.length;i++){
      if(this.props.songs[i].song_name == this.props.title && this.props.songs[i].artist_name == this.props.artist){
        this.props.check(this);
      }
    }
    // document.getElementById(self.props.songId).checked = this.state.isChecked;

    currentArtist = this


    if ($("#selected-" + this.state.title.replace(/\W+/g, "") + this.state.artist.replace(/\W+/g, "")).is("input")) {
      $("#selected-" + this.state.title.replace(/\W+/g, "") + this.state.artist.replace(/\W+/g, "")).on("change", function(){
        currentArtist.props.unCheck(currentArtist);
        debugger
      });
    }

  }

  componentWillUnmount(){
    this.state.isMounted = false;
  }

  componentWillUpdate(){
    // this.props.unCheck(this);

    // for(i=0;i<this.props.songs.length;i++){
    //   if(this.props.songs[i].song_name == this.props.title && this.props.songs[i].artist_name == this.props.artist){
    //     this.props.check(this);
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
        this.props.changeStationId(data[0].station_id);
      } else {
        //todo: message song is not playing
      }
    });
  }

  mobilePlayButton(title, artist){
    mobileTitle = title.replace(/\s/g, ".")
    mobileArtist = artist.replace(/\s/g, ".")

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      window.open("http://onrad.io/" + mobileArtist + "." + mobileTitle)
    } else {
      this.play(title, artist);
    }
  }

  songNameInPlayer(title, artist){
    let titleDisplay = document.getElementById("player-title").innerHTML = title;
    let artistDisplay = document.getElementById("player-artist").innerHTML = artist;
  }

  pictureInPlayer(){
    let pictureDisplay = document.getElementById("main-art").style.backgroundImage = `url(${this.state.albumCoverUrl})`;
  }

  add(songName, artist){ let that = this;
    debugger
    if(!this.state.isChecked){
      if(this.props.songs.length<4){
        $.ajax({
          url: '/song',
          type: 'POST',
          data: {name: songName, artist: artist, mixtape_id: this.props.mixtapeId}
        }).success( data => {
          that.props.check(that);
          that.props.getSongs();
          document.getElementById(that.props.songId).checked = true;
        });
      }
      if(this.props.songs.length>=4){
        document.getElementById(that.props.songId).checked = false;
      }
    } else {
      let song_id;
      for(i=0;i<that.props.songs.length;i++){
        if(that.props.songs[i].song_name == songName && that.props.songs[i].artist_name == artist){
          song_id = that.props.songs[i].song_id;
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
          that.props.unCheck(that);
          that.props.getSongs();
          //$(this.props.songId).attr('checked', false);
        });
      }
    }
    $("#" + that.state.artist.replace(/\s/g, "") + that.state.title.replace(/\s/g, "") + "Image").toggleClass("image-checked");
  }

  albumCover(){
    that = this;
    $.ajax({
      url: "http://api.dar.fm/songart.php?artist=" + that.props.artist + "&title=" + that.props.title + "&res=med&partner_token=9388418650",
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
      this.state.songTitle = currentTitle;
    }
  }

  displayAdd(){
    var styles = {backgroundImage: 'url(' + this.state.albumCoverUrl + ')'}
    var imgIsChecked = false;
    for(i=0;i<this.props.songs.length;i++){
      if(this.props.songs[i].artist_name.replace(/\s/g, "") + this.props.songs[i].song_name.replace(/\s/g, "") == this.props.songId){
        imgIsChecked = true;
      }
    }

    if(imgIsChecked){
      return(
      <div>
        <input id={this.props.songId.replace(/\W+/g, "")} type='checkbox' className='checkbox' name={this.props.songId.replace(/\W+/g, "")} checked={this.state.isChecked}
          onClick={() => this.add(this.props.title, this.props.artist, this.state.isChecked)}></input>
        <label id={this.props.songId.replace(/\s/g, "") + "Image"}htmlFor={this.props.songId} style={styles} className="checkbox-label image-checked"></label>
      </div>
      );
    }else{
      return(
      <div>
        <input id={this.props.songId.replace(/\W+/g, "")} type='checkbox' className='checkbox' name={this.props.songId.replace(/\W+/g, "")} checked={this.state.isChecked}
          onClick={() => this.add(this.props.title, this.props.artist, this.state.isChecked)}></input>
        <label id={this.props.songId.replace(/\W+/g, "") + "Image"}htmlFor={this.props.songId} style={styles} className="checkbox-label"></label>
      </div>
      );
    }

  }

  render(){
    // if(self.props.current_user) {
    checkBox = this.displayAdd()
      // }
    if(this.state.title != this.props.title || this.state.artist != this.props.artist){
      this.state.title = this.props.title;
      this.state.artist = this.props.artist;
      this.props.unCheck(this);
      // set perm id?
      document.getElementById(this.state.songId).checked = false;
      document.getElementById(this.state.songId).id = this.props.songId;
      this.state.songId = this.props.songId;
      for(i=0;i<this.props.songs.length;i++){
      if(this.props.songs[i].song_name == this.props.title && this.props.songs[i].artist_name == this.props.artist){
      document.getElementById(this.props.songId.replace(/\s/g, "")).checked = true;
      this.props.check(this);
      }
    }
  }

    return(<div className="search-result-container" id={this.props.songIndex}>
            <div className="nav4 card-panel height mix-color">
              <div className="card-content">
                  <span className="searchTitle">{this.props.title}</span>
                  <span className="searchArtist">{this.props.artist}</span>
                {this.newImage(this.props.title)}
                <form action="#" className="checkbox-form">
                  {checkBox}
                </form>
                <a className="btn individual-play-button" onClick={()=> this.mobilePlayButton(this.props.title, this.props.artist)}> Play </a>
              </div>
            </div>
          </div>
          );
  }
}

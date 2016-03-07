class TopArtist extends React.Component{
  constructor(props){
    super(props)
    this.state = {albumCoverUrl: "", isMounted: false}
    this.play = this.play.bind(this)
    this.add = this.add.bind(this)
    this.albumCover = this.albumCover.bind(this)
    this.displayAdd = this.displayAdd.bind(this)
  }
  componentDidMount(){
    this.state.isMounted = true;
    this.albumCover()
    $("div.chartSong").click=(() => this.mobilePlayButton(this.props.name, this.props.artist));
  }

  componentWillUnmount(){
    this.state.isMounted = false;
  }

  play(station){
    let player = document.getElementById("player")
    player.src = "http://api.dar.fm/player_api.php?station_id=" + station + "&custom_style=radioslice&partner_token=9388418650"
  }

  play(title, artist){
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

  mobilePlayButton(title, artist){
    debugger
    mobileTitle = title.replace(/\s/g, ".")
    mobileArtist = artist.replace(/\s/g, ".")

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      window.open("http://onrad.io/" + mobileArtist + "." + mobileTitle)
    } else {
      this.play(title, artist);
    }
  }

  add(songName, artist){
    let self = this;
    // mixtape = Mixtape.where(user_id: current_user.id)
    $.ajax({
      url: '/song',
      type: 'POST',
      data: {name: songName, artist: artist, mixtape_id: mixtape}

    }).success( data => {

      self.props.getSongs();

    });
  }

  albumCover(){
    title = this.props.name.replace(/\s/g, '%20');
    artist = this.props.artist.replace(/\s/g, '%20');

    $.ajax({
      url: "http://api.dar.fm/songart.php?artist=" + artist + "&title=" + title + "&res=med&partner_token=9388418650",
      jsonp: 'callback',
      type: 'GET',
      dataType: 'jsonp',
    }).success( data => {
      if(this.state.isMounted == true) {
        this.setState({albumCoverUrl: data[0].arturl});
      }
    });
  }

  displayAdd(){
    if(self.props.current_user != null) {
      return(
        <p>
          <input id={this.props.title} type='checkbox'
            defaultChecked={false}
            onClick={() => this.add(this.props.title,
              this.props.artist, this.checked)}
            checked={this.state.isChecked}
          ></input>
          <label htmlFor={this.props.title}>Add</label>
        </p>
      );
    }
  }

  render(){
    return(
            <div id={"rank" + this.props.rank} className="top-songs-list nav4 hei card-panel height mix-color col l4 m6 s12 z-depth-3">
              <div className="card-content">
                <div className="stylez  center">
                  <div className="list-rank">
                    # {this.props.rank}
                  </div>

                  <div className="list-title">
                    {this.props.name}
                  </div>
                  <br />
                  <img className="list-art" src={this.state.albumCoverUrl} width="80" height="80" />
                  <div className="list-artist">
                    {this.props.artist}
                  </div>
                </div>

                <div className="row">
                  {this.displayAdd()}
                </div>
              </div>
            </div>);
  }
}
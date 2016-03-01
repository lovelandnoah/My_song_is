class TopArtist extends React.Component{
  constructor(props){
    super(props)
    this.state = {albumCoverUrl: "", isMounted: false}
    this.play = this.play.bind(this)
    this.add = this.add.bind(this)
    this.albumCover = this.albumCover.bind(this)
  }
  componentDidMount(){
    this.state.isMounted = true;
    this.albumCover()
  }

  componentWillUnmount(){
    this.state.isMounted = false;
  }

  play(station){
    let player = document.getElementById("player")
    player.src = "http://api.dar.fm/player_api.php?station_id=" + station + "&custom_style=radioslice&partner_token=9388418650"
  }

  mobilePlayButton(station){
    song = this.props.songtitle.replace(/\s/g, ".")
    artist = this.props.songartist.replace(/\s/g, ".")

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      window.open("http://onrad.io/" + artist + "." + song)
    } else {
      this.play(station);
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

  render(){
    return(<div>
            <div className="nav4 hei card-panel height mix-color col l4 m6 s12 z-depth-3">
              <div className="card-content">
                <p className="stylez  center">
                  <em className=""># {this.props.rank}:  {this.props.name} </em>
                  <br />
                  <img src={this.state.albumCoverUrl} width="80" height="80" />
                  {this.props.artist}
                </p>
                <div className="row">
                  <a className="btn waves-effect waves-light marg paddin ply subtitlez" onClick={() => this.mobilePlayButton(this.props.station_id)}>play</a>
                  <a className="btn bluezs waves-effect waves-light ply subtitlez" onClick={() => this.add(this.props.title, this.props.artist)}>Add</a>
                </div>
              </div>
            </div>  
          </div>);
  }
}
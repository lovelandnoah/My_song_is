class TopArtist extends React.Component{
  constructor(props){
    super(props)
    this.play = this.play.bind(this)
    this.add = this.add.bind(this)
  }
  componentDidMount(){
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



  

  render(){
    return(<div>
            <div className="nav4 card-panel height cyan z-depth-3">
              <div className="card-content purple">
                <div className="stylez center truncate">
                  <h4 className="salt white-text"># {this.props.rank}</h4>
                  <h3 className="salt white-text">{this.props.songtitle}</h3>
                  <h4 className="salt white-text">By: {this.props.songartist}</h4>
                </div>
                <div className="row center">
                	<br />
                  <a className="btn waves-effect waves-light marg" onClick={() => this.mobilePlayButton(this.props.station_id)}>play</a>
                  <a className="btn bluezs waves-effect waves-light" onClick={() => this.add(this.props.title, this.props.artist)}>Add</a>
                </div>
                <br />
              </div>
            </div>
          </div>);
  }
}

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
            <div className="white z-depth-3 ">
              <div className="pooop">
                <div className="">
                  <div className="inline">
                    <a className="btn ply white  black-text waves-effect waves-light left" onClick={() => this.mobilePlayButton(this.props.station_id)}>play</a>
                    <a className="btn ply white black-text bluezs waves-effect waves-light left" onClick={() => this.add(this.props.title, this.props.artist)}>Add</a>
                    <h5 className="salt white-text"># {this.props.rank}:  {this.props.name} <span className="salt white-text right teot">By: {this.props.artist}</span></h5>
                    
                  </div>
                </div>
                <div className="">
                </div>
              </div>
            </div>
            
          </div>);
  }
}

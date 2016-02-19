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


  add(songName, artist){
    // debugger
    let self = this;
    $.ajax({
      url: '/song',
      type: 'POST',
      data: {name: songName, artist: artist, mixtape_id: this.props.mixtapeId}

    }).success( data => {

      self.props.getSongs();

    });
  }



  

  render(){
    return(<div>
            <div className="nav4 card-panel height mix-color z-depth-3">
              <div className="card-content custom">
                <p className="stylez center truncate">
                  <h3 className="salt white-text">{this.props.songtitle}</h3>
                  <h4 className="salt white-text">By: {this.props.songartist}</h4>
                </p>
                <div className="row center">
                	<br />
                  <a className="btn waves-effect waves-light marg" onClick={() => this.play(this.props.station_id)}>play</a>
                  <a className="btn bluezs waves-effect waves-light" onClick={() => this.add(this.props.title, this.props.artist)}>Add</a>
                </div>
                <br />
              </div>
            </div>
          </div>);
  }
}

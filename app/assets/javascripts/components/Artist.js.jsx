class Artist extends React.Component{
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
            <div className="nav4 card-panel height mix-color col l4 m6 s12 z-depth-3">
              <div className="card-content">
                <p className="stylez center truncate">
                  {this.props.title}
                  <br />
                  By: {this.props.artist}
                </p>
                <div className="row center">
                  <a className="btn waves-effect waves-light marg" onClick={() => this.play(this.props.station_id)}>play</a>
                  <a className="btn bluezs waves-effect waves-light" onClick={() => this.add(this.props.title, this.props.artist)}>Add</a>
                </div>
              </div>
            </div>
          </div>);
  }
}

class Artist extends React.Component{
  constructor(props){
    super(props)
    this.state = {albumCoverUrl: "", songTitle: ""}
    this.play = this.play.bind(this)
    this.add = this.add.bind(this)
    this.albumCover = this.albumCover.bind(this)
    // debugger
    // this.getSongs = this.getSongs.bind(this)
  }
  componentDidMount(){
   this.albumCover();
   this.state.songTitle = self.props.title;
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
  
  albumCover(){
    self = this;
    $.ajax({
      url: "http://api.dar.fm/songart.php?artist=" + self.props.artist + "&title=" + self.props.title + "&res=med&partner_token=9388418650",
      jsonp: 'callback',
      type: 'GET',
      dataType: 'jsonp',
    }).success( data => {
      this.setState({albumCoverUrl: data[0].arturl});
    });
  }

  newImage(currentTitle){
    if(this.state.songTitle != currentTitle){
      this.albumCover();
    }
  }

  render(){
    return(<div>
            <div className="nav4 card-panel height mix-color col l4 m6 s12 z-depth-3">
              <div className="card-content">
                <p className="stylez truncate">
                  <em>{this.props.title}</em>
                  <br />
                  {this.props.artist}
                </p>
                {this.newImage(this.props.title)}
                <img src={this.state.albumCoverUrl} width="200" height="200" />



                <div className="row center">
                  <a className="btn waves-effect waves-light marg" onClick={() => this.play(this.props.station_id)}>play</a>
                  <a className="btn bluezs waves-effect waves-light" onClick={() => this.add(this.props.title, this.props.artist)}>Add</a>
                </div>

              </div>
            </div>
          </div>);
  }
}

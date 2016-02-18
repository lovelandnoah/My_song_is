class Song extends React.Component{
  constructor(props){
    super(props);
    this.state = {results: [], station_id: 0};
    this.renderPlayButton = this.renderPlayButton.bind(this);
    this.play = this.play.bind(this);  
  }

  componentDidMount(){
    this.renderPlayButton();
  }

  renderPlayButton(){
    self = this;
    artist = this.props.artist_name.replace(/\s/g, '%20')
    song = this.props.song_name.replace(/\s/g, '%20')
  
    $.ajax({
      url: "http://api.dar.fm/playlist.php?q=" + artist + "%20" + song + "&callback=jsonp&web=1&partner_token=1234567890",
      jsonp: 'callback',
      type: 'GET',
      dataType: 'jsonp',
      }).success( data => {
      
      if (data.length != 0) {
        this.setState({station_id: data[0].station_id, results: data});

      };
    });
  }

  mobilePlayBtn(station){
    song = this.props.song_name.replace(/\s/g, ".")
    artist = this.props.artist_name.replace(/\s/g, ".")

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      window.open("http://onrad.io/" + artist + "." + song)
    } else {
      this.play(station);
    } 
  }


  play(station){
    player.src = "http://api.dar.fm/player_api.php?station_id=" + this.state.station_id + "&custom_style=radioslice&partner_token=9388418650"
  }

  render(){

    return(
       <div>
        <div className="paddin">  
          <h5 className='inlin'>
          <span className='song-name'>{this.props.song_name}</span>
          <span> By:  </span> 
          <span className='artist-name'>{this.props.artist_name}</span>
          </h5>
          <button className='btn inlin flo play-button button-grey'>Play</button>
          <button onClick={this.deleteSong} className='btn waves-effect waves-light'>X</button>
        </div>
        <hr />
        </div>
      );
  
  }

}













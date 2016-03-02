class Artist extends React.Component{
  constructor(props){
    super(props)
    this.state = {albumCoverUrl: "", songTitle: "", key: "", isMounted: false}
    this.play = this.play.bind(this)
    this.add = this.add.bind(this)
    this.albumCover = this.albumCover.bind(this)
    this.test = this.test.bind(this)
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
  }

  componentWillUnmount(){
    this.state.isMounted = false;
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

  add(songName, artist){
    debugger
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

  test(){

  }

  render(){
    // return(
    //       <div className='inner'>
    //         <input id={this.props.title} type='checkbox' defaultChecked={false} onClick={this.test} checked={this.state.isChecked}/>
    //         <label htmlFor={this.props.title}>Add</label>
    //         <div className="nav4 row height mix-color z-depth-3" onClick={() => this.play(this.props.title, this.props.artist)}>
    //         <p className='inner'>
    //         <img src={this.state.albumCoverUrl} width="80" height="80" />
    //         <span className='black-text song-name'>{this.props.title}</span>
    //         <span className="grey-text"> {this.props.artist} </span>
    //         </p>
    return(<div>
            <div className="nav4 card-panel height mix-color col l4 m6 s12 z-depth-3"
              onClick={() => this.play(this.props.title, this.props.artist)} >
              <div className="card-content">
                <p className="stylez truncate">
                  <em>{this.props.title}</em>
                  <br />
                  {this.props.artist}
                </p>
                {this.newImage(this.props.title)}
                <form action="#">
                  <p>
                    <input id={this.props.title} type='checkbox'
                      defaultChecked={false}
                      onClick={() => this.add(this.props.title,
                        this.props.artist, this.checked)}
                      checked={this.state.isChecked}
                    />
                    <label htmlFor={this.props.title}>Add</label>
                  </p>
                </form>
                <img src={this.state.albumCoverUrl} width="200" height="200" />
              </div>
            </div>
          </div>);
  }
}
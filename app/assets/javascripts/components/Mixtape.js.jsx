class Mixtape extends React.Component{
  constructor(props){
    super(props)

    // this.playMixtape = this.playMixtape.bind(this);
    // this.deleteMixtape = this.deleteMixtape.bind(this);
    this.songNameInPlayer = this.songNameInPlayer.bind(this);
    this.pictureInPlayer = this.pictureInPlayer.bind(this);
    this.albumCover = this.albumCover.bind(this);
    // this.findPlay = this.findPlay.bind(this);
    // this.shuffle = this.shuffle.bind(this);
    this.playMultipleSongs = this.playMultipleSongs.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentWillMount(){
    this.setState({mixtapeUrl: "/mixtapes/" + this.props.mixtape_id});
  }

  // //                 Play random song without using api
  // shuffle(array) {
  // let currentIndex = array.length, temporaryValue, randomIndex;

  // // While there remain elements to shuffle...
  // while (0 !== currentIndex) {
  //   // Pick a remaining element...
  //   randomIndex = Math.floor(Math.random() * currentIndex);
  //   currentIndex -= 1;
  //   // And swap it with the current element.
  //   temporaryValue = array[currentIndex];
  //   array[currentIndex] = array[randomIndex];
  //   array[randomIndex] = temporaryValue;
  // }

  // return array;
  // }

  // findPlay(){
  //   let playOrder = this.shuffle(this.props.mixtape);
  //   let foundPlay = false;
  //   let attempt = 0;
  //   while(foundPlay == false && attempt < playOrder.length) {
  //     foundPlay = this.playMixtape(playOrder[attempt].song_name, playOrder[attempt].artist_name);
  //     attempt += 1;
  //   }
  // }

  // playMixtape(title, artist){
  //   let rand = Math.round(Math.random() * (this.props.mixtape.length - 1));
  //   let that = this;
  //   title = this.props.mixtape[rand].song_name.replace(/\s/g, '%20');
  //   artist = this.props.mixtape[rand].artist_name.replace(/\s/g, '%20');
  //   $.ajax({
  //     url: "http://api.dar.fm/playlist.php?&q=@artist%20" + artist + "%20@title%20" + title + "&callback=jsonp&web=1&partner_token=9388418650",
  //     jsonp: 'callback',
  //     type: 'GET',
  //     dataType: 'jsonp',
  //   }).success( data => {
  //     let player = document.getElementById("player")
  //     if(data.length){
  //       player.src = "http://api.dar.fm/player_api.php?station_id=" + data[0].station_id + "&custom_style=radioslice&partner_token=9388418650"
  //       that.albumCover(that.props.mixtape[rand].title, that.props.mixtape[rand].artist_name);
  //       that.songNameInPlayer(that.props.mixtape[rand].song_name, that.props.mixtape[rand].artist_name);
  //       return true;
  //   } else {
  //     return false;
  //   }
  
  //   })
  // }

  playMultipleSongs(){
    let queries = [];
    let that = this;

    // number queries starting with 0 which is blank
    let queryNo = [""]
    for(i=0;i<this.props.mixtape.length;i++){
      queryNo.push(i + 1);
    }
    queryNo.pop();


    for(i=0;i<this.props.mixtape.length;i++){
      queries[i] = `&q${queryNo[i]}=(@artist%20${this.props.mixtape[i].artist_name.replace(/\s/g, '%20')}%20@title%20${this.props.mixtape[i].song_name.replace(/\s/g, '%20')})`
    }
    $.ajax({
      url: "http://api.dar.fm/msi.php?" + queries.join(separator = [""]) + "&callback=jsonp&partner_token=9388418650",
      jsonp: 'callback',
      type: 'GET',
      dataType: 'jsonp',
    }).success( data => {      
      if(data[0].success){
        let player = document.getElementById("player")
        player.src = "http://api.dar.fm/player_api.php?station_id=" + data[0].result[0].station_id + "&custom_style=radioslice&partner_token=9388418650"
        that.albumCover(data[0].songmatch[0].title, data[0].songmatch[0].artist);
        that.songNameInPlayer(data[0].songmatch[0].title, data[0].songmatch[0].artist);
      }else{
        alert("song not playing");
      }
    })
  }

  songNameInPlayer(title, artist){
    let titleDisplay = document.getElementById("player-title").innerHTML = title;
    let artistDisplay = document.getElementById("player-artist").innerHTML = artist;
  }

  pictureInPlayer(){
    let pictureDisplay = document.getElementById("main-art").style.backgroundImage = `url(${this.state.albumCoverUrl})`;
  }

  albumCover(title, artist){
    self = this;
    $.ajax({
      url: "http://api.dar.fm/songart.php?artist=" + artist + "&title=" + title + "&res=med&partner_token=9388418650",
      jsonp: 'callback',
      type: 'GET',
      dataType: 'jsonp',
    }).success( data => {
      document.getElementById("main-art").style.backgroundImage = `url(${data[0].arturl})`;
    });
  }

  show_mixtape(){

  }

  remove(songIndex, that){
    $.ajax({
      url: '/song/' + self.state.songs[songIndex].song_id,
      type: 'DELETE',
    }).success( data => {
      //       data: {name: self.state.songs[songIndex].song_name, artist: self.state.songs[songIndex].artist_name, mixtape_id: self.props.mixtapeId}
    });
    
  }

  
  // deleteMixtape(){
  //   let self = this;
  //   $.ajax({
  //     url: '/mixtapes/' + this.props.id,
  //     type: "DELETE",
  //   }).success( data => {
  //     self.props.displayUsersMixTapes('users');
  //   });
  // }

  // deleteBtn(){
  //   if(this.props.author_id == this.props.current_user.id){
  //     return(<div onClick={this.deleteMixtape} className="rightbot waves-effect waves-light btn white-text">
  //             X
  //           </div>)
  //   }
  // }

  render(){

    let songs = this.props.mixtape.map( song => {
      let key = `mixtapeSong-${song.song_id}`;
      return(<SongDetails key={key} songIndex={this.props.mixtape.indexOf(song)} songName={song.song_name} artistName={song.artist_name} songId={song.song_id} remove={this.remove} />);

    });
    return(<div className="pagination">
            <div className='card small cyan z-depth-3 col s6 over playing-mixtape'>
             <div className="toop">
              <button className="btn black-text" onClick={this.playMultipleSongs}>Play</button>
             </div> 
              <div className='card-content white-text boxreset' >
                 {songs}
              </div>
            </div>
          </div>);
  }
}

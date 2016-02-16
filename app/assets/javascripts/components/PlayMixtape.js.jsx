  class PlayMixtape extends React.Component{
  constructor(props){
    super(props)
    this.state = {songs: [], mixtapeName:''};
     this.getSongs = this.getSongs.bind(this);
  }

  componentDidMount(){
    this.getSongs();
  }

  getSongs(){
    $.ajax({
      url: '/mixtapes_find_single_mixtape',
      type: 'GET',
      data: {mixtape_id: this.props.mixtape_id}
    }).success( data => {
      this.setState({mixtapeName: data.name});
      this.setState({songs: data.songs});
    })
  }

  render(){
    let songs = this.state.songs.map( song => {
    let key = `song-${song.song_id}`;

    return(<Song key={key} artist_name={this.props.artist_name} song_name={this.props.song_name} {...song} />);

  });

    return(<div>
            <div className= 'card-panel cyan' id="playing-mixtape">
              <div className='card-content white-text'>
                <h5 className="center">{this.state.mixtapeName} </h5>
                {songs}
              </div>
            </div>
          </div>);
  }
}

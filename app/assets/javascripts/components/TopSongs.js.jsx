class TopSongs extends React.Component{
  constructor(props){
    super(props);
    this.state = {results: [], searched: false, mixtape_id: 0, mixtapeName: '', mixTapeCategory: '', songs: []};
    this.topCharts = this.topCharts.bind(this);
    this.editableBio = this.editableBio.bind(this);
  }

  componentDidMount(){
    this.editableBio();
    this.topCharts()
  }

  editableBio(){
    // make the bio on the user show page editable
    $(function(){
      return $('.best_in_place').best_in_place();
    });
  }

  topCharts(){
    let self = this;
    $.ajax({
      url: "/static_pages/topsongs/song_popular_mysongis",
      type: 'GET',
      data: {name: this.state.name}
    }).success( data => {
      this.setState({results: data.songs});
    });
  }
 
  render(){
    self = this;
    let i = 0;
    let topartists = this.state.results.map( topartist => {
      let key = `topartist-${i += 1}`
      return(<TopArtist key={key} rank={i} {...topartist} rplay={self.playSong} mixtapeId={self.state.mixtape_id} getSongs={this.getSongs}/>);
    });
    
    return(
            <div id='top-songs-container' className='topCard'>
              {topartists}
          </div>        
    )
  }
}
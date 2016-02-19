class TopSongs extends React.Component{
	constructor(props){
		super(props);

		this.state = {results: [], searched: false, mixtape_id: 0, mixtapeName: '', mixTapeCategory: '', songs: []};
    this.topCharts = this.topCharts.bind(this);


	}

  topCharts(){
    let self = this;
    $.ajax({
      url: "/static_pages/topsongs/song_popular_mysongis",
      type: 'GET',
      data: {name: this.state.name}
    }).success( data => {
      // alert("working")
      this.setState({results: data.songs});
    });
  }



  // topCharts(){
  //   let self = this;
  //   $.ajax({
  //     url: "http://api.dar.fm/topsongs.php?q=Music&web=1&partner_token=9388418650",
  //     jsonp: 'callback',
  //     type: 'GET',
  //     dataType: 'jsonp',
  //   }).success( data => {
  //     // this.state.searched = true;
  //     this.setState({results: data});
  //   });
  // }



	render(){
		self = this;
    let i = 0;
    // debugger
    let topartists = this.state.results.map( topartist => {
      let key = `topartist-${i += 1}`
      return(<TopArtist key={key} rank={i} {...topartist} rplay={self.playSong} mixtapeId={self.state.mixtape_id} getSongs={this.getSongs}/>);
    });

		return(
	  	<div className="center container" >
	           		{this.topCharts()}
                <br />
	           		<br />
						<div className='row' onMouseEnter={this.topCharts}>
            	{topartists}
          </div>
	    </div>

		)
	}
}

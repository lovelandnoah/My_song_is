class TheHome extends React.Component{
  constructor(props){
    super(props);
    
    if(this.props.mixtape_id){

      this.state = { searchVisible: true, mixtape_id: this.props.mixtape_id};
    } else {
      this.state = { searchVisible: true};


      this.state = {sortMixtapesVisible: false, searchVisible: false, playMixtapeVisible: true, mixtape_id: this.props.mixtape_id};
    };

    this.DisplaySearch = this.DisplaySearch.bind(this);
	}

	DisplaySearch(){
		this.setState({searchVisible: true});
	}

	render(){
		if (this.state.searchVisible) {
			
			return(
			<div>
				<br />
				<div className="center">
					<button className="btn nav1" onClick={this.DisplaySearch}>Create Mixtape</button>
				</div>
				<br />
				<h1 className="center salt tit">Creating a Mixtape</h1>
				<br/ >
				<Search current_user={this.props.current_user}/>
			</div>);
		};



		if (this.state.playMixtapeVisible) {
			
			return(
			<div>
			<br />
				<div className="center">
					<button className="btn nav1" onClick={this.DisplaySortMixtapes}>Mixtapes</button>
					<button className="btn nav2" onClick={this.DisplaySearch}>Create New Mixtape</button>
				</div>
				<br />
				<h1 className="center salt white-text tit">Playin a Mix</h1>
				<br />
				<PlayMixtape current_user={this.props.current_user} mixtape_id={this.state.mixtape_id}/>
			</div>);
		};

	}
}


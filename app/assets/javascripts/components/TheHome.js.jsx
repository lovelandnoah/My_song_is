class TheHome extends React.Component{
  constructor(props){
    super(props);
    this.state = {sortMixtapesVisible: false, searchVisible: true, playMixtapeVisible: false, mixtape_id: 0};
    this.DisplaySortMixtapes = this.DisplaySortMixtapes.bind(this);
    this.DisplaySearch = this.DisplaySearch.bind(this);
    this.DisplayPlayMixtape = this.DisplayPlayMixtape.bind(this);
    
	}


	DisplaySortMixtapes(){
		this.setState({sortMixtapesVisible: true});
		this.setState({searchVisible: false});
		this.setState({playMixtapeVisible: false});
	}

	DisplaySearch(){
		this.setState({sortMixtapesVisible: false});
		this.setState({searchVisible: true});
		this.setState({playMixtapeVisible: false});

	}

	DisplayPlayMixtape(mixtape_id){
		this.setState({mixtape_id: mixtape_id})
		this.setState({sortMixtapesVisible: false});
		this.setState({searchVisible: false});
		this.setState({playMixtapeVisible: true});
	}




	render(){



		  // debugger
		 self = this;

		if (this.state.sortMixtapesVisible) {
			return(
			<div>
				<button className="btn nav1 waves-effect waves-light" onClick={this.DisplaySortMixtapes}>Mixtapes</button>
				<button className="btn nav2 waves-effect waves-light" onClick={this.DisplaySearch}>Search and Create Mix(s)</button>
				<button className="btn nav3 waves-effect waves-light" onClick={this.DisplayPlayMixtape}>Play Mixtape</button>
				<SortMixtapes current_user={this.props.current_user} DisplayPlayMixtape = {this.DisplayPlayMixtape}/>
			</div>);
		};

		if (this.state.searchVisible) {
			return(
			<div>
				<button className="btn cyan nav1 waves-effect waves-light" onClick={this.DisplaySortMixtapes}>Mixtapes</button>
				<button className="btn pink nav2 waves-effect waves-light" onClick={this.DisplaySearch}>Search and Create Mix(s)</button>
				<button className="btn teal nav3 waves-effect waves-light" onClick={this.DisplayPlayMixtape}>Play Mixtape</button>
				<Search current_user={this.props.current_user}/>
			</div>);
		};

		if (this.state.playMixtapeVisible) {
			return(
			<div>		
				<button className="btn nav1" onClick={this.DisplaySortMixtapes}>Mixtapes</button>
				<button className="btn nav2" onClick={this.DisplaySearch}>Search and Create Mix(s)</button>
				<button className="btn nav3" onClick={this.DisplayPlayMixtape}>Play Mixtape</button>
				<PlayMixtape current_user={this.props.current_user} mixtape_id={this.state.mixtape_id}/>
			</div>);
		};
		

		
	}
}








class TheHome extends React.Component{
  constructor(props){
    super(props);
    
    if(this.props.mixtape_id){
      this.state = {sortMixtapesVisible: false, searchVisible: false, playMixtapeVisible: true, mixtape_id: this.props.mixtape_id};
    } else {
      this.state = {sortMixtapesVisible: true, searchVisible: false, playMixtapeVisible: false};
    }

    this.DisplaySortMixtapes = this.DisplaySortMixtapes.bind(this);
    this.DisplaySearch = this.DisplaySearch.bind(this);
    this.DisplayPlayMixtape = this.DisplayPlayMixtape.bind(this);
	}

	DisplaySortMixtapes(mode){
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
		 self = this;
		if (this.state.sortMixtapesVisible) {
			return(
			<div className="inner">				
				<button className="btn buttonnav" onClick={this.DisplaySearch}>Create New Mixtape</button>
				<SortMixtapes current_user={this.props.current_user} DisplayPlayMixtape = {this.DisplayPlayMixtape} display_user_mixtapes={this.state.display_user_mixtapes} />
			</div>);
		};

		if (this.state.searchVisible) {
			return(
			<div>
				<br />
				<div className="center">
					<button className="btn nav1" onClick={this.DisplaySortMixtapes}>Mixtapes</button>
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

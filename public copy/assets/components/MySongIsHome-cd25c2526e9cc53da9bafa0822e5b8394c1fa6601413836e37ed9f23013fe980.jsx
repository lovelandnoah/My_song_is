class MySongIsHome extends React.Component{
	constructor(props){
		super(props);

		// if(this.props.mixtape_id){

  //     this.state = {searchVisible: false, playMixtapeVisible: true, mixtape_id: this.props.mixtape_id};
  //   } else {
  //   	debugger
  //     this.state = {searchVisible: false, playMixtapeVisible: true};
  //   }
  	this.state = {searchVisible: false, playMixtapeVisible: true, mixtape_id: this.props.mixtape_id};
    this.DisplaySearch = this.DisplaySearch.bind(this);
    this.HideSearch = this.HideSearch.bind(this);
    // this.DisplayPlayMixtape = this.DisplayPlayMixtape.bind(this);
	}

	DisplaySearch(){
		this.setState({searchVisible: true});
		console.log('display');
		// this.setState({playMixtapeVisible: true});
	}

	HideSearch(){
		this.setState({searchVisible: false});
		console.log('hide');
	}

	// DisplayPlayMixtape(mixtape_id){
	// 	//this.setState({mixtape_id: mixtape_id})
	// 	this.setState({searchVisible: false});
	// 	this.setState({playMixtapeVisible: true});
	// }

	render(){
		 self = this;
		
		if (this.state.searchVisible) {
			return(
			<div>
			<br />
				<br />
				<h1 className="center salt white-text tit">My Song Is</h1>
				<br />
				<PlayMixtape current_user={this.props.current_user} mixtape_id={this.state.mixtape_id}/>
				<div className="center">
					<button className="btn nav2" onClick={this.HideSearch}>Done</button>
				</div>
				<Search current_user={this.props.current_user}  mixtape_id={this.state.mixtape_id}/>
			</div>);
		}else{
			return(
			<div>
			<br />
				<br />
				<h1 className="center salt white-text tit">My Song Is</h1>
				<br />
				<PlayMixtape current_user={this.props.current_user} mixtape_id={this.state.mixtape_id}/>
				<div className="center">
					<button className="btn nav2" onClick={this.DisplaySearch}>Edit</button>
				</div>
			</div>);
		};
	}


}
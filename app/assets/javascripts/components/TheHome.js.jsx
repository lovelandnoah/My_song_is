class TheHome extends React.Component{
  constructor(props){
    super(props);
    
    if(this.props.mixtape_id){
      this.state = { searchVisible: true, mixtape_id: this.props.mixtape_id};
    } else {
      this.state = { searchVisible: true};
    }

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
				<h1 className="center salt white-text tit">Creating a Mixtape</h1>
				<br/ >
				<Search current_user={this.props.current_user}/>
			</div>);
		};

	}
}


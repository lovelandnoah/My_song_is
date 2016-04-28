class ViewPlayer extends React.Component{
  constructor(props){
    super(props);
    this.state = {stationUrl: ""}
  }

  componendDidMount(){
  }

  mobilePlayer(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return(<div>
        </div>
        )
  } else {
    return(
      <iframe className="" id="player" src={this.stationUrl}></iframe>
    )
    }
  }

  render(){
    return(
      <div>
        {this.mobilePlayer()}
      </div>
    )
  }
}

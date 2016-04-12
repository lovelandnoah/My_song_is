class Player extends React.Component{
  constructor(props){
    super(props);
    this.state = {stationUrl: ""}
  }

  mobilePlayer(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return(<div>
        </div>
        )
  } else {
    return(
      <iframe className="hidden" id="player" src={this.stationUrl}></iframe>
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

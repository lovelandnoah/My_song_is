class Player extends React.Component{
  constructor(props){
    super(props);
    this.state = {}
  }

  mobilePlayer(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return(<div>
        </div>
        )
  } else {

    return(<div>
              <iframe className="player" id="player" src="http://api.dar.fm/player_api.php?station_id=6480&custom_style=radioslice&partner_token=9388418650"></iframe>
            </div>
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



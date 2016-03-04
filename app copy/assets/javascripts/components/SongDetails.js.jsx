class SongDetails extends React.Component{
  constructor(props){
    super(props)
  }

  render() {
    return(<li className="crd"> {this.props.songName} by {this.props.artistName} </li>)
  }
}

class SongDetails extends React.Component{
  constructor(props){
    super(props);
  }

  render() {
    return(
      <div>
        <p className=""> {this.props.songName} by {this.props.artistName} </p>
        <button className="btn black-text" onClick={() => this.props.remove(this.props.songIndex)}>Delete</button>

        </div>
  )}
}
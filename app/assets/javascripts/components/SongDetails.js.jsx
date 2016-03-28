class SongDetails extends React.Component{
  constructor(props){
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(){
    debugger
    if (typeof this.props.onChange === 'function') {
        this.props.onChange(e.target.value);
    }
  }

  render() {
    return(
      <div>
        <p className=""> {this.props.songName} by {this.props.artistName} </p>
        <button className="btn black-text" onClick={() => this.props.onChange(this.props.songIndex, this.props.songName, this.props.artistName)}>Delete</button>
      </div>
  )}
}
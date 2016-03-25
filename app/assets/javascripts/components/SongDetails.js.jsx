class SongDetails extends React.Component{
  constructor(props){
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(){
    if (typeof this.props.onChange === 'function') {
        this.props.onChange(e.target.value);
    }
  }

  render() {
    debugger
    return(
      <div>
        <p className=""> {this.props.songName} by {this.props.artistName} </p>
        <button className="btn black-text" onClick={() => this.props.changeHandler(this.props.songIndex)}>Delete</button>
      </div>
  )}
}
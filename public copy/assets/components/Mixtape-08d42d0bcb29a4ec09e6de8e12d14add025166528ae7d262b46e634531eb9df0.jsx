class Mixtape extends React.Component{
  constructor(props){
    super(props)

    this.playMixtape = this.playMixtape.bind(this);
    this.deleteMixtape = this.deleteMixtape.bind(this)
    
  }

  componentWillMount(){
    this.setState({mixtapeUrl: "/mixtapes/" + this.props.mixtape_id});
  }


  playMixtape(){
    this.props.displayPlayMixtape(this.props.mixtape_id);

  }

  show_mixtape(){

  }


  deleteMixtape(){
    let self = this;
    $.ajax({
      url: '/mixtapes/' + this.props.id,
      type: "DELETE",
    }).success( data => {
      self.props.displayUsersMixTapes('users');
    });
  }

  deleteBtn(){
    if(this.props.author_id == this.props.current_user.id){
      return(<div onClick={this.deleteMixtape} className="rightbot waves-effect waves-light btn white-text">
              X
            </div>)
    }
  }

  render(){
    
    let songs = this.props.mixtape.map( song => {
      let key = `mixtapeSong-${song.song_id}`;
      return(<SongDetails key={key} songName={song.song_name} artistName={song.artist_name} songId={song.song_id} />);
    });

    return(<div className="pagination">

            <div className='card small cyan z-depth-3 col s6 over playing-mixtape'>
             { this.deleteBtn() }
             <div className="toop">
              <button className="btn black-text" onClick={this.playMixtape}>Play</button>
             </div> 
              <div className='card-content white-text boxreset' >
                <p className="salt crd">{this.props.name}</p>
                <br />
                 {songs}
              </div>
             <div>
              </div>
             <br />
             <br />
            </div>
          </div>);
  }
}

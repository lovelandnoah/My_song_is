class UpdatingImage extends React.Component{
    constructor(props){
    super(props)
    
  }

  render(){
    return(
        <img src={this.props.picture}/>
      )
  }
}
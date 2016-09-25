var defaultState = {
    components:{
      typingGame: {
        typingText: "Horace is amazing Horace is amazing Horace is amazing",
        userPos: 0,
        opponentsPos: 0
      }
    }
  }
  function updateUserPos(index){
    return {
      type: 'UPDATE_USER_POS',
      userPos: index
    }
  }

  function updateOpponentsPos(index){
    return {
      type: 'UPDATE_OPPONENTS_POS',
      opponentsPos: index
    }
  }
  function TypeGame(state, action){
    switch (action.type) {
      case 'UPDATE_USER_POS':
        var newState = Object.assign({}, state);
        newState.components.typingGame.userPos = action.userPos;
        return newState;
      case 'UPDATE_OPPONENTS_POS':
        var newState = Object.assign({}, state);
        newState.components.typingGame.opponentsPos = action.opponentsPos;
        return newState;
      default:
        return state;
    }
  }
  var store=Redux.createStore(TypeGame,defaultState);
  var socket = io();

  var TextTypingGame = React.createClass({
    getInitialState: function(){
      return {
        typingText: this.props.text
      }
    },
    componentWillMount: function(){
      store.subscribe(()=>{
        this.setState({});
      });
    },
    putPositionOfUser: function(){
      var curUserPos = store.getState().components.typingGame.userPos;
      var curOpponentPos = store.getState().components.typingGame.opponentsPos;
      console.log(store.getState().components.typingGame);
      var curText = this.state.typingText;
      String.prototype.replaceAt=function(index, character) {
        return this.substr(0, index) + character + this.substr(index+character.length);
      }
      curText = curText.replaceAt(curUserPos, "|");
      curText = curText.replaceAt(curOpponentPos, "+");
      return curText;
    },
    render: function(){
      var finalText = this.putPositionOfUser();
      console.log(finalText);
      return (<div>{finalText}</div>);
    }
  });

  var InputTypingGame = React.createClass({
    getInitialState: function(){
      return {
        typingText: this.props.text,
      }
    },
    // componentWillMount: function(){
    //   store.subscribe(()=>{
    //     var state = store.getState();
    //     this.setState({
    //       currentUserPos: state.components.typingGame.userPos
    //     });
    //   });
    // },
    keyPress: function(event){
      var curTypingText = this.state.typingText;
      var curTypingPos = store.getState().components.typingGame.userPos;
      if (String.fromCharCode(event.which)===curTypingText[curTypingPos]){
        store.dispatch(updateUserPos(curTypingPos+1));
        socket.emit("opponent:typePos", {opponentsPos: curTypingPos+1});
      }
      if (String.fromCharCode(event.which)===" "){
        event.target.value=""; 
      }
    },
    render: function(){
      return (<div>
                <input id="bruh" onKeyPress={this.keyPress} />
              </div>);
    }
  });

  var TypingGame = React.createClass({
    componentWillMount: function(){
      socket.on('opponent:typePos', this._updateOpponentsPos);
    },
    _updateOpponentsPos: function(data){
      store.dispatch(updateOpponentsPos(data.opponentsPos));
    },
    render: function(){
      var text="horace is amazing horace is amazing horace is amazing horace is amazing";
      return (<div><TextTypingGame text={text}/><InputTypingGame text={text}/></div>); 
    }
  });
  ReactDOM.render(<TypingGame/>, document.getElementById('typingbox'));
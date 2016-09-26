import React from 'react';
import {render} from 'react-dom';

var defaultState = {
    components:{
      typingGame: {
        typingText: "",
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

  function setTypingText(string){
    return {
      type: 'SET_TYPING_TEXT',
      typingText: string
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
      case 'SET_TYPING_TEXT':
        var newState = Object.assign({}, state);
        newState.components.typingGame.typingText = action.typingText;
        return newState;
      default:
        return state;
    }
  }
  var store=Redux.createStore(TypeGame,defaultState);
  var socket = io();

  class TextTypingGame extends React.Component {
    constructor(props){
      super(props);
      store.subscribe(()=>{
        this.setState({});
      });
    }
    putPositionOfUser() {
      var curUserPos = store.getState().components.typingGame.userPos;
      var curOpponentPos = store.getState().components.typingGame.opponentsPos;
      console.log(store.getState().components.typingGame);
      var curText = store.getState().components.typingGame.typingText;
      String.prototype.replaceAt=function(index, character) {
        return this.substr(0, index) + character + this.substr(index+character.length);
      }
      curText = curText.replaceAt(curUserPos, "|");
      curText = curText.replaceAt(curOpponentPos, "+");
      return curText;
    }
    getFirstPart(){
      var curUserPos = store.getState().components.typingGame.userPos;
      var curOpponentPos = store.getState().components.typingGame.opponentsPos;
      console.log(store.getState().components.typingGame);
      var curTypingText = store.getState().components.typingGame.typingText;
      var curText = curTypingText;
      var min = Math.min(curUserPos, curOpponentPos);
      return curText.substr(0, min);
    }
    getSecondPart(){
      var curUserPos = store.getState().components.typingGame.userPos;
      var curOpponentPos = store.getState().components.typingGame.opponentsPos;
      console.log(store.getState().components.typingGame);
      var curTypingText = store.getState().components.typingGame.typingText;
      var curText = curTypingText;
      var min = Math.min(curUserPos, curOpponentPos);
      var max = Math.max(curUserPos, curOpponentPos);
      return curText.substr(min,max-min);
    }
    getThirdPart(){
      var curUserPos = store.getState().components.typingGame.userPos;
      var curOpponentPos = store.getState().components.typingGame.opponentsPos;
      console.log(store.getState().components.typingGame);
      var curTypingText = store.getState().components.typingGame.typingText;
      var curText = curTypingText;
      var max = Math.max(curUserPos, curOpponentPos);
      return curText.substr(max);
    }
    render(){
      var firstpart = this.getFirstPart();
      var secondpart = this.getSecondPart();
      var thirdpart = this.getThirdPart();
      console.log(firstpart);
      var divStyleOpponent = {
        color: 'red',
        display: 'inline'
      };
      var divStyleYou = {
        color: '#00BB00',
        display: 'inline'
      };
      var curUserPos = store.getState().components.typingGame.userPos;
      var curOpponentPos = store.getState().components.typingGame.opponentsPos;
      if(curUserPos >= curOpponentPos) {
        return (<div>{firstpart}<div style={divStyleOpponent}>|</div>{secondpart}<div style={divStyleYou}>|</div>{thirdpart}</div>);
      } else {
        return (<div>{firstpart}<div style={divStyleYou}>|</div>{secondpart}<div style={divStyleOpponent}>|</div>{thirdpart}</div>);
      }
    }

  };

  class InputTypingGame extends React.Component {
    constructor(props){
      super(props);
    }
    // componentWillMount: function(){
    //   store.subscribe(()=>{
    //     var state = store.getState();
    //     this.setState({
    //       currentUserPos: state.components.typingGame.userPos
    //     });
    //   });
    // },
    keyPress(event){
      var curTypingText = store.getState().components.typingGame.typingText;
      var curTypingPos = store.getState().components.typingGame.userPos;
      if (String.fromCharCode(event.which)===curTypingText[curTypingPos]){
        store.dispatch(updateUserPos(curTypingPos+1));
        socket.emit("opponent:typePos", {opponentsPos: curTypingPos+1});
      }
      if (String.fromCharCode(event.which)===" "){
        event.target.value=""; 
      }
    }

    render(){
      return (<div>
                <input id="bruh" onKeyPress={this.keyPress} />
              </div>);
    }
  };

  class TypingGame extends React.Component {
    constructor(props){
      super(props);
      var text="horace is amazing horace is amazing horace is amazing horace is amazing";
      store.dispatch(setTypingText("Dude I'm pretty fucking good"));
    }
    componentWillMount(){
      socket.on('opponent:typePos', this._updateOpponentsPos);
    }
    _updateOpponentsPos(data){
      store.dispatch(updateOpponentsPos(data.opponentsPos));
    }
    render() {
      return (<div><TextTypingGame/><InputTypingGame/></div>); 
    }
  };

  render(<TypingGame/>, document.getElementById('typingbox'));
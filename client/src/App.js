import React, { Component } from 'react';
import io from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

const socket = io(`${location.protocol}//${location.hostname}:9999`);

class RPSButtons extends Component {
    constructor(props) {
        super(props);
        this.clickRock = this.clickRock.bind(this);
        this.clickPaper = this.clickPaper.bind(this);
        this.clickScissor = this.clickScissor.bind(this);
    }
    clickRock() {
        this.props.onClick('R');
    }
    clickPaper() {
        this.props.onClick('P');
    }
    clickScissor() {
        this.props.onClick('S');
    }
    render() {
        return (
                <div className="row" id="buttons">
                <div className="col-md-4 col-sm-12">
                <button className="btn btn-default btn-lg btn-block" onClick={this.clickRock}>Rock</button>
                </div>
                <div className="col-md-4 col-sm-12">
                <button className="btn btn-default btn-lg btn-block" onClick={this.clickPaper}>Paper</button>
                </div>
                <div className="col-md-4 col-sm-12">
                <button className="btn btn-default btn-lg btn-block" onClick={this.clickScissor}>Scissor</button>
                </div>
                </div>
               )

    }
}
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {isPlaying: false};
        this.handleClick =  this.handleClick.bind(this);
    }
    componentDidMount() {
        socket.on('play', () => this.setState({isPlaying: true, hasWinner: false}));
        socket.on('winner', (data) => {
            this.setState({isPlaying: false, hasWinner: true, winner: data});

            window.setTimeout(function() {socket.emit('replay');}, 1000);

        });

    }
    handleClick(value) {
        socket.emit('played', value);
        this.setState({isPlaying: false});
        console.log(value);
    }
    render() {
        let button = null;
        let winner = null;
        if (!this.state.isPlaying) {
            button = (
                    <h2>Please wait for another player.</h2>
                    );
        }
        else {
            button = <RPSButtons onClick={this.handleClick}/>;
        }
            
        if (!this.state.isPlaying && this.state.hasWinner) {
            if (this.state.winner > 0) {
                winner = (<h2>A winner is you!</h2>);
            }
            else if (this.state.winner < 0) {
                winner = (<h2>We fooking lost</h2>);
            }
            else {
                winner = (<h2>It's a draw!</h2>);
            }
        }



        return (
                <div>
                <h1>Welcome to Online Rock Paper Scissor</h1>
                {button}
                {winner}
                </div>
               )
    }
}

export default App;

import "./App.css";
import React from "react";
import lottery from './lottery';
import web3 from "./web3";
 
class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
  };
  
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ 
      manager,
      players,
      balance,
    })
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction...'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    });

    this.setVanishedMessage('You have been entered!');
    this.setState({ value: '' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction...'});
    
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setVanishedMessage('A winner has been picked!');
  }

  setVanishedMessage = (message) => {
    this.setState({message})
    setTimeout(() => this.setState({message: ''}), 5000);
  }

  render() {
    return (
      <div className="App">
        <h2>Lottery Contract!</h2>
        <p>
          <div>this contract is managed by { this.state.manager }</div>
          <div>number of players: { this.state.players.length }</div>
          <div>total amount paid { web3.utils.fromWei(this.state.balance) } ether!</div>
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try you luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input 
              style={{'margin-left': '10px'}}
              value={ this.state.value }
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        
        <hr />

        <h4>Ready to pick a winner</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
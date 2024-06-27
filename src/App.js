import react from "react";

class App extends react.Component {
  constructor(props) {
    super(props);
    this.state = { ...props };
  }
  render() {
    return (
      <div>
        <h1>Classy Weather</h1>
      </div>
    );
  }
}

export default App;

// class Counter extends react.Component {
//   constructor(props) {
//     super(props);

//     this.state = { count: 10 };
//     this.handleDecrement = this.handleDecrement.bind(this);
//     this.handleIncrement = this.handleIncrement.bind(this);
//   }

//   handleDecrement() {
//     this.setState((currState) => {
//       return { ...currState, count: this.state.count - 1 };
//     });
//   }

//   handleIncrement() {
//     this.setState((currState) => {
//       return { ...currState, count: this.state.count + 1 };
//     });
//   }

//   render() {
//     const date = new Date();
//     return (
//       <div>
//         <button onClick={this.handleDecrement}>-</button>
//         <span>{this.state.count}</span>
//         <button onClick={this.handleIncrement}>+</button>
//       </div>
//     );
//   }
// }

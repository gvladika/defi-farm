import React, { Component } from "react";
import dai from "../dai.png";

class Main extends Component {
  state = {
    amountToStake: "0",
  };

  onSubmit = async (event) => {
    event.preventDefault();
    let amount;
    amount = window.web3.utils.toWei(this.state.amountToStake, "Ether");
    console.log("Eto me", amount);
    this.props.stakeTokens(amount);
  };

  render() {
    return (
      <div id="content" className="mt-3">
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Staking Balance</th>
              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.stakingBalance, "Ether")} mDai</td>
              <td>{window.web3.utils.fromWei(this.props.dappTokenBalance, "Ether")} DAPP</td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4">
          <div className="card-body">
            <form className="mb-3" onSubmit={this.onSubmit}>
              <div>
                <label className="float-left">
                  <b>Stake tokens</b>
                </label>
                <span className="float-right text-muted">
                  Balance: {window.web3.utils.fromWei(this.props.daiTokenBalance, "Ether")}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  className="form-control from-control-lg"
                  placeholder="0"
                  value={this.state.amountToStake}
                  onChange={(event) => this.setState({ amountToStake: event.target.value })}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={dai} height="20" alt=""></img>
                    &nbsp;&nbsp;&nbsp; mDAI
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">
                Stake!
              </button>
            </form>

            <button
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={(event) => {
                event.preventDefault();
                this.props.unstakeTokens();
              }}
            >
              Unstake tokens
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;

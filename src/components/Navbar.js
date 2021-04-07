import React, { Component } from "react";
import farmer from "../farmer.png";
import { Menu } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

class Navbar extends Component {
  render() {
    return (
      <Menu color="blue" inverted>
        <Menu.Item name="home">
          <img src={farmer} width="30" height="30" alt="" />
        </Menu.Item>
        <Menu.Item name="messages">&nbsp;Dapp Token Farm</Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item name="acc">{this.props.account}</Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Navbar;

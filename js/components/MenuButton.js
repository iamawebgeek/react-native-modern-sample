import React, { Component } from 'react';
import { Button } from 'native-base';
import { Text } from 'react-native';

export default class MenuButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Button transparent onPress={() => {this.props.onPress();}}>
        <Text style={{fontSize: 18, color: '#719490'}}>{this.props.text}</Text>
      </Button>
    );
  }
}

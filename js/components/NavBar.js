import {
  Header,
  Left,
  Button,
  Icon,
  Body,
  Title,
  Right,
  Drawer,
} from 'native-base';
import React, { Component } from 'react';
import { Dimensions } from 'react-native';

export default class NavBar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Header>
        <Left>
          <Button transparent>
            <Icon name='menu' />
          </Button>
        </Left>
        <Body>
          <Title>{this.props.title}</Title>
        </Body>
        <Right />
      </Header>
    );
  }
}

import React, { Component } from 'react';
import { View } from 'react-native';
import {
  Drawer,
  Spinner,
  Content,
  Header,
  Left,
  Button,
  Icon,
  Body,
  Title,
  Right,
} from 'native-base';
import Sidebar from './Sidebar';
import { DefaultRenderer } from 'react-native-router-flux';

export default class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.openDrawer = this.openDrawer.bind(this);
    this.props.store.closeDrawer = this.closeDrawer = this.closeDrawer.bind(this);
  }
  closeDrawer() {
    return this.drawer._root.close();
  }
  openDrawer() {
    return this.drawer._root.open();
  }
  render() {
    const state = this.props.navigationState;
    const children = state.children;
    return (
      <Drawer
        ref={(ref) => { this.drawer = ref; }}
        tapToClose={true}
        type="displace"
        content={<Sidebar store={this.props.store} closeDrawer={this.closeDrawer}/>}
        panOpenMask={0.25}>
        <Header>
          <Left>
            <Button transparent onPress={this.openDrawer}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>{children[0].title}</Title>
          </Body>
          <Right />
        </Header>
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </Drawer>
    );
  }
}

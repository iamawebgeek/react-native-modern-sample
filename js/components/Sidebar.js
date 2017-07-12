import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { Button } from 'native-base';
import { UserTypes } from './../store';
import Client from './Client';
import Owner from './Owner';
import Courier from './Courier';
import MenuButton from './MenuButton';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  handleLogout() {
    this.props.store.logout();
    this.props.closeDrawer();
    AsyncStorage.removeItem('@username');
    Actions.noauth({type: ActionConst.REPLACE});
  }
  renderButtons({type}) {
    switch (type) {
      case UserTypes.CLIENT:
        return <Client closeDrawer={this.props.closeDrawer}/>;
      case UserTypes.RESTAURANT_OWNER:
        return <Owner store={this.props.store} closeDrawer={this.props.closeDrawer}/>;
      case UserTypes.COURIER:
        return <Courier closeDrawer={this.props.closeDrawer}/>;
    }
    return null;
  }
  render() {
    const {userData} = this.props.store;
    return (
      <View style={{backgroundColor: '#fff', flex: 1}}>
        <View style={{flex: 1, backgroundColor: '#719490', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch'}}>
          <Text style={{color: '#fff', fontSize: 26, alignSelf: 'center'}}>{userData.username}</Text>
        </View>
        <View style={{flex: 4}}>
          {this.renderButtons(userData)}
          <MenuButton text='Logout' onPress={this.handleLogout}/>
        </View>
      </View>
    );
  }
}

import React, { Component } from 'react';
import {
  Content,
  Header,
  Title,
  Body,
  List,
  ListItem,
  Button
} from 'native-base';
import { Text, Alert } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { observer } from 'mobx-react';
import Wrapper from './Wrapper';

@observer
class Index extends Component {
  componentWillMount() {
    this.props.store.loadRestaurants();
  }
  renderRestaurant(restaurant) {
    return (
      <ListItem onPress={() => Actions.meals({type: ActionConst.REPLACE, id: restaurant.id})} key={restaurant.id}>
        <Text style={{fontSize: 18}}>{restaurant.name}</Text>
      </ListItem>
    );
  }
  render() {
    const store = this.props.store;
    return (
      <List button dataArray={store.restaurants.slice()} renderRow={restaurant => this.renderRestaurant(restaurant)}/>
    );
  }
}

export default Index;

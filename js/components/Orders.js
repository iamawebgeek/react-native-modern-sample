import React, { Component } from 'react';
import { Content, Card, CardItem, Body, Left, Thumbnail, Button, H3 } from 'native-base';
import { Text, Image, View, Picker } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { UserTypes } from '../store';
import { observer } from 'mobx-react';
import DialogAndroid from 'react-native-dialogs';

export default @observer class Orders extends Component {
  constructor(props) {
    super(props);
    this.findMeal = this.findMeal.bind(this);
    this.acceptOrder = this.acceptOrder.bind(this);
    this.showCouriersList = this.showCouriersList.bind(this);
  }
  componentWillMount() {
    let store = this.props.store;
    store.loadUserOrders();
    if (store.userData.type == UserTypes.RESTAURANT_OWNER) {
      store.loadCouriers();
    }
  }
  showCouriersList(order) {
    let dialog = new DialogAndroid();
    dialog.set({
      items: this.props.store.activeCouriers.map(courier => courier.userObj != null ? courier.userObj.username : '?'),
      title: 'Select courier',
      itemsCallback: (index, text) => {
        order.courier = this.props.store.activeCouriers[index].user;
        this.acceptOrder(order);
      },
    });
    dialog.show();
  }
  findMeal(mealId, restaurantId) {
    return this.props.store.userRestaurant.meals[mealId] || {};
  }
  acceptOrder(order) {
    this.props.store.acceptOrder(order);
  }
  deliverOrder(order) {
    return () => {
      this.props.store.deliverOrder(order);
    };
  }
  renderAcceptButton(order) {
    if (!order.accepted && this.props.store.userData.type == UserTypes.RESTAURANT_OWNER) {
      return (
        <Button primary onPress={() => this.showCouriersList(order)}>
          <Text style={{color: 'white'}}>Accept</Text>
        </Button>

      );
    }
    return null;
  }
  renderDeliverButton(order) {
    if(!order.delivered && this.props.store.userData.type == UserTypes.COURIER) {
      return (
        <Button primary onPress={this.deliverOrder(order)}>
          <Text style={{color: 'white'}}>Deliver</Text>
        </Button>
      );
    }
    return null;
  }
  render() {
    const store = this.props.store;
    const orders = store.userOrders;
    return (
      <Content style={{padding: 15}}>
        {orders.length > 0 ? orders.map(order => {
          return (
            <Card key={order.id}>
              <CardItem>
                <Left>
                  <Body>
                    <H3>Order details</H3>
                    <Text>Meal: {order.meal && order.meal.name ? order.meal.name : ''}</Text>
                    <Text>Contact: {order.contact}</Text>
                    <Text>Quantity: {order.quantity}</Text>
                    <Text>Location: {order.location}</Text>
                    <Text>User: {order.userObj && order.userObj.username ? order.userObj.username : ''}</Text>
                    {order.accepted ? <Text>Courier: {order.courierObj && order.courierObj.username ? order.courierObj.username : ''}</Text> : null}
                    <Text>Status: {order.accepted ? (order.delivered ? 'Delivered' : 'On deliver') : 'Waiting'}</Text>
                    {this.renderAcceptButton(order)}
                    {this.renderDeliverButton(order)}
                  </Body>
                </Left>
              </CardItem>
            </Card>
          );
        }) : <Text>No orders</Text>}
      </Content>
    );
  }
}

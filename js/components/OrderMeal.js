import React, { Component } from 'react';
import {
  Content,
  Header,
  Title,
  Body,
  H3,
  Button,
  Item,
  Label,
  Form,
  Input,
} from 'native-base';
import { Text, Alert } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class OrderMeal extends Component {
  constructor(props) {
    super(props);
    this.orderMeal = this.orderMeal.bind(this);
    this.state = {
      contact: '',
      meal: this.props.meal.id,
      location: '',
      quantity: 1,
      user: this.props.store.userData.id,
      restaurant: this.props.restaurant_id,
      delivered: false,
      accepted: false,
    };
  }
  orderMeal() {
    const {contact, location} = this.state;
    if (contact == '' || location == '') {
      Alert.alert('Error', 'Please fill contacts and location');
    }
    else {
      this.props.store.orderMeal(this.state).then(() => {
        Alert.alert('Status', 'Your order has been sent for review', [
          {text: 'OK', onPress: () => Actions.restaurants({type: ActionConst.REPLACE})},
        ]);
      });
    }
  }
  render() {
    const meal = this.props.meal;
    return (
      <Content>
        <H3 style={{marginTop: 10, alignSelf: 'center'}}>Ordering: {meal.name}</H3>
        <Form style={{marginRight: 10, marginLeft: 10}}>
          <Item floatingLabel>
              <Label>Quantity</Label>
              <Input keyboardType='numeric' value={this.state.quantity} onChangeText={(text) => this.setState({quantity: !text ? 1 : text})}/>
          </Item>
          <Item floatingLabel>
              <Label>Contact</Label>
              <Input onChangeText={(text) => this.setState({contact: text})}/>
          </Item>
          <Item floatingLabel>
              <Label>Location</Label>
              <Input onChangeText={(text) => this.setState({location: text})}/>
          </Item>
          <Text style={{fontSize: 18, marginLeft: 10}}>Price: {+meal.price * +this.state.quantity}</Text>
          <Button block success onPress={this.orderMeal} style={{margin: 15}}>
            <Text>Order</Text>
          </Button>
        </Form>
      </Content>
    );
  }
}

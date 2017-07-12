import {
  Item,
  Label,
  Form,
  Input,
  Button,
  Content,
} from 'native-base';
import React, { Component } from 'react';
import { Text, Picker, Alert } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { UserTypes } from './../store';

export default class SignUp extends Component {
  constructor() {
    super();
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {
      username: '',
      password: '',
      type: UserTypes.CLIENT,
    };
  }
  componentDidMount() {
    this.props.store.loadRestaurants();
  }
  handleSignUp() {
    if (this.state.username.trim() === '' || this.state.password.trim() === '') {
      Alert.alert('Warning', 'Fill all the fields please');
      return;
    }
    this.props.store.signUp(this.state).then(() => {
      Actions.login({type: ActionConst.REPLACE});
    });
  }
  render() {
    return (
      <Content>
        <Form style={{flex: 1, marginRight: 10, marginLeft: 10}}>
          <Item floatingLabel>
            <Label>Username</Label>
            <Input onChangeText={(text) => this.setState({username: text})}/>
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input onChangeText={(text) => this.setState({password: text})} secureTextEntry={true}/>
          </Item>
          <Picker selectedValue={this.state.type} onValueChange={(value) => this.setState({type: value})}>
            <Picker.Item value={UserTypes.CLIENT} label='Client' />
            <Picker.Item value={UserTypes.COURIER} label='Courier' />
            <Picker.Item value={UserTypes.RESTAURANT_OWNER} label='Restaurant owner' />
          </Picker>
          {this.state.type == UserTypes.COURIER &&
          <Picker selectedValue={this.state.restaurant} onValueChange={(value) => this.setState({restaurant: value})}>
            {this.props.store.restaurants.map((restaurant) => <Picker.Item value={restaurant.id} label={restaurant.name} />)}
          </Picker>}
          <Button block primary onPress={this.handleSignUp} style={{margin: 15}}>
            <Text>Register</Text>
          </Button>
          <Button block info transparent onPress={() => Actions.login({type: ActionConst.REPLACE})}>
            <Text>Sign in</Text>
          </Button>
        </Form>
      </Content>
    );
  }
}

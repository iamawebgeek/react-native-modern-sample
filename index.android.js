/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
} from 'react-native';
import { Container } from 'native-base';
import { Router, Scene, ActionConst } from 'react-native-mobx';
import Index from './js/components/Index';
import SignUp from './js/components/SignUp';
import Login from './js/components/Login';
import Meals from './js/components/Meals';
import StartPage from './js/components/StartPage';
import Wrapper from './js/components/Wrapper';
import OrderMeal from './js/components/OrderMeal';
import Orders from './js/components/Orders';
import NavBar from './js/components/NavBar';
import Couriers from './js/components/Couriers';
import store, { UserTypes } from './js/store';
//import scenes from '.js/scenes';
//import styles from './js/styles';

//console.disableYellowBox = true;

export default class megalosfood extends Component {
  render() {
    return (
      <Container>
        <Router store={store}>
          <Scene key='root'>
            <Scene key='noauth' hideNavBar={true}>
              <Scene key='startpage' initial={true} component={StartPage}/>
              <Scene key='login' component={Login}/>
              <Scene key='signup' component={SignUp}/>
            </Scene>
            <Scene key='auth' hideNavBar={true} component={Wrapper}>
              <Scene key='restaurants' component={Index} title='List of restaurants'/>
              <Scene key='orders' component={Orders} initial={true} title='List of orders'/>
              <Scene key='meals' component={Meals} title='List of meals'/>
              <Scene key='order' component={OrderMeal} title='Order meal'/>
              <Scene key='couriers' component={Couriers} title='List of couriers'/>
            </Scene>
          </Scene>
        </Router>
      </Container>
    );
  }
}

AppRegistry.registerComponent('megalosfood', () => megalosfood);

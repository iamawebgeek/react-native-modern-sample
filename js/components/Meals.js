import React, { Component } from 'react';
import { Content, Card, CardItem, Thumbnail, Button, Left, Right } from 'native-base';
import { Text, Image, View } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import styles from '../styles';
import { observer } from 'mobx-react';

export default @observer class Meals extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const store = this.props.store;
    const filtered = this.props.id != null ? store.restaurants.filter((restaurant) => {
      return restaurant.id == this.props.id;
    }) : [this.props.store.userRestaurant];
    const theRestaurant = filtered[0] ? filtered[0] : {};
    if (!theRestaurant.meals) {
      return <Text>No meals added for this restaurant</Text>;
    }
    const mealsIds = Object.keys(theRestaurant.meals);
    const meals = mealsIds.map(id => {
      return {...theRestaurant.meals[id], id};
    }).slice();
    return (
      <Content style={{padding: 20}}>
        {meals.map(meal => {
          return (
            <Card key={meal.id} style={{marginBottom: 15}}>
              <CardItem cardBody>
                <Image resizeMode='contain' style={{flex: 1, width: null, height: 235}} source={{uri: meal.image}}/>
              </CardItem>
              <CardItem>
                <Left>
                  <Text><Text style={{fontSize: 22, fontWeight: 'bold'}}>{meal.name}</Text>{"\n"}{meal.price}</Text>
                </Left>
                <Right>
                  <Button success onPress={() => Actions.order({meal, restaurant_id: this.props.id, type: ActionConst.REPLACE})}>
                    <Text style={styles.white}>Order</Text>
                  </Button>
                </Right>
              </CardItem>
            </Card>
          );
        })}
      </Content>
    );
  }
}

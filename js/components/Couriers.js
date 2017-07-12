import React, { Component } from 'react';
import { Content, List, ListItem, ActionSheet } from 'native-base';
import { Text } from 'react-native';
import { observer } from 'mobx-react';

export default @observer class Couriers extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.store.loadCouriers();
  }
  showActionSheet(courier) {
    ActionSheet.show({
      options: [courier.active ? 'Deactivate' : 'Activate', 'Cancel'],
      cancelButtonIndex: 1,
      title: 'Change courier status',
    },
    () => {
      this.toggleCourierStatus(courier);
    });
  }
  toggleCourierStatus(courier) {
    this.props.store.toggleCourierStatus(courier);
    courier.active = !courier.active;
    this.forceUpdate();
  }
  renderCourier(courier) {
    return (
      <ListItem onPress={() => this.showActionSheet(courier)} key={courier.id}>
        <Text style={{fontSize: 18}}>{courier.userObj != null ? courier.userObj.username : ''} {courier.active ? '(active)' : '(inactive)'}</Text>
      </ListItem>
    );
  }
  render() {
    const {store} = this.props;
    return (
      <Content style={{padding: 10}}>
        <List button dataArray={store.couriers.slice()} renderRow={courier => this.renderCourier(courier)}/>
      </Content>
    );
  }
}

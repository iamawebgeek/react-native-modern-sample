import React, { Component } from 'react';
import {
  Content,
  Spinner,
  Header,
  Left,
  Button,
  Icon,
  Body,
  Title,
  Right,
} from 'native-base';
import { observer } from 'mobx-react/custom';
import { Actions, ActionConst } from 'react-native-router-flux';

export default @observer class StartPage extends Component {
  constructor(props) {
    super(props);
  }
  onReadyStateChange() {
    Actions[this.props.store.userData !== null ? 'auth' : 'login']({type: ActionConst.REPLACE});
  }
  render() {
    if (this.props.store.appIsReady) {
      this.onReadyStateChange();
      return null;
    }
    return (
      <Content>
        <Spinner color='blue' />
      </Content>
    );
  }
}

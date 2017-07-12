import {
  Content,
  Header,
  Text,
  Title,
  Body,
  Input,
  Form,
  Item,
  Grid,
  Row,
  InputGroup,
  Icon,
  Button
} from 'native-base';
import React, { Component } from 'react';
import { View, Dimensions, Alert, Image } from 'react-native';
import styles from './../styles';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class Login extends Component {
  constructor(props) {
    super();
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      username: '',
      password: '',
    }
  }
  handleLogin() {
    this.props.store.authenticate(this.state).finally((result) => {
      if (result.status) {
        Actions.auth({type: ActionConst.REPLACE});
      }
      else {
        Alert.alert('Result', result.message || 'Could not sign in.');
      }
    }, (error) => {
      console.log(error);
    });
  }
  render() {
    const {height: screenHeight} = Dimensions.get('window');
    return (
      <Content>
        <View style={{flex: 1, height: screenHeight, justifyContent: 'center'}}>
          <Grid style={styles.loginPage}>
            <Row size={40} style={styles.loginPageLogo}>
              <Image source={require('./../../images/logo.png')}/>
            </Row>
            <Row size={60} style={styles.loginPageForm}>
              <Form style={{flex: 1, marginRight: 10, marginLeft: 10}}>
                <InputGroup underline>
                    <Icon name='person'/>
                    <Input value={this.state.username} onChangeText={(text) => this.setState({username: text})} placeholder='Username'/>
                </InputGroup>
                <InputGroup underline>
                    <Icon name='unlock'/>
                    <Input value={this.state.password} onChangeText={(text) => this.setState({password: text})} placeholder='Password' secureTextEntry={true}/>
                </InputGroup>
                <Button block light rounded onPress={this.handleLogin} style={{margin: 15}}>
                  <Text style={{color: '#719490'}}>Login</Text>
                </Button>
                <Button block light transparent onPress={() => Actions.signup({type: ActionConst.REPLACE})}>
                  <Text>Sign up</Text>
                </Button>
              </Form>
            </Row>
          </Grid>
        </View>
       </Content>
     );
  }
}

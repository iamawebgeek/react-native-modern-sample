import { action, reaction, observable, observe, computed, autorun, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import * as firebase from 'firebase';
import { AsyncStorage, NetInfo } from 'react-native';

const dbConfig = {
  apiKey: "AIzaSyAXk-tX61kYTeglKeHp1G4-WRDGi5X3fQc",
    authDomain: "megalos-food.firebaseapp.com",
    databaseURL: "https://megalos-food.firebaseio.com",
    projectId: "megalos-food",
    storageBucket: "megalos-food.appspot.com",
    messagingSenderId: "920992215520"
};
/*NetInfo.fetch().done((reach) => {
  console.log('Initial: ' + reach);
});*/
const app = firebase.initializeApp(dbConfig);
let ref = app.database().ref();

export const UserTypes = {
  RESTAURANT_OWNER: 0,
  COURIER: 1,
  CLIENT: 2,
};

@autobind
class AppStore {
  @observable restaurants = [];
  @observable userData = null;
  @observable userRestaurant = null;
  @observable appIsReady = false;
  @observable userOrders = [];
  @observable couriers = [];

  authenticate({username, password}) {
    return new Promise((resolve, reject) => {
      this.resolveUser(username, data => {
        let status = (() => {
          if (data == null) {
            return false;
          }
          if (data.password && data.password.toString() === password) {
            this.userData = data;
            AsyncStorage.setItem('@username', data.username);
            return true;
          }
          return false;
        })();
        return resolve({
          status,
          message: 'Incorrect username or password',
        });
      });
    });
  }

  extractOrders(childRef) {
    childRef.once('value').then(snapshot => {
      if (snapshot.exists()) {
        let orders = [];
        let promises = [];
        snapshot.forEach((childSnapshot) => {
          let id = childSnapshot.key;
          let order = childSnapshot.val();
          let relationPromises = [];
          order.id = id;
          relationPromises.push(ref.child(`restaurants/${order.restaurant}/meals/${order.meal}`).once('value').then(snapshot => {
            order.meal = snapshot.val();
            return order;
          }));
          relationPromises.push(ref.child(`users/${order.courier}`).once('value').then(snapshot => {
            order.courierObj = snapshot.val();
            return order;
          }));
          relationPromises.push(ref.child(`users/${order.user}`).once('value').then(snapshot => {
            order.userObj = snapshot.val();
            return order;
          }));
          promises.push(Promise.all(relationPromises).then(() => orders.push(order)));
        });
        Promise.all(promises).then((result) => this.assignOrders(orders));
      }
    });
  }

  @action toggleCourierStatus(courier) {
    ref.child(`couriers/${courier.id}`).update({active: !courier.active});
    const index = this.couriers.indexOf(courier);
    if (index > -1) {
      this.couriers[index].active = !courier.active;
    }
  }

  @action loadCouriers() {
    ref.child('couriers').orderByChild('restaurant').equalTo(this.userData.restaurant).once('value').then(snapshot => {
      let promises = [];
      let couriers = [];
      snapshot.forEach(childSnapshot => {
        let courier = childSnapshot.val();
        courier.id = childSnapshot.key;
        promises.push(ref.child(`users/${courier.user}`).once('value').then(snapshot => {
          courier.userObj = snapshot.val();
          couriers.push(courier);
          return courier;
        }));
      });
      Promise.all(promises).then(() => this.assignCouriers(couriers));
    });
  }

  @computed get activeCouriers() {
    return this.couriers.filter(courier => courier.active);
  }

  @action assignCouriers(couriers) {
    this.couriers = couriers;
  }

  @action assignOrders(orders) {
    this.userOrders.push.apply(this.userOrders, orders);
  }

  @action loadUserOrders() {
    let childKey;
    let equals = this.userData.id;
    switch (this.userData.type) {
      case UserTypes.CLIENT:
        childKey = 'user';
        break;
      case UserTypes.COURIER:
        childKey = 'courier';
        break;
      case UserTypes.RESTAURANT_OWNER:
        equals = this.userData.restaurant;
        childKey = 'restaurant';
        break;
    }
    this.extractOrders(ref.child('orders').orderByChild(childKey).equalTo(equals));
  }

  @action logout() {
    this.userData = null;
  }

  orderMeal(orderData) {
    const orderRef = ref.child('orders').push();
    return orderRef.set(orderData);
  }

  resolveUser(username, callback) {
    return ref.child('users').orderByChild('username').equalTo(username).once('value').then(snapshot => {
      let data = snapshot.val();
      let id = Object.keys(data)[0];
      if (data != null) {
        data = {
          id,
          ...data[id],
        };
      }
      callback(data);
      return data;
    }).catch(() => callback(null));
  }

  signUp(userData) {
    let promises = [];
    const userRef = ref.child('users').push().key;
    promises.push(ref.child(`users/${userRef}`).set(userData));
    if (userData.type == UserTypes.COURIER) {
      const courierRef = ref.child('couriers').push().key;
      promises.push(ref.child(`couriers/${courierRef}`).set({user: userRef, restaurant: userData.restaurant, active: false}));
    }
    return Promise.all(promises);
  }

  @action loadUserRestaurant() {
    ref.child('restaurants/' + this.userData.restaurant).once('value').then((snapshot) => {
      this.userRestaurant = {...snapshot.val(), id: snapshot.key};
    });
  }

  @action acceptOrder(order) {
    const id = order.id;
    return ref.child(`orders/${id}`).update({accepted: true, user: order.user}).then(() => {
      const orderArray = this.userOrders.filter(order => order.id == id);
      if (orderArray[0]) {
        orderArray[0].accepted = true;
        orderArray[0].user = order.user;
      }
      return true;
    });
  }

  @action deliverOrder(order) {
    order.delivered = true;
    const id = order.id;
    delete order.id;
    return ref.child(`orders/${order.id}`).update({delivered: true}).then(() => {
      const orderArray = this.userOrders.filter(order => order.id == id);
      if (orderArray[0]) {
        orderArray[0].delivered = true;
      }
    });
  }

  @action loadRestaurants() {
    ref.child('restaurants').on('value', (snapshot) => {
      this.restaurants = [];
      const restaurants = snapshot.val();
      const keys = Object.keys(restaurants);
      keys.forEach((id) => {
        this.restaurants.push({
          id, ...restaurants[id],
        });
      });
    });
  }

  @action initialize = async () => {
    try {
      let userData = null;
      const value = await AsyncStorage.getItem('@username');
      if (value != null) {
        userData = await this.resolveUser(value, () => {});
      }
      runInAction('restore auth state', () => {
        this.userData = userData;
        this.appIsReady = true;
      });
    }
    catch (e) {
      console.log(e);
      runInAction('restore auth state', () => {
        this.appIsReady = true;
      });
    }
  }

  @action addRestaurant(restaurant) {
    this.restaurants.push(restaurant);
  }

  @action addOrder(order, restaurant) {

  }
}

const store = new AppStore();
store.initialize();

export default store;

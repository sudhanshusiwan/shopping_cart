/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  Button,
  ScrollView
} from 'react-native';

import _ from 'lodash'

let product_list = {
	"SD2014-CF-P":{
		"category": "electronics",
		"name":"Nexus 6",
		"price": 3500,
		"brand": "LG",
		"sku": "SD2014-CF-P"
	},
	"SD2015-CF-P":{
		"category": "electronics",
		"name":"Apple Watch",
		"price": 6000,
		"brand":"Apple",
		"sku":"SD2015-CF-P"
	},
	"SD2016-CF-P":{
		"category": "electronics",
		"name":"Havels Switch",
		"price": 120,
		"brand":"Havels",
		"sku":"SD2016-CF-P"
	},
	"SD2017-CF-P":{
		"category": "electronics",
		"name":"Laser Mouse",
		"price": 450,
		"brand":"Logitech",
		"sku":"SD2017-CF-P"
	},
	"SD2018-CF-P":{
		"category": "electronics",
		"name":"Mini Keyboard",
		"price": 850,
		"brand":"Logitech",
		"sku":"SD2018	-CF-P"
	},
	"SD2019-CF-P":{
		"category": "clothing",
		"name":"Tracks",
		"price": 120,
		"brand":"Nike",
		"sku":"SD2019-CF-P"
	},
	"SD2020-CF-P":{
		"category": "clothing",
		"name":"Swim Suit",
		"price": 120,
		"brand":"Puma",
		"sku":"SD2020-CF-P"
	}
};

class MyScene extends Component {
    render() {
        return (
            <View>
              <Text>Current Scene: { this.props.title }</Text>
              <TouchableHighlight onPress={this.props.onForward}>
                <Text> Tap to open a new scene </Text>
              </TouchableHighlight>

              <TouchableHighlight onPress={this.props.onBack}>
                <Text>Tap me to go back</Text>
              </TouchableHighlight>
            </View>
        );
    }
}

MyScene.propTypes = {
  title: PropTypes.string.isRequired,
  onForward: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

class ProductScene extends Component{
	constructor(props) {
		super(props);
		this.state = { cart_items : [] };
		this.add_product_to_cart = this.add_product_to_cart.bind(this);
		this.remove_product_from_cart = this.remove_product_from_cart.bind(this);
	}

	add_product_to_cart(product) {
		var present_in_cart = false;

		for(var i=0; i < this.state.cart_items.length; i++){
			if(this.state.cart_items[i].sku == product.sku){
				present_in_cart = true
				this.state.cart_items[i].count = this.state.cart_items[i].count + 1
				this.state.cart_items[i].price = this.state.cart_items[i].price + product.price
			}
		}

		if(!present_in_cart){
			var new_product = _.clone(product)
			new_product.count = 1
			this.state.cart_items.push(new_product)
		}
  		this.setState({cart_items: this.state.cart_items } );
  	}

  	remove_product_from_cart(product) {
  		var cart_items = _.reject(this.state.cart_items, function(item){ return product.sku == item.sku})
  		this.setState({cart_items: cart_items});
  	}


  render(){
    return(
    	<ScrollView>
    		<ProductList product_list={product_list} add_product={this.add_product_to_cart} />
    		<Cart cart_items={this.state.cart_items} remove_product={this.remove_product_from_cart} />
    	</ScrollView>
    );
  }
}

class ProductList extends Component{
  constructor(props) {
  	super(props);
  	this.state = { product_list:props.product_list }
  }

  render(){
  	var products = []

  	for (var key in this.state.product_list) {
  		if (this.state.product_list.hasOwnProperty(key)) {
    		products.push(<Product info={ this.state.product_list[key] } add_product={ this.props.add_product } />)
  		}
	}

    return(
      <View>
        {products}
      </View>
    );
  }
}

class Product extends Component{
	constructor(props){
		super(props);
	}
  render(){
    return(
    	<View>
    		<Text> { this.props.info.category } </Text>
    		<Text> { this.props.info.name } </Text>
    		<Text> { this.props.info.price } </Text>
    		<Text> { this.props.info.brand } </Text>
    		<Button
    		    title="Add to Cart"
    		    onPress={this.props.add_product.bind(this, this.props.info)}
    		/>
    	</View>
    );
  }
}

class Cart extends Component{
  constructor(props) {
  	super(props);
  	this.state = { added_cart_items:props.cart_items }
  }

  componentWillReceiveProps(props){
     this.setState({added_cart_items: props.cart_items})
  }

  render(){
  	var cart_items = []

  	for (var i=0;i<this.state.added_cart_items.length;i++) {
    	cart_items.push(<CartItem info={ this.state.added_cart_items[i]  } remove_product={this.props.remove_product} />)
     }

    return(
      <View>
        <Text> Cart </Text>
        {cart_items}
      </View>
    );
  }
}

class CartItem extends Component{
  constructor(props) {
  	super(props);
  }
  render(){
    return(
    	<View>
    		<Text> Name: { this.props.info.name } </Text>
    		<Text> Count: { this.props.info.count } </Text>
    		<Text> Price: { this.props.info.price } </Text>
    		<Text> Brand: { this.props.info.brand } </Text>
    		<Button
    		    title="Remove from Cart"
    		    onPress={this.props.remove_product.bind(this, this.props.info)}
    		/>
    	</View>
    );
  }
}

export default class AwesomeProject extends Component {
  render() {
    return (
      <Navigator
            initialRoute={{ title: 'My Initial Scene', index: 0 }}
            renderScene={(route, navigator) => {
              return <ProductScene title={route.title}
                    onForward={ () => {
                        const nextIndex = route.index + 1;
                        navigator.push({
                          title: 'Scene ' + nextIndex,
                          index: nextIndex,
                        });
                    }}

                    onBack={() => {
                      if (route.index > 0) {
                        navigator.pop();
                      }
                    }}
              />
            }}
          />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);

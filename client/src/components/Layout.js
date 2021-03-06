import React, {Component} from 'react';
import io from 'socket.io-client';
import { USER_CONNECTED, LOGOUT } from './Events';
import LoginForm from './LoginForm';
import ChatContainer from './chats/ChatContainer';


// if on local host, connect to local host 3001 || connect to myapp heroku

let socketUrl = "";
if (window.location.hostname === "localhost") {
	socketUrl = 'http://localhost:3001/';
}else{
	socketUrl = window.location.hostname;
}

export default class Layout extends Component {
	
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	socket:null,
	  	user:null
	  };
	}

	componentWillMount() {
		this.initSocket()
	}

	/*
	*	Connect to and initializes the socket.
	*/
	initSocket = ()=>{
		const socket = io(socketUrl)

		socket.on('connect', ()=>{
			console.log("Connected");
		})
		
		this.setState({socket})
	}

	/*
	* 	Sets the user property in state 
	*	@param user {id:number, name:string}
	*/	
	setUser = (user)=>{
		const { socket } = this.state
		socket.emit(USER_CONNECTED, user);
		this.setState({user})
	}

	/*
	*	Sets the user property in state to null.
	*/
	logout = ()=>{
		const { socket } = this.state
		socket.emit(LOGOUT)
		this.setState({user:null})

	}


	render() {
		const { socket, user } = this.state
		return (
			<div className="container" style={{marginTop: "10%", minHeight: "100vh"}}>
				{
					!user ?	
					<LoginForm socket={socket} setUser={this.setUser} />
					:
					<ChatContainer socket={socket} user={user} logout={this.logout}/>
				}
			</div>
		);
	}
}

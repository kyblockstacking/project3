import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Signup from './components/Signup';
import Jumbotron from './components/Jumbotron';
import Navbar from './components/Navbar';
import Forum from './components/Forum';
import ThreadContent from './components/ThreadContent';
import Footer from './components/Footer';
import SignIn from './components/SignIn';
import Logout from './components/Logout';
import NotFound from './components/404';
import Profile from './components/Profile';
import CreateAppointment from './components/CreateAppointment';
import Layout from "./components/Layout";
import "./App.css";
// import ReplyTextbox from "./components/ReplyTextbox";
// import CreateThread from "./components/CreateThread";
import AboutUs from "./components/AboutUs";
import Topics from './components/Topics';
import AdminCategoryForm from './components/AdminCategoryForm';
import EmailMessage from './components/EmailMessage';

class App extends React.Component {
  state = {
    userData: {},
  };
  componentDidMount() {
    axios.get('/auth').then((res) => {
      this.setState({
        userData: res.data,
      });
    });
  }

  render() {
    return (
      <Router>

        <div style={{ background: "#ededed" }}>

          <Jumbotron />
          <Navbar />
          <Route exact path="/" component={this.state.userData.user ? Logout : SignIn} />

          <Switch>
            <Route exact path="/" component={Forum} />
            <Route exact path="/forum/:category" component={Topics} />
            <Route exact path="/AboutUs" component={AboutUs} />
            <Route exact path="/DeveloperLounge" component={CreateAppointment} />
            {/* <Layout exact path="/vern" title="Chat App BAby" /> */}
            <Route exact path="/mentors/chatrooms/:id" component={Layout} />
            <Route exact path="/forum/category/thread=:id" component={ThreadContent} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/api/profile/:user" component={Profile} />
            <Route exact path="/admin/categoryform" component={AdminCategoryForm} />
            <Route exact path="/emailsystem" component={EmailMessage} />
            <Route component={NotFound} />
          </Switch>

          {/* <Route exact path="/forum/Javascript/thread=1" component={ReplyTextbox} /> */}
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;

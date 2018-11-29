import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import Modal from 'react-modal';

const submittedMessage = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        color: "#2e849e",
        height: "70%",
        width: "80%"
    }
};

class EmailSystemOutbox extends Component {
    state = {
        inbox: [],
        ShowEmailModal: false,
        emailDate: "Sent on 11/30/18",
        emailSender: "From: Kaydo",
        emailTitle: "Title: Anonymous Functions",
        emailBody: "What are they? Why do we need to learn about them and who is Clark Nielson?"

    };

    componentDidMount() {
        this.retrieveEmail();
    }

    deleteEmail = (id) => {
        axios
            .delete(`/delete/email/${id}`)
            .then(response => {
                this.retrieveEmail();
            })
    }

    retrieveEmail = () => {
        const { id } = this.props.userData;
        axios
            .get(`/emailout/${id}`)
            .then((response) => {
                this.setState({ inbox: response.data });
                console.log(this.state.inbox)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleClick = (id, recipient, username, title, message, time) => {
        const { id2 } = this.props.userData;
        axios
            .put(`/email/read/${id}`)
            .then(() => {
                axios
                    .get(`/emailout/${id2}`)
                    .then((response) => {
                      
                        this.setState({ 
                            inbox: response.data, 
                            emailDate: moment(time).calendar(),  
                            emailSender: username, 
                            emailTitle: title, 
                            emailBody: message,    
                            ShowEmailModal: true });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        const sideBar = {
            height: "100vh",
            backgroundColor: "teal",
            borderRadius: "0px 30px 0px 0px",
            opacity: ".8"
        }
        const aLink = {
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            color: "white"
        }
        const emailIcon = {
            fontSize: "22px"
        }

        return (
            <div className="container-fluid" style={{ marginTop: "10%", minHeight: "100vh" }}>
                <div className="row">
                    <div className="col-lg-2" style={sideBar}>
                        <br />
                        <row style={aLink}>
                            <i class="fas fa-pen" style={emailIcon}>&nbsp;</i><a style={aLink} href="/emailsystem">Compose</a>
                        </row>
                        <br />
                        <row style={aLink}>
                            <i className="fas fa-inbox" style={emailIcon}>&nbsp;</i> <a style={aLink} href="/generalemail">Inbox</a>
                        </row>
                        <br />
                        <row style={aLink}>
                            <i className="far fa-share-square" style={emailIcon}>&nbsp;</i><a style={aLink} href="/email/outbox">Sent</a>
                        </row>
                        <br />
                        <row style={aLink}>
                            <i class="fas fa-exclamation-circle" style={emailIcon}>&nbsp;</i><a style={aLink} href="#">Spam</a>
                        </row>
                        <br />
                        <row style={aLink}>
                            <i class="fas fa-backspace" style={emailIcon}>&nbsp;</i><a style={aLink} href="#">Delete</a>
                        </row>
                        <br />
                        <row style={aLink}>
                            <i class="fas fa-trash" style={emailIcon}>&nbsp;</i><a style={aLink} href="#">Trash</a>
                        </row>
                        <br />
                    </div>
                    <Modal
                        isOpen={this.state.ShowEmailModal}
                        style={submittedMessage}>
                        <div className="container-fluid">
                            <div className="row" style={{ float: "right" }}>
                                <i  style={{ color: "red", marginLeft: "80%", fontSize: "1.5em" }}
                                    onClick={() => {
                                        this.setState({ ShowEmailModal: false })
                                    }}
                                    className="fas fa-times-circle">
                                </i>

                            </div>
                            <div className="row"
                                style={{
                                    fontSize: "1.25em",
                                    cursor: "default",
                                    padding: "0 1.5em 0 1.5em"
                                }}
                            >
                                {this.state.emailDate}
                                <br />
                                {this.state.emailSender}
                                <br />
                                {this.state.emailTitle}
                                <br />
                                {this.state.emailBody}
                            </div>
                        </div>

                    </Modal>
                    <div className="col-lg-10 mainEmail">
                        {this.state.inbox.map(item => {
                            return (
                                <div>
                                    {item.userRead === false ?
                                        <div className="row emailRow" onClick={() => this.handleClick(item.id, item.recipient, item.User.username, item.title, item.message, item.createdAt)}>
                                            <div className="col-lg-1">
                                                <input type="checkbox" />
                                            </div>
                                            <div className="col-lg-2" style={{ fontWeight: 'bold' }}>
                                                {item.User.userName}
                                            </div>
                                            <div className="col-lg-7 emailContent" style={{ fontWeight: 'bold' }}>
                                                {item.title}
                                                : &nbsp;
                                                {item.message}
                                            </div>
                                            <div className="col-lg-2" style={{ fontWeight: 'bold' }}>
                                                {moment(item.createdAt).calendar()}
                                            </div>
                                        </div>
                                        :
                                        <div className="row emailRow" onClick={() => this.handleClick(item.id, item.recipient, item.User.username, item.title, item.message, item.createdAt)}>
                                            <div className="col-lg-1">
                                                <input type="checkbox" />
                                            </div>
                                            <div className="col-lg-2">
                                                {item.recipient}
                                            </div>
                                            <div className="col-lg-7 emailContent">
                                                {item.title}
                                                : &nbsp;
                                                {item.message}
                                            </div>
                                            <div className="col-lg-2">
                                                {moment(item.createdAt).calendar()}
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                        })
                        }
                    </div>
                </div>

            </div>
        )
    }
}

export default EmailSystemOutbox;
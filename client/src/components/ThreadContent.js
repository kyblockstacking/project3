import React from "react";
import { Link } from "react-router-dom";
import ReplyTextbox from "../components/ReplyTextbox";
import axios from "axios";
import moment from "moment";

class ThreadContent extends React.Component {
    state = {
        content: [],
        user: "",
        title: "",
        body: "",
        time: ""
    };

    componentDidMount() {
        this.getContent();
    }

    getContent = () => {
        axios.get(`/api/threads/${this.props.match.params.id}`).then(res => {
            axios.get(`/mainTopicDiscussion/${this.props.match.params.id}`).then((data) => {
                this.setState({
                    content: res.data,
                    user: data.data.User.userName,
                    title: data.data.threadName,
                    body: data.data.threadSummary,
                    time: data.data.createdAt
                })
            })
        });
    }

    threadContRefresh = (id) => {
        axios.get(`/api/threads/${id}`).then(res => {
            axios.get(`/mainTopicDiscussion/${id}`).then((data) => {
                this.setState({
                    content: res.data,
                    user: data.data.User.userName,
                    title: data.data.threadName,
                    body: data.data.threadSummary,
                    time: data.data.createdAt
                })
            })
        });
    }

    upVote = (item) => {
        let info = {
            commentId: item.id,
            userId: this.props.userData.id
        }
        let upVoteData = {
            id: item.id,
            newUpVoteCount: item.upvotes + 1,
            userId: item.UserId,
            upvote: item.User.upvote
        }
        axios.put('/checkvote', info).then(res => {
            if (res.data === null) {
                axios.post('/createvote', info).then(res => {
                    axios.put("/api/upvote", upVoteData).then(res => {
                        this.getContent();
                    })
                })
            }
            else if (res.data.downvoteBtns === true) {
                axios.put('/neutralizevote', info).then(res => {
                    axios.put("/api/upvote", upVoteData).then(res => {
                        this.getContent();
                    })
                })
            }
            else if (res.data.upvoteBtn === true) {
            }
            else {
                axios.put('/increasevote', info).then(res => {
                    axios.put("/api/upvote", upVoteData).then(res => {
                        this.getContent();
                    })
                })
            }
        })


    }

    downVote = (item) => {
        let info = {
            commentId: item.id,
            userId: this.props.userData.id
        }

        let downVoteData = {
            id: item.id,
            newDownVoteCount: item.downvotes + 1,
            userId: item.UserId,
            downvote: item.User.downvote
        }

        axios.put('/checkvote', info).then(res => {
            if (res.data === null) {
                axios.post('/createvote2', info).then(res => {
                    axios.put("/api/downvote", downVoteData).then(res => {
                        console.log("0")

                        this.getContent();
                    })
                })
            }
            else if (res.data.upvoteBtn === true) {
                axios.put('/neutralizevote', info).then(res => {
                    axios.put("/api/downvote", downVoteData).then(res => {
                        console.log("1")

                        this.getContent();
                    })
                })
            }
            else if (res.data.downvoteBtns === true) {
                console.log("2")

            }
            else {
                console.log("3")
                axios.put('/decreasevote', info).then(res => {
                    axios.put("/api/downvote", downVoteData).then(res => {
                        this.getContent();
                    })
                })
            }
        })
    }

    totalVotes = (item) => {
        return (item.upvotes - item.downvotes);
    }

    threadContent = () => {
        let { content } = this.state;
        let filteredArr = content.filter(item => {
            return (item.id);
        })
        let thread = filteredArr.map(item => {
            return (
                <div key={item.id}>

                    <button className="btn btn-primary row" onClick={() => this.upVote(item)} disabled={!this.props.authenticated}><i className="far fa-thumbs-up"></i></button>
                    <div className="row">
                        {this.totalVotes(item)}
                        <p style={{ margin: "0 0 0 1.5em", fontSize: "1em", color: "lightgray" }}>
                            <Link to={`/api/profile/${item.User.userName}`}>{item.User.userName}</Link>
                        </p>
                    </div>
                    <button className="btn btn-primary active row" onClick={() => this.downVote(item)} disabled={!this.props.authenticated}><i className="far fa-thumbs-down"></i></button>

                    <p className="col-lg-11" style={{ fontSize: "1em", paddingLeft: "2em" }}>
                        {item.replies}
                    </p>
                    <br></br>
                    <div style={{ fontSize: "0.75em", color: "lightgray" }}>
                        <i className="far fa-clipboard"></i>&nbsp;Posted:&nbsp;{moment(item.createdAt).fromNow()}
                    </div>
                    <hr></hr>
                </div>
            )
        })
        return thread;
    }

    render() {
        return (
            <div style={{ margin: "10% 8em 1em 8em", minHeight: "100vh" }}>
                <div style={{ padding: "1em 2.5em 1em 2.5em" }}>
                    <span style={{ fontSize: "0.75em", color: "lightgray", padding: "1em 0 1em 0" }}><i className="far fa-clipboard">&nbsp;</i>Posted By: <Link to={`/api/profile/${this.state.user}`}>{this.state.user}</Link> {moment(this.state.time).fromNow()}</span>
                    <div>
                        <span style={{ padding: "0.5em 0 0.5em 0", fontSize: "2em" }}>{this.state.title}</span>
                        <br></br>
                        <span style={{ padding: "1em 0 1em 0", fontSize: "1em" }}>{this.state.body}</span>
                    </div>
                    <div style={{ fontSize: "0.75em", color: "gray", padding: "0.5em 0 0.5em 0" }}>
                        <i className="far fa-share-square"></i>&nbsp;Share&nbsp;&nbsp;<i className="far fa-flag"></i>&nbsp;Report
                    </div>
                    <ReplyTextbox authenticated={this.props.authenticated} userData={this.props.userData} threadId={this.props.match.params.id} threadContRefresh={this.threadContRefresh} />
                    <br></br>
                </div>
                <hr></hr>

                {this.threadContent()}
            </div>
        );
    }
}

export default ThreadContent;
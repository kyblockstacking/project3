import React from "react";

export default class LandingPage extends React.Component {
    state = {
        stickyNavbar: {
            color: "white",
            fontSize: "1.5em",
            padding: "0.5em 0 0.5em 5%",
            background: "",
            position: "",
            top: "0",
            zIndex: "100"
        },
        navbarClass: "",
        arrowClass: "fas fa-chevron-down fadeInDown infinite animated",
        aboutMeAiden: "card col-lg-4",
        aboutMeKevin: "card col-lg-4",
        aboutMeVernie: "card col-lg-4",
        card: {
            height: "100%",
            width: "75px",
            visibility: "hidden"
        },
        page: ""
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        console.log(window.innerHeight)
        console.log(window.scrollY)
        if (window.innerHeight * window.scrollY > 0) {
            this.setState({
                stickyNavbar: {
                    color: "white",
                    fontSize: "1em",
                    padding: "0.5em 0 0.5em 5%",
                    background: "teal",
                    position: "fixed",
                    top: "0",
                    width: "100%",
                    zIndex: "100"
                },
                navbarClass: "animated fadeIn"
            })
            if (window.scrollY > 380) {
                this.setState({
                    aboutMeAiden: "card animated bounceInLeft col-lg-4",
                    aboutMeKevin: "card animated bounceInUp col-lg-4",
                    aboutMeVernie: "card animated bounceInDown col-lg-4",
                    card: {
                        height: "400px",
                        width: "75px",
                        visibility: "visible"
                    },
                    page: "animated fadeOut"
                })
            }
            else if (window.scrollY < 425) {
                this.setState({
                    aboutMeAiden: "card animated bounceOutLeft col-lg-4",
                    aboutMeKevin: "card animated bounceOutDown col-lg-4",
                    aboutMeVernie: "card animated bounceOutUp col-lg-4",
                    page: "animated fadeIn"
                })
            }
        }
        else if (window.innerHeight * window.scrollY === 0) {
            this.setState({
                stickyNavbar: {
                    color: "white",
                    fontSize: "1em",
                    padding: "0.5em 0 0.5em 5%",
                    background: "teal",
                    position: "",
                    top: "0",
                    width: "100%",
                    zIndex: "100"
                },
                navbarClass: "animated fadeOut",
            })
        }
    }


    render() {
        return (
            <div style={{ width: "100%" }} className="wrapper">
                <div className={this.state.page} style={{
                    height: "100%",
                    width: "100%",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: "url('/images/background.jpg')",
                    marginBottom: "3em"
                }}>
                    <div style={this.state.stickyNavbar} className={this.state.navbarClass}>
                        <i className="fas fa-bed" />&nbsp;Threader<sup>&nbsp;Z<sup>&nbsp;Z<sup>&nbsp;Z</sup></sup></sup>
                    </div>

                    <div
                        style={{
                            fontSize: "4em",
                            color: "white",
                            textAlign: "center",
                            margin: "0",
                            padding: "20vh 0 0 0"
                        }}>
                        <strong>PROJECT THREADER<sup>&nbsp;Z<sup>&nbsp;Z<sup>&nbsp;Z</sup></sup></sup></strong>
                        <br />
                        <div style={{
                            fontSize: "0.3em",
                        }}>JOIN THE FASTEST GROWING ONLINE COMMUNITY FOR CODING
                    </div>
                        <div style={{
                            fontSize: "0.25em",
                            margin: "5% 0 0 0"
                        }}>
                            Discover coders like you that are getting the support they seek by being involved in our community
                    </div>
                        <div style={{
                            fontSize: "0.5em",
                            padding: "1.5em 0 0.5em 0"
                        }}>Meet the team!</div>
                        <i style={{
                            fontSize: "0.5em",
                            padding: "0.75em 0 0.4em 0",
                        }} className={this.state.arrowClass}></i>
                    </div>
                </div>

                <div className="row container" style={{ margin: "0 auto", width: "100%" }}>

                    <div className={this.state.aboutMeAiden} style={this.state.card}>
                        <img className="card-img-top" src="/images/python_logo.jpg" alt="Profile" />
                        <div className="card-body">
                            <h5 className="card-title">Aiden</h5>
                            <a href="https://github.com/ironaidan" className="btn btn-primary">Github Profile</a>
                        </div>
                    </div>

                    <br />

                    <div className={this.state.aboutMeKevin} style={this.state.card}>
                        <img className="card-img-top" src="/images/python_logo.jpg" alt="Profile" />
                        <div className="card-body">
                            <h5 className="card-title">Kevin</h5>
                            <a href="https://github.com/kyblockstacking" className="btn btn-primary">Github Profile</a>
                        </div>
                    </div>

                    <br />

                    <div className={this.state.aboutMeVernie} style={this.state.card}>
                        <img className="card-img-top" src="/images/python_logo.jpg" alt="Profile" />
                        <div className="card-body">
                            <h5 className="card-title">Vernie</h5>
                            <a href="https://github.com/vedelacruz" className="btn btn-primary">Github Profile</a>
                        </div>
                    </div>

                </div>

                <br />
                <br />
                <br />

            </div>
        );
    };
};
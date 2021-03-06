import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./codeBlock.css";
import Modal from 'react-modal';
import axios from "axios";

const submittedMessage = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        color: "teal"
    }
};

class CreateAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            text: "",
            showModal: false,
            ShowRequestModal: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.updateInput = this.updateInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal(e) {
        e.preventDefault();
        this.setState({ showModal: true });
    }
    handleCloseModal() {
        this.setState({ showModal: false });
    }
    updateInput(event) {
        this.setState({ title: event.target.value })
    }
    handleChange(value) {
        this.setState({ text: value })
        // this.props.onChange(this.state.text)
    }
    modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }, { 'align': 'center' }],
            ['link', 'image', 'video', 'code-block'],
        ],
    }
    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'align',
        'link', 'image', 'video', 'code-block'
    ]

    handleSubmit(e) {
        e.preventDefault();
        // On submit of the form, send a POST request with the data to the server.
        let createRequest = {
            title: this.state.title,
            body: this.state.text.replace("<p>", "").replace("</p>", ""),
            UserId: this.props.userData.id
        }

        axios.post('/requestMentor', createRequest)
            .then(function (response) {
                return response
            }).then(() => {
                this.handleCloseModal();
            }).then(() => {
                this.props.renderMentorshipPost();
            }).then(() => {
                setTimeout(this.delayModal, 200)
            });


    }

    delayModal = () => {
        this.setState({
            ShowRequestModal: true
        })
    }

    render() {
        let disableButton = false
        if (this.state.title === "") {
            disableButton = true
        }
        return (
            <div>
                <div style={{ borderRadius: "10px", padding: '5px', background: 'teal', color: 'white', width: "60%", marginRight: "auto", marginLeft: "auto", marginBottom: "1em", textAlign: "center" }}><i className="fas fa-chalkboard-teacher">&nbsp;&nbsp;</i>Developer Classes</div>
                <form>
                    <div className="text-editor" style={{ marginBottom: "1em", marginLeft: "43%" }}>
                        <span style={{ background: "white", color: "teal", padding: "6px 30px 6px 30px", borderRadius: "10px", cursor: "pointer", border: "2px solid teal" }} onClick={this.handleOpenModal}>Request Mentorship</span>
                        <Modal
                            isOpen={this.state.showModal}
                            contentLabel="Minimal Modal Example">
                            <i style={{ color: "red", marginLeft: "80%", fontSize: "1.5em" }} onClick={this.handleCloseModal} className="fas fa-times-circle"></i>
                            <div style={{ marginLeft: "33%", fontSize: "2em" }}>
                                Request Mentorship
                            </div>
                            <br></br>
                            <form>
                                <input style={{ width: "60%", marginLeft: "20%" }} type="text" placeholder=" Request Topic" onChange={this.updateInput}></input>
                            </form>
                            <br></br>
                            <ReactQuill
                                placeholder="Description text (optional)&#10;Remember to state your preferred time! (recommended)"
                                style={{ width: "60%", height: "60%", margin: "0 auto" }}
                                value={this.state.text}
                                theme="snow"
                                modules={this.modules}
                                formats={this.formats}
                                onChange={this.handleChange}>
                            </ReactQuill>
                            <div>
                                <button style={{ background: "teal", color: "white", borderRadius: "10px", width: "60%", marginLeft: "20%", marginTop: "5%", position: "relative" }} type="submit" onClick={this.handleSubmit} disabled={disableButton}>Request</button>
                            </div>
                        </Modal>

                        <Modal
                            isOpen={this.state.ShowRequestModal}
                            style={submittedMessage}>
                            <span
                                style={{
                                    fontSize: "1.25em",
                                    cursor: "default"
                                }}
                            >Request posted&nbsp;<i className="fas fa-pray"></i></span>
                            <hr></hr>
                            <span
                                style={{
                                    border: "2px solid teal",
                                    float: "right",
                                    borderRadius: "5px",
                                    fontSize: "0.85em",
                                    padding: "0.25em 0.5em 0.25em 0.5em",
                                    cursor: "pointer"
                                }}
                                onClick={() => {
                                    this.setState({ ShowRequestModal: false })
                                }}>Close</span>
                        </Modal>
                    </div>
                </form>
            </div>
        );
    }
}

export default CreateAppointment;
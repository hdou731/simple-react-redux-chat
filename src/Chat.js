import Modal from "react-bootstrap/Modal";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import './index.css'
import * as Types from './EventTypes'
import React from "react";

export default class ChatComponent extends React.Component {

    constructor(props) {
        super(props);
        this.ws = new WebSocket('ws://${window.location.hostname}:3030/');
        this.messageInput = React.createRef();
        this.channelInput = React.createRef();
        this.messagesEnd = null;
    }

    scrollToBottom () {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    componentDidMount() {
        if (this.messagesEnd != null) {
            this.scrollToBottom();
        }

        this.ws.onopen = () => {
            console.log('connected')
        };

        this.ws.onmessage = evt => {
            const data = JSON.parse(evt.data);
            if (data.type === Types.MESSAGE || data.type === Types.CHANNEL) {
                console.log("sent message");
                this.props.dispatch(data);
            }
        };

        this.ws.onclose = () => {
            console.log('disconnected');
            this.setState({
                ws: new WebSocket('ws://${window.location.hostname}:3030/'),
            })
        }
    }

    updateUser(newUser) {
        this.props.dispatch(newUser);
    }

    componentDidUpdate() {
        if (this.messagesEnd != null) {
            this.scrollToBottom();
        }
    }

    /*addMessage(messageInput) {
        let channelCopy = this.state.channelList;
        let messageHistoryCopy = channelCopy[messageInput.channelIndex].currentMessageHistory;
        channelCopy[messageInput.channelIndex].currentMessageHistory =
            [...messageHistoryCopy, messageInput];

        this.setState({
            channelList: channelCopy
        });
        this.messageInput.current.value = "";
    }*/

    sendMessage(e) {
        if (e.key === 'Enter') {
            let messageInput = {
                type: Types.MESSAGE,
                username: this.props.username,
                content: this.messageInput.current.value,
                channelIndex: this.props.store.getState().user.currChannelIndex
            };
            this.props.dispatch(messageInput);
            console.log("mw", this.props);
            this.ws.send(JSON.stringify(messageInput));
            this.messageInput.current.value = "";
        }
    }

    createChannel(e) {
        if (e.key === 'Enter') {
            const channelList = this.props.store.getState().channels;
            const newIndex = channelList ? channelList.length : 0;
            const newChannel = {
                type: Types.CHANNEL,
                name: this.channelInput.current.value,
                index: newIndex,
                currentMessageHistory: [],
            };
            this.ws.send(JSON.stringify(newChannel));
            this.props.dispatch(newChannel);
            this.inputChannelName();
            this.channelInput.current.value = "";
        }
    }

    selectChannel(e) {
        const state = this.props.store.getState().user;
        this.updateUser({
            type: Types.USER,
            username: state.username,
            currChannelIndex: e,
            showChannelInput: state.showChannelInput,
            modalShow: state.modalShow
        });
    }

    inputChannelName() {
        const state = this.props.store.getState().user;
        this.updateUser({
            type: Types.USER,
            username: state.username,
            currChannelIndex: state.currChannelIndex,
            showChannelInput: !state.showChannelInput,
            modalShow: state.modalShow
        });
    }

    render() {
        const channels = [];
        const messages = [];

        const state = this.props.store.getState();
        const channelHistRef = state.channels;
        const channelIndex = state.user.currChannelIndex;
        const showChannelInput = state.user.showChannelInput;

        for (let i = 0; i < channelHistRef.length; i++) {
            if (channelIndex === i) {
                channels.push(<ListGroupItem variant="primary" key={i}
                                             action># {channelHistRef[i].name}</ListGroupItem>)
            } else {
                channels.push(<ListGroupItem key={i} onClick={() => this.selectChannel(i)}
                                             action># {channelHistRef[i].name}</ListGroupItem>)
            }
        }
        if (channelHistRef.length > 0) {
            const msgHistRef = channelHistRef[channelIndex].currentMessageHistory;

            for (let i = 0; i < msgHistRef.length; i++) {
                const msg = msgHistRef[i];
                messages.push(<Row key={i}>
                    <div><span style={{fontWeight: "bold", marginRight: "5px"}}>{msg.username}:</span>{msg.content}
                    </div>
                </Row>)
            }
        }

        return (
            <Modal
                {...this.props}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Messages
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <Row>
                            <Col sm={3}>
                                CHANNELS
                                <ListGroup variant="flush" style={{marginTop: "20px"}}>
                                    {channels}
                                    <div>
                                        <ListGroupItem style={showChannelInput
                                            ? {border:"none", outline: "none", boxShadow: "none", color: "#AAABAD"}
                                            : {display:"none"}}>#  <input size="lg" ref={this.channelInput}
                                                style={{border:"none", outline: "none", boxShadow: "none", width:"90%"}}
                                                onKeyDown={this.createChannel.bind(this)} type="text"/></ListGroupItem>
                                        <ListGroupItem style={!showChannelInput ? {} : {display:"none"}} action onClick={() => this.inputChannelName()}>+ Add Channel</ListGroupItem>
                                    </div>
                                </ListGroup>
                            </Col>
                            <Col sm={9} style={{height: "550px",overflowY: "auto", maxHeight: "550px"}}>
                                <div style={{marginLeft: "15px", marginTop: "20px"}}>{messages}</div>
                                <div style={{ float:"left", clear: "both" }}
                                     ref={(el) => { this.messagesEnd = el; }}>
                                </div>
                            </Col>
                        </Row>

                </Modal.Body>
                <Modal.Footer>

                        <Col sm={3}>
                        </Col>
                        <Col sm={9}>
                            <input style={{width:"100%"}} ref={this.messageInput} onKeyDown={this.sendMessage.bind(this)} type="text"/>
                        </Col>

                </Modal.Footer>

            </Modal>
        );
    }
}

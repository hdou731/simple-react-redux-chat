import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import ChatComponent from './Chat';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import './App.css';
import * as Types from "./EventTypes";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const store = this.props.store;
        store.subscribe(() => this.setState(store.getState()));

        this.updateUser({
            type: Types.USER,
            username: this.props.username,
            currChannelIndex: 0,
            showChannelInput: false,
            modalShow: false
        });
        this.createChannel({
            type: Types.CHANNEL,
            name: "Home",
            index: 0,
            currentMessageHistory: [],
        });
        this.createChannel({
            type: Types.CHANNEL,
            name: "Announcements",
            index: 0,
            currentMessageHistory: [],
        });
    }

    updateUser(newUser) {
        this.props.dispatch(newUser);
    }

    createChannel(newChannel) {
        this.props.dispatch(newChannel);
    }

    setModalShow(value) {
        const state = this.props.store.getState().user;
        this.updateUser({
            type: Types.USER,
            username: state.username,
            currChannelIndex: state.currChannelIndex,
            showChannelInput: state.showChannelInput,
            modalShow: value
        });
    }

    handleChange(event) {
        if (!event || !event.target || !event.target.valueOf()) return;

        const state = this.props.store.getState().user;
        console.log(event);
        console.log(state);
        this.updateUser({
            type: Types.USER,
            username: event.target ? event.target.value : state.username,
            currChannelIndex: state.currChannelIndex,
            showChannelInput: state.showChannelInput,
            modalShow: state.modalShow
        });
    }

    render() {
        const buttonStyle = {
            justifyContent: 'center',
            marginTop: '10%'
        };

        const formStyle = {
            display: 'inline',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '15px'
        };

        const state = this.props.store.getState().user;

        return (
            <Form inline style={buttonStyle}>
                <FormControl style={formStyle} size="normal" type="text" id="username" value={state.username}
                             onChange={this.handleChange} onKeyDown={(e) => this.setModalShow(e.key === 'Enter')} placeholder="username"/>
                <Button onClick={() => this.setModalShow(true)} size="normal">start</Button>


            <ChatComponent
                dispatch={this.props.dispatch}
                store={this.props.store}
                username={state.username ? state.username : "Anonymous"}
                show={state.modalShow}
                onHide={() => this.setModalShow(false)}
            />
            </Form>
        );
    }
}

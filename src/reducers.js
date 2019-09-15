import * as Types from './EventTypes';

export function user(state = {type: Types.USER}, action) {
    if (action.type !== Types.USER) {
        return state;
    }
    return {
        type: Types.USER,
        username: action.username,
        currChannelIndex: action.currChannelIndex,
        showChannelInput: action.showChannelInput,
        modalShow: action.modalShow
    };
}

export function channels(state = [], action) {
    console.log("prev state", state);
    if (action.type === Types.CHANNEL) {
        console.log(`CHAN invoke state=`, state , "action=", action);
        const newChannel = {
            type: action.type,
            name: action.name,
            index: action.index,
            currentMessageHistory: []
        };
        return [...state, newChannel]
    } else if (action.type === Types.MESSAGE) {
        const oldMessages = state[action.channelIndex].currentMessageHistory;
        state[action.channelIndex].currentMessageHistory = [...oldMessages, action];
        return state
    } else {
        return state;
    }
}

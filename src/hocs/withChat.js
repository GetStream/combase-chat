import React from 'react';
import { useChannel } from 'stream-chat-hooks';

export default WrappedComponent => props => {
    const [state, channel] = useChannel(props.channelId);
    return <WrappedComponent {...props} {...state} {...{ channel }} />;
};

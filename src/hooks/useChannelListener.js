import { useCallback, useEffect, useState } from 'react';
import { useActiveChannel, usePrevious } from 'stream-chat-hooks';

export default (channelId, active) => {
    if (!channelId) {
        return [0, null];
    }

    const channel = useActiveChannel(channelId);
    const [unreadCount, setUnreadCount] = useState(0);
    const [latestMessage, setLatestMessage] = useState(
        channel
            ? channel.state.messages[channel.state.messages.length - 1]
            : null
    );

    const getUnreadCount = useCallback(async () => {
        let unread;
        if (channel) {
            unread = await channel.countUnread();
        } else {
            unread = 0;
        }
        setUnreadCount(active ? 0 : unread);
    }, [active, channel]);

    const handleEvent = useCallback(
        (data) => {
            getUnreadCount();
            setLatestMessage(data.message);
        },
        [getUnreadCount]
    );

    useEffect(() => {
        if (channel) {
            channel.on('message.new', handleEvent);
            return () => channel.off('message.new', handleEvent);
        }
    }, [channel, handleEvent]);

    const wasActive = usePrevious(active);

    useEffect(() => {
        if (active && !wasActive) {
            setUnreadCount(0);
        }
    }, [active, wasActive]);

    useEffect(() => {
        getUnreadCount();
    }, [getUnreadCount]);

    return [channel, unreadCount, latestMessage];
};

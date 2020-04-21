import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Animated from 'animated/lib/targets/react-dom';
import ListView from '@comba.se/ui/ListView';

// Hooks //
import useChat from './hooks/useChat';
import useLayoutProvider from './hooks/useLayoutProvider';

// Components //
import Message from './Message';

const Root = styled.div`
    flex: 1;
    height: calc(
        100% -
            ${({ inputToolbarHeight = 80, headerHeight = 64 }) =>
                inputToolbarHeight + headerHeight}px
    );
`;

const MessagesList = ({ extraData, messages: externalMessages, ...props }) => {
    const {
        loadMoreMessages,
        messages: data,
        messageContainerRef,
        partner,
        read,
        user,
    } = useChat();

    const messages = useMemo(() => externalMessages || data, [
        data,
        externalMessages,
    ]);

    const [layoutProvider, onResize, width] = useLayoutProvider(messages, user);

    const extendedState = useMemo(() => ({ messages, read, ...extraData }), [
        extraData,
        messages,
        read,
    ]);

    const renderRow = useCallback(
        (currentMessage, index) => {
            if (!currentMessage) {
                return null;
            }
            if (!currentMessage.user && !currentMessage.system) {
                console.warn('`user` is missing from message data.');
                currentMessage.user = { id: 0 };
            }
            if (messages && user) {
                const previousMessage = messages[index + 1];
                const nextMessage = messages[index - 1];
                const isOwn =
                    currentMessage.user && currentMessage.user.id === user._id;
                const messageProps = {
                    ...props,
                    user,
                    partner,
                    key: currentMessage.id,
                    currentMessage,
                    previousMessage,
                    nextMessage,
                    isRead: read.last_read >= currentMessage.created_at,
                    position: isOwn ? 'right' : 'left',
                };

                return <Message {...{ width }} {...messageProps} />;
            }

            return null;
        },
        [width, messages, read, partner, user]
    );

    const style = useMemo(
        () => ({
            height: '100%',
            transform: 'scaleY(-1)',
        }),
        []
    );

    return (
        <Root>
            <ListView
                setMessageContainerRef={messageContainerRef}
                data={messages}
                extendedState={extendedState}
                forceNonDeterministicRendering
                layoutProvider={layoutProvider}
                onEndReached={loadMoreMessages}
                onEndReachedThreshold={240}
                onResize={onResize}
                renderRow={renderRow}
                rowCount={messages ? messages.length : 0}
                style={style}
            />
        </Root>
    );
};

MessagesList.propTypes = {
    extraData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    scrollAnim: PropTypes.instanceOf(Animated.Value),
};

MessagesList.defaultProps = {
    scrollAnim: new Animated.Value(0),
};

export default MessagesList;

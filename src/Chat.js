import React, {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
} from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { useChannel } from 'stream-chat-hooks';

// Hooks //
import useAuth from 'hooks/useAuth';

// Context //
import ChatContext, { reducer } from './contexts/Chat';

// Components //
import ChatHeader from './ChatHeader';
import InputToolbar from './InputToolbar';
import MessagesList from './MessagesList';

const Root = styled.div`
    flex: 1;
`;

const MessagesWrapper = styled.div`
    height: calc(
        100vh - ${({ inputToolbarHeight }) => inputToolbarHeight + 64}px
    );
`;

// TODO: Re-add typing indicators
const initialState = {
    chatHeight: 0,
    chatWidth: 0,
    inputToolbarHeight: 0,
    text: '',
    typingDisabled: false,
};

const Chat = ({ channelId, children, onSend }) => {
    const [{ user }] = useAuth();
    const [
        { messages, typing, partner, read },
        channel,
        loadMoreMessages,
    ] = useChannel(channelId);

    const [state, dispatch] = useReducer(reducer, initialState);
    const messageContainerRef = useRef(null);
    const textInputRef = useRef(null);

    const markRead = useCallback(async () => {
        if (channel) {
            await channel.markRead();
        }
    }, [channel]);

    const showTypingIndicator = useMemo(
        () => (partner ? typing[partner.id] : false),
        [typing, partner]
    );

    const setInputToolbarHeight = useCallback(({ height }) => {
        dispatch({
            type: 'InputToolbar/SetHeight',
            height,
        });
    }, []);

    const resetInputToolbar = useCallback(() => {
        if (textInputRef.current) {
            textInputRef.current.value = '';
        }
        dispatch({
            type: 'InputToolbar/Change',
            text: '',
        });
    }, []);

    const handleInputChange = useCallback(
        text => {
            if (state.typingDisabled) {
                return;
            }
            dispatch({
                type: 'InputToolbar/Change',
                text,
            });
        },
        [state.typingDisabled]
    );

    const handleSend = useCallback(
        async (message, shouldResetInputToolbar = false) => {
            if (shouldResetInputToolbar === true) {
                dispatch({
                    type: 'InputToolbar/DisableTyping',
                    disabled: true,
                });
                resetInputToolbar();
            }

            await channel.sendMessage(message);

            if (messageContainerRef.current) {
                messageContainerRef.current.scrollToTop();
            }

            if (shouldResetInputToolbar === true) {
                setTimeout(() => {
                    dispatch({
                        type: 'InputToolbar/DisableTyping',
                        disabled: false,
                    });
                }, 100);
            }
        },
        [channel]
    );

    useEffect(() => {
        markRead();
    }, [channel.id]);

    const value = useMemo(
        () => ({
            ...state,
            channelId,
            handleInputChange,
            handleSend,
            showTypingIndicator,
            loadMoreMessages,
            messageContainerRef,
            messages,
            partner,
            read,
            setInputToolbarHeight,
            textInputRef,
            user,
        }),
        [
            channelId,
            handleInputChange,
            handleSend,
            showTypingIndicator,
            loadMoreMessages,
            messageContainerRef,
            messages,
            partner,
            setInputToolbarHeight,
            read,
            state,
            textInputRef,
            user,
        ]
    );

    return (
        <ChatContext.Provider value={value}>
            <Root>{children}</Root>
        </ChatContext.Provider>
    );
};

Chat.propTypes = {
    channelId: PropTypes.string,
};
export default withTheme(Chat);

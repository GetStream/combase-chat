import React, { useCallback, useMemo, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import uuid from 'uuid/v4';

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

// class Chat extends Component {
//     static propTypes = {
//         messages: PropTypes.array,
//         onLoadMore: PropTypes.func,
//         onSend: PropTypes.func,
//         partner: PropTypes.object,
//         placeholder: PropTypes.string,
//         showTypingIndicator: PropTypes.bool,
//         textInputProps: PropTypes.object,
//         user: PropTypes.object,
//     };

//     static defaultProps = {
//         placeholder: 'Write something...',
//         onAttachment: () => { },
//         onSend: () => { },
//     };

//     state = {
//         inputToolbarHeight: 0,
//         isMounted: false,
//         isSmall: false,
//         text: '',
//         typingDisabled: false,
//     };

//     componentDidMount() {
//         this.setState({ isMounted: true });
//     }

//     onInputTextChanged = text => {
//         const { typingDisabled } = this.state;
//         const { onInputTextChanged } = this.props;
//         if (typingDisabled) {
//             return;
//         }

//         if (onInputTextChanged) {
//             onInputTextChanged(text);
//         }

//         this.setState({
//             text,
//         });
//     };

//     onSend = (messages = [], shouldResetInputToolbar = false) => {
//         const { onSend } = this.props;
//         const { isMounted } = this.state;
//         if (!Array.isArray(messages)) {
//             messages = [messages];
//         }

//         if (shouldResetInputToolbar === true) {
//             this.setState({ typingDisabled: true });
//             this.resetInputToolbar();
//         }

//         onSend(messages);

//         if (this.messageContainerRef) {
//             this.messageContainerRef.scrollToTop();
//         }

//         if (shouldResetInputToolbar === true) {
//             setTimeout(() => {
//                 if (isMounted === true) {
//                     this.setState({ typingDisabled: false });
//                 }
//             }, 100);
//         }
//     };

//     handleResize = layout =>
//         this.setState(() => {
//             const { theme } = this.props;
//             return {
//                 isSmall: layout.width < theme.breakpoints.sm,
//             };
//         });

//     renderInputToolbar = () => {
//         const { text } = this.state;
//         const { channelId, placeholder, textInputProps } = this.props;
//         const { onInputTextChanged, onSend, uploadAttachment } = this;

//         const props = {
//             channelId,
//             text,
//             onSend,
//             onTextChanged: onInputTextChanged,
//             placeholder,
//             textInputProps: {
//                 ...textInputProps,
//                 ref: input => (this.textInput = input),
//             },
//             uploadAttachment,
//         };

//         return (
//             <InputToolbar onResize={this.setInputToolbarHeight} {...props} />
//         );
//     };

//     resetInputToolbar = () => {
//         if (this.textInput) {
//             this.textInput.value = '';
//         }
//         this.setState({
//             text: '',
//         });
//     };

//     scrollTo = (index, animated = true) => {
//         if (this.messageContainerRef !== null) {
//             this.messageContainerRef.scrollToIndex(index, animated);
//         }
//     };

//     setInputToolbarHeight = ({ height }) =>
//         this.setState({
//             inputToolbarHeight: height,
//         });

//     setMessageContainerRef = el => {
//         this.messageContainerRef = el;
//     };

//     get messages() {
//         const { messages, showTypingIndicator, partner } = this.props;
//         if (showTypingIndicator) {
//             return [
//                 {
//                     id: uuid(),
//                     created_at: new Date(),
//                     system: true,
//                     color: 'alt_text',
//                     text: `${partner.name} is typing...`,
//                 },
//                 ...messages,
//             ];
//         }
//         return messages;
//     }

//     render() {
//         const {
//             extendedState,
//             headerActions,
//             onLoadMore,
//             read,
//             partner,
//             user,
//         } = this.props;
//         const { inputToolbarHeight, isSmall } = this.state;
//         return (
//             <Root>
//                 <ChatHeader {...{ headerActions, partner }} />
//                 <MessagesWrapper {...{ inputToolbarHeight }}>
//                     <MessagesList
//                         {...{
//                             extendedState,
//                             inputToolbarHeight,
//                             isSmall,
//                             user,
//                             partner,
//                             read,
//                         }}
//                         onResize={this.handleResize}
//                         onEndReached={onLoadMore}
//                         data={this.messages}
//                         setMessageContainerRef={this.setMessageContainerRef}
//                     />
//                 </MessagesWrapper>
//                 {this.renderInputToolbar()}
//             </Root>
//         );
//     }
// }

const initialState = {
    inputToolbarHeight: 0,
    text: '',
    typingDisabled: false,
};

const Chat = ({ channelId, children, onSend, partner, read, user }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const messageContainerRef = useRef(null);
    const textInputRef = useRef(null);

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
        (messages = [], shouldResetInputToolbar = false) => {
            if (!Array.isArray(messages)) {
                messages = [messages];
            }

            if (shouldResetInputToolbar === true) {
                dispatch({
                    type: 'InputToolbar/DisableTyping',
                    disabled: true,
                });
                resetInputToolbar();
            }

            onSend(messages);

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
        [onSend]
    );

    const value = useMemo(
        () => [
            state,
            {
                channelId,
                handleInputChange,
                handleSend,
                messageContainerRef,
                read,
                setInputToolbarHeight,
                textInputRef,
            },
        ],
        [
            channelId,
            handleInputChange,
            handleSend,
            messageContainerRef,
            setInputToolbarHeight,
            read,
            state,
            textInputRef,
        ]
    );

    return (
        <ChatContext.Provider value={value}>
            <Root>{children}</Root>
        </ChatContext.Provider>
    );
};

export default withTheme(Chat);

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Animated from 'animated/lib/targets/react-dom';
import ListView from '@comba.se/ui/ListView';
import { EmptyState, Text } from '@comba.se/ui';

// Hooks //
import useChat from './hooks/useChat';
import useLayoutProvider from './hooks/useLayoutProvider';

// Components //
import Message from './Message';

// class MessagesList extends Component {
//     static propTypes = {
//         data: PropTypes.array,
//         isSmall: PropTypes.bool,
//         partner: PropTypes.object,
//         onEndReached: PropTypes.func,
//         onResize: PropTypes.func,
//         setMessageContainerRef: PropTypes.func,
//         scrollAnim: PropTypes.instanceOf(Animated.Value),
//         user: PropTypes.object,
//     };

//     static defaultProps = {
//         scrollAnim: new Animated.Value(0),
//     };

//     state = {
//         layoutProvider: LayoutUtil.getLayoutProvider(
//             0,
//             this.props.data,
//             this.props.user
//         ),
//         layout: {},
//     };

//     componentDidUpdate(prevProps, prevState) {
//         const { layout } = this.state;
//         const { data, user } = this.props;
//         if (
//             layout.width !== prevState.layout.width ||
//             data.length !== prevProps.data.length
//         ) {
//             this.setState({
//                 layoutProvider: LayoutUtil.getLayoutProvider(
//                     layout.width,
//                     data,
//                     user
//                 ),
//             });
//         }
//     }

//     onResize = layout =>
//         this.setState({ layout }, () => {
//             const { onResize } = this.props;
//             if (onResize) {
//                 onResize(layout);
//             }
//         });

//     renderRow = (currentMessage, index) => {
//         const { isSmall } = this.props;
//         const {
//             layout: { width },
//         } = this.state;
//         if (!currentMessage) {
//             return null;
//         }
//         if (!currentMessage.user && !currentMessage.system) {
//             console.warn('`user` is missing from message.');
//             currentMessage.user = { id: 0 };
//         }

//         const { data, user, partner, read, ...rest } = this.props;

//         if (data && user) {
//             const previousMessage = data[index + 1];
//             const nextMessage = data[index - 1];
//             const isOwn =
//                 currentMessage.user && currentMessage.user.id === user._id;
//             const messageProps = {
//                 ...rest,
//                 isSmall,
//                 user,
//                 partner,
//                 key: currentMessage.id,
//                 currentMessage,
//                 previousMessage,
//                 nextMessage,
//                 isRead: read.last_read >= currentMessage.created_at,
//                 position: isOwn ? 'right' : 'left',
//             };
//             return <Message {...{ width }} {...messageProps} />;
//         }

//         return null;
//     };

//     get style() {
//         return {
//             flex: 1,
//             transform: 'scaleY(-1)',
//         };
//     }

//     render() {
//         const {
//             data,
//             extendedState = {},
//             onEndReached,
//             scrollAnim,
//             setMessageContainerRef,
//             read,
//         } = this.props;
//         const { layoutProvider } = this.state;
//         const { onResize, renderRow, style } = this;
//         return (
//             <ListView
//                 {...{
//                     data,
//                     layoutProvider,
//                     renderRow,
//                     onResize,
//                     scrollAnim,
//                     setMessageContainerRef,
//                     style,
//                 }}
//                 extendedState={{ data, read, ...extendedState }}
//                 forceNonDeterministicRendering
//                 onEndReached={onEndReached}
//                 onEndReachedThreshold={240}
//                 rowCount={data.length}
//             />
//         );
//     }
// }

const MessagesList = ({ extraData, onEndReached, ...props }) => {
    const {
        messages: data,
        messageContainerRef,
        partner,
        read,
        user,
    } = useChat();
    const [layoutProvider, onResize, width] = useLayoutProvider(data, user);
    const extendedState = useMemo(() => ({ data, read, ...extraData }), [
        data,
        extraData,
        read,
    ]);

    const renderRow = useCallback(
        (currentMessage, index) => {
            if (!currentMessage) {
                return null;
            }
            if (!currentMessage.user && !currentMessage.system) {
                console.warn('`user` is missing from message.');
                currentMessage.user = { id: 0 };
            }

            if (data && user) {
                const previousMessage = data[index + 1];
                const nextMessage = data[index - 1];
                const isOwn =
                    currentMessage.user && currentMessage.user.id === user._id;
                const messageProps = {
                    ...props,
                    // isSmall,
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
        [width]
    );

    const style = useMemo(
        () => ({
            flex: 1,
            transform: 'scaleY(-1)',
        }),
        []
    );

    return (
        <div style={{ flex: 1 }}>
            <ListView
                setMessageContainerRef={messageContainerRef}
                data={data}
                extendedState={extendedState}
                forceNonDeterministicRendering
                layoutProvider={layoutProvider}
                onEndReached={onEndReached}
                onEndReachedThreshold={240}
                onResize={onResize}
                renderRow={renderRow}
                rowCount={data ? data.length : 0}
                style={style}
            />
        </div>
    );
};

MessagesList.propTypes = {
    extraData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onEndReached: PropTypes.func,
    setMessageContainerRef: PropTypes.func,
    scrollAnim: PropTypes.instanceOf(Animated.Value),
};

MessagesList.defaultProps = {
    scrollAnim: new Animated.Value(0),
};

export default MessagesList;

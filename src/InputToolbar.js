import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Container } from '@comba.se/ui';
import { useMedia } from '@comba.se/ui/hooks';

// Hooks //
import useChat from './hooks/useChat';
import useLayout from './hooks/useLayout';

// Components //
import Actions from './Actions';
import Composer from './Composer';
import SendButton from './SendButton';
import useUploadAttachments from 'stream-chat-hooks/useUploadAttachments';

const Root = styled(Container)`
    flex-direction: row;
    align-items: center;
    min-height: 80px;
    padding-top: 16px;
    padding-bottom: 16px;
    border-top: 1px solid ${({ theme }) => theme.color.border};
    ${({ isMobile }) =>
        !isMobile
            ? `
        padding-right: 88px; 
    `
            : null}
`;

const InputToolbar = ({ placeholder }) => {
    const {
        channelId,
        handleSend,
        handleInputChange,
        inputRef,
        setInputToolbarHeight,
        text,
    } = useChat();

    const isMobile = useMedia('sm');

    const [layout, setRef] = useLayout();

    useEffect(() => {
        if (layout) {
            setInputToolbarHeight(layout.height);
        }
    }, [layout]);
    const [
        attachments,
        { uploadAttachment, deleteAttachment, clearAttachments },
    ] = useUploadAttachments(channelId);

    const onSend = useCallback(
        (data, clear) => {
            handleSend(data, clear);
            clearAttachments();
        },
        [clearAttachments, handleSend]
    );

    return (
        <Root ref={setRef} maxWidth={840} isMobile={isMobile}>
            <Actions onAttachment={uploadAttachment} />
            <Composer
                attachments={attachments}
                deleteAttachment={deleteAttachment}
                inputRef={inputRef}
                onTextChanged={handleInputChange}
                text={text}
                onSend={onSend}
                placeholder={placeholder}
            />
            <SendButton onSend={handleSend} text={text} />
        </Root>
    );
};

InputToolbar.propTypes = {
    inputProps: PropTypes.object,
    onResize: PropTypes.func,
    placeholder: PropTypes.string,
};

InputToolbar.defaultProps = {
    placeholder: 'Type a message',
};

export default InputToolbar;

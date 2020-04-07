import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Container } from '@comba.se/ui';

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
    @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
        padding-right: 88px;
    }
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
    console.log('render input toolbar');
    // const [layout, setRef] = useLayout(setInputToolbarHeight);

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
        <Root maxWidth={840}>
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

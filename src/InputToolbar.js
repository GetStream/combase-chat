import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Container } from '@comba.se/ui';

// HOCs //
import withLayout from 'hocs/withLayout';

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

const InputToolbar = ({
    channelId,
    onSend: handleSend,
    onTextChanged,
    placeholder,
    setRef,
    text,
    textInputProps,
}) => {
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
        <Root ref={setRef} maxWidth={840}>
            <Actions onAttachment={uploadAttachment} />
            <Composer
                {...{
                    attachments,
                    deleteAttachment,
                    onSend,
                    onTextChanged,
                    placeholder,
                    text,
                    textInputProps,
                }}
            />
            <SendButton {...{ onSend, text }} />
        </Root>
    );
};

export default withLayout(InputToolbar);

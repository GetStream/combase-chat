import React, { useCallback } from 'react';
import styled from 'styled-components';
import { AutosizeTextArea, Text } from '@comba.se/ui';

// Components //
import AttachmentCard from './AttachmentCard';

const Root = styled.div`
    flex: 1;
`;

const Input = styled(AutosizeTextArea)`
    width: 100%;
    resize: none;
    margin-right: 16px;
    font-size: 16px;
    line-height: 20px;
    outline: none;
    color: ${({ theme }) => theme.color.alt_text};
    font-weight: 500;
    max-height: 144px;

    &::-webkit-input-placeholder {
        color: ${({ theme }) =>
        theme.colorUtils.fade(theme.color.alt_text, 0.56)};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
        margin-right: 0;
        max-height: 288px;
    }
`;

const Attachments = styled.div`
    margin-top: 16px;
    & > div {
        margin-top: 8px;
        flex-direction: row;

        & ${AttachmentCard} + ${AttachmentCard} {
            margin-left: 16px;
        }
    }
`;

const renderAttachments = (attachments, deleteAttachment) =>
    attachments.map((data, index) => (
        <AttachmentCard {...data} {...{ index }} onDelete={deleteAttachment} />
    ));

const Composer = ({
    attachments,
    deleteAttachment,
    inputRef,
    onTextChanged,
    onSend,
    placeholder,
    text,
}) => {
    const onKeyDown = useCallback(
        (e) => {
            if (e.keyCode === 13 && !e.shiftKey) {
                e.preventDefault()
                if (text) {
                    onSend({ text: text.trim(), attachments }, true);
                }
            }
            return false;
        },
        [attachments, text, onSend]
    );

    const handleChange = useCallback(
        ({ target: { value } }) => {
            onTextChanged(value);
        },
        [onTextChanged]
    );

    return (
        <Root>
            <Input
                rows={1}
                onChange={handleChange}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                value={text}
                ref={inputRef}
            />
            {attachments.length ? (
                <Attachments>
                    <Text faded size={12} weight="500">
                        Attachments
                    </Text>
                    <div>
                        {renderAttachments(attachments, deleteAttachment)}
                    </div>
                </Attachments>
            ) : null}
        </Root>
    );
};

export default Composer;

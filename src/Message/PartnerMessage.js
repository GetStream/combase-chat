import React, { memo } from 'react';
import styled from 'styled-components';
import { Avatar, Text } from '@comba.se/ui';

// HOCs //
import asMessage from '../hocs/asMessage';

// Components //
import MessageAttachment from './MessageAttachment';

const Root = styled.div`
    flex-direction: row;
    z-index: 0;
`;

const AvatarWrapper = styled.div`
    justify-content: flex-end;
    align-items: flex-end;
    width: 58px;
`;

const AvatarBubble = styled.div`
    width: ${({ size }) => size + 10}px;
    height: ${({ size }) => size + 10}px;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    bottom: -4px;
    right: -4px;
    background-color: ${({ theme }) => theme.color.surface};
    z-index: 2;
`;

const BubbleWrap = styled.div`
    align-items: flex-start;
`;

const Bubble = styled.div`
    padding: 20px;
    background-color: ${({ theme }) => theme.color.primary};
    border: 1px solid ${({ theme }) => theme.color.primary};
    border-top-left-radius: ${({ hasPrev, theme }) =>
        hasPrev ? theme.borderRadius : theme.borderRadius * 2}px;
    border-top-right-radius: ${({ theme }) => theme.borderRadius * 2}px;
    border-bottom-left-radius: ${({ showAvatar, hasNext, theme }) =>
        showAvatar
            ? 0
            : hasNext
            ? theme.borderRadius
            : theme.borderRadius * 2}px;
    border-bottom-right-radius: ${({ theme }) => theme.borderRadius * 2}px;
    margin-right: 24px;
    margin-left: ${({ showAvatar }) => (showAvatar ? 0 : 56)}px;
    & > ${Text} {
        word-break: keep-all;
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
        margin-right: 160px;
    }

    ${({ showAvatar, theme }) =>
        showAvatar
            ? `

        &::before {
            position: absolute;
            bottom: -1px;
            left: -20px;
            z-index: 0;
            content: '';
            width: 0;
            height: 0;
            border-top: 32px solid transparent;
            border-bottom: 0px solid transparent;
            border-right: 20px solid ${theme.color.primary};
        }

    `
            : null}
`;

const renderAttachments = (attachments, hasNext, hasPrev) =>
    attachments.map(attachment => (
        <MessageAttachment
            {...{ hasNext, hasPrev }}
            {...attachment}
            isOwn={false}
        />
    ));

const PartnerMessage = memo(
    ({ currentMessage: { attachments, text, user }, hasNext, hasPrev }) => {
        const showAvatar = (hasPrev && !hasNext) || (!hasPrev && !hasNext);
        return (
            <Root>
                <AvatarWrapper>
                    {showAvatar ? (
                        <AvatarBubble size={48}>
                            <Avatar
                                showStatus={false}
                                name={user.name}
                                src={user.avatar}
                                size={48}
                            />
                        </AvatarBubble>
                    ) : null}
                </AvatarWrapper>
                <BubbleWrap>
                    {attachments.length
                        ? renderAttachments(attachments, hasNext, hasPrev)
                        : null}
                    <Bubble {...{ hasNext, hasPrev, showAvatar }}>
                        <Text line={24} color="white">
                            {text}
                        </Text>
                    </Bubble>
                </BubbleWrap>
            </Root>
        );
    }
);

export default asMessage(PartnerMessage);

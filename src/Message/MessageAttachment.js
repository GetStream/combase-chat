import React from 'react';
import styled from 'styled-components';

// Components //
const Root = styled.div`
    background-color: ${({ theme }) => theme.color.surface};
    border: 1px solid ${({ theme }) => theme.color.border};
    border-top-left-radius: ${({ isOwn, theme }) =>
        !isOwn ? theme.borderRadius : theme.borderRadius * 2}px;
    border-top-right-radius: ${({ isOwn, theme }) =>
        !isOwn ? theme.borderRadius : theme.borderRadius * 2}px;
    border-bottom-left-radius: ${({ isOwn, theme }) =>
        !isOwn ? theme.borderRadius : theme.borderRadius * 2}px;
    border-bottom-right-radius: ${({ isOwn, theme }) =>
        !isOwn ? theme.borderRadius * 2 : theme.borderRadius}px;
    max-width: 400px;
    overflow: hidden;
    margin: ${({ isOwn }) => (isOwn ? '0px 0px 0px 24px' : '0px 24px 0px 0px')};
    & > img {
        width: 100%;
    }
`;

const MessageAttachment = ({ asset_url, hasNext, hasPrev, isOwn }) => (
    <Root {...{ hasNext, hasPrev, isOwn }}>
        <img src={asset_url} alt="attachment" />
    </Root>
);

export default MessageAttachment;

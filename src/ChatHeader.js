import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { ActionsGroup, Avatar, IconButton, Text } from '@comba.se/ui';
import { ArrowBackIcon } from '@comba.se/ui/Icons';

// Components //
const Root = styled.div`
    flex: 0 0 64px;
    padding: 0px 16px;
    flex-direction: row;
    align-items: center;
    background-color: ${({ theme }) => theme.color.surface};
    border-bottom: 1px solid ${({ theme }) => theme.color.border};
    @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
        padding: 0px 24px;
        justify-content: space-between;
    }
`;

const Main = styled.div`
    flex-direction: row;
    align-items: center;
`;

const UserWrapper = styled.div`
    margin-left: 8px;
    flex-direction: row;
    align-items: center;

    @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
        margin-left: 16px;
    }
`;

const Content = styled.div`
    margin-left: 12px;
`;

const Actions = styled(ActionsGroup)`
    display: none;

    @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
        display: flex;
    }
`;

const ChatHeader = ({ headerActions, onBackClick, partner }) => (
    <Root>
        <Main>
            <IconButton
                icon={ArrowBackIcon}
                color="text"
                onClick={onBackClick}
            />
            <UserWrapper>
                <Avatar
                    src={partner.avatar}
                    name={partner.name}
                    size={32}
                    showStatus={partner.online}
                    status={partner.online ? 'online' : 'offline'}
                />
                <Content>
                    <Text weight="500">{partner.name}</Text>
                    <Text size={12} faded>
                        {partner.online
                            ? 'Active Now'
                            : partner.last_active
                            ? `Last active: ${moment(
                                  partner.last_active
                              ).fromNow()}`
                            : 'Offline'}
                    </Text>
                </Content>
            </UserWrapper>
        </Main>
        <Actions>{headerActions}</Actions>
    </Root>
);

export default ChatHeader;

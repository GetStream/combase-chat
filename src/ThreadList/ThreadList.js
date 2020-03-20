import React, { useCallback, useEffect, useState } from 'react';
import ListView, { ContextHelper } from '@comba.se/ui/ListView';
import { EmptyState, IconButton, ListHeader } from '@comba.se/ui';
import { ArchiveIcon, FilterIcon, InboxIcon } from '@comba.se/ui/Icons';

// Utils //
import LayoutUtil from './LayoutUtil';

// Components //
import ThreadItem from './ThreadItem';

const initialState = { height: 0, width: 0 };
const style = { flex: 1 };

const renderListEmpty = () => <EmptyState text="No Threads" />;

const renderRow = ({ channel: { id, data, partner }, ...rest }, index) => (
    <ThreadItem {...{ id, data, partner }} />
);

const ListLoadingComponent = () => (
    <>
        <ThreadItem />
        <ThreadItem />
        <ThreadItem />
        <ThreadItem />
        <ThreadItem />
        <ThreadItem />
    </>
);

export default ({ chats, error, loading, leftButtonElement }) => {
    const [{ width }, onResize] = useState(initialState);
    const [layoutProvider, setLayoutProvider] = useState(
        LayoutUtil.getLayoutProvider(width, 80)
    );
    const [contextProvider] = useState(new ContextHelper('ThreadList'));

    useEffect(() => {
        setLayoutProvider(LayoutUtil.getLayoutProvider(width, 80));
    }, [width]);

    const renderListHeader = useCallback(
        props => (
            <ListHeader
                {...props}
                leftButtonElement={leftButtonElement}
                icon={InboxIcon}
                title="Inbox"
            >
                <IconButton icon={ArchiveIcon} color="alt_text" />
                <IconButton icon={FilterIcon} color="alt_text" />
            </ListHeader>
        ),
        []
    );

    if (error) {
        return <EmptyState text="Error loading threads" />;
    }

    return (
        <ListView
            {...{
                contextProvider,
                layoutProvider,
                ListLoadingComponent,
                onResize,
                renderRow,
                style,
            }}
            loading={loading && !chats.length}
            data={chats}
            ListHeaderComponent={renderListHeader}
            ListEmptyComponent={renderListEmpty}
            rowCount={chats.length}
            showEmptyHeader
        />
    );
};

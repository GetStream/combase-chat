import { useCallback, useEffect, useState } from 'react';
import LayoutProvider from '../LayoutProvider';

export default (data, user) => {
    const [width, setWidth] = useState(375);
    const [layoutProvider, setLayoutProvider] = useState(
        LayoutProvider(width, data, user)
    );

    const handleResize = useCallback(({ width }) => {
        setWidth(width);
    }, []);

    useEffect(() => {
        setLayoutProvider(LayoutProvider(width, data, user));
    }, [data, user, width]);

    return [layoutProvider, handleResize, width];
};

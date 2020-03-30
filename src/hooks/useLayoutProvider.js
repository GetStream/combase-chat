import { useCallback, useEffect, useState } from "react";
import LayoutProvider from "../LayoutProvider";

export default (data, user) => {
	const [width, setWidth] = useState(0);
	const [layoutProvider, setLayoutProvider] = useState(
		LayoutProvider(width, data, user)
	);

	const handleResize = useCallback(width => {
		setWidth(width);
	}, []);

	useEffect(() => {
		setLayoutProvider(LayoutProvider(width, data, user));
	}, [width, itemDims]);
	return [layoutProvider, handleResize, width];
};
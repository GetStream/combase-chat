import { useCallback, useEffect, useMemo, useState } from 'react';
import ResizeObserver from "@comba.se/ui/utils/ResizeObserver";

export default () => {
	const [ref, setRef] = useState(null);
	const [layout, setLayout] = useState(null);

	const handleResize = useCallback(entries => {
		const [entry] = entries;
		const {
			blockSize: height,
			inlineSize: width,
		} = entry;

		setLayout({ width, height });

		if (onResize) {
			onResize({ width, height });
		}
	}, []);

	const { observer } = useMemo(() => { observer: new ResizeObserver(handleResize) });

	useEffect(() => {
		if (ref) {
			observer.observe(ref, {
				box: 'border-box',
			});
		}
		return () => observer.disconnect();
	}, [observer, ref]);

	const setRef = useCallback((el) => {
		if (!ref) {
			setRef(el);
		}
	}, [ref]);

	return [layout, setRef]
};
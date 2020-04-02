import { LayoutProvider } from 'recyclerlistview/web';

export default (width = 375, height = 80) =>
    new LayoutProvider(
        () => 'ThreadItem',
        (type, dim) => {
            switch (type) {
                case 'ThreadItem':
                    dim.height = height;
                    dim.width = width || 375;
                    break;
                default:
                    dim.height = 0;
                    dim.width = 0;
            }
        }
    );

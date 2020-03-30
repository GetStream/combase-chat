import { useContext } from 'react';
import ChatContext from '../contexts/Chat';

export default () => {
	return useContext(ChatContext);
};
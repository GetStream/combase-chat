export default (state, action) => {
	switch (action.type) {
		case 'InputToolbar/Change':
			return { ...state, text: action.text };
		case 'InputToolbar/DisableTyping':
			return { ...state, typingDisabled: action.disabled };
		case 'InputToolbar/SetHeight':
			return { ...state, inputToolbarHeight: action.height };
		default:
			return state;
	}
}
import { isOneWebRoomPage } from '../../../../utils/page-checker';

// eslint-disable-next-line consistent-return
const handleClick = (event) => {
	const input = document.querySelector('.new-comment-input');
	if (input.disabled) {
		return false;
	}

	window.webinarComments.addMessage({
		text: input.value,
	});

	input.value = '';
	event.preventDefault();
};

const handleWebsComments = (delay = 0) => {
	if (!isOneWebRoomPage) {
		return;
	}

	setTimeout(() => {
		document.querySelectorAll('.webinar-btn-send').forEach((button) => {
			button.removeEventListener('click', handleClick);
			button.addEventListener('click', handleClick);
		});
	}, delay);
};

export default handleWebsComments;

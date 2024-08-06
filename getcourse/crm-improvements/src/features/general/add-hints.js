import { isDealPage } from '../../../../../utils/page-checker';

const createHintNode = (text) => {
	const node = document.createElement('div');
	node.classList.add('hint');

	node.innerHTML = `
  <i class="fa fa-lightbulb-o" aria-hidden="true"></i>
  <span>${text}</span>
  `;

	return node;
};

const addHints = () => {
	if (isDealPage) {
		const dealCommentNode = document.querySelector('[name="Deal[add_comment]"]');
		if (dealCommentNode) {
			dealCommentNode.before(
				createHintNode(
					'<strong>Укажите комментарий для истории взаимодействия с клиентом</strong>. Правильней всего это делать в блоке ниже, т.к. этот комментарий отобразится в ленте событий справа'
				)
			);
		}
	}
};

export default addHints;

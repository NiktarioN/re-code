import { isDealPage } from '../../../../utils/page-checker';
import createHintNode from '../../components/hint';

const addHints = () => {
  if (isDealPage) {
    const dealCommentNode = document.querySelector('[name="Deal[add_comment]"]');
    if (dealCommentNode) {
      dealCommentNode.before(
        createHintNode(
          '<strong>Укажите комментарий для истории взаимодействия с клиентом</strong>. Правильней всего это делать в блоке ниже, т.к. этот комментарий отобразится в ленте событий справа',
          true
        )
      );
    }
  }
};

export default addHints;
/* eslint-disable no-param-reassign */
const openModal = (modal, classOpen) => {
  modal.classList.add(classOpen);
  modal.style.display = 'block';
  document.body.classList.add('modal-open');
};

const closeModal = (modal, classOpen) => {
  modal.classList.remove(classOpen);
  document.body.classList.remove('modal-open');
};

const modalController = ({ modal, btn, classOpen, classClose }) => {
  const { body } = document;
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

  const handleOpenModal = () => {
    openModal(modal, classOpen);

    body.style.overflow = 'hidden';
    body.style.paddingRight = `${scrollBarWidth}px`;
  };

  const handleCloseModal = () => {
    closeModal(modal, classOpen);

    body.style.overflow = '';
    body.style.paddingRight = '';
  };

  btn.addEventListener('click', () => {
    handleOpenModal();
  });

  modal.addEventListener('click', ({ target }) => {
    if (target === modal || target.classList.contains(classClose)) {
      handleCloseModal();
    }
  });

  window.addEventListener('keydown', ({ key }) => {
    if (key === 'Escape' && modal.classList.contains(classOpen)) {
      handleCloseModal();
    }
  });
};

export default modalController;

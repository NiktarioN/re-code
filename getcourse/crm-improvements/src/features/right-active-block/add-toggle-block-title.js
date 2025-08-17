/* eslint-disable no-param-reassign */

const createToggleLink = () => {
  const toggleLink = document.createElement('a');
  toggleLink.classList.add('recode-toggle-block-title');
  toggleLink.setAttribute('aria-expanded', 'false');
  toggleLink.innerHTML = '<i class="state fa fa-chevron-right"></i>';

  return toggleLink;
};

const setBlockTitleStyles = (blockTitle, isHidden) => {
  blockTitle.style.transition = 'max-height 0.5s, overflow 0.5s, padding 0.5s';
  blockTitle.style.setProperty('overflow', isHidden ? 'hidden' : 'visible', 'important');
  blockTitle.style.setProperty('max-height', isHidden ? '0' : `${blockTitle.scrollHeight}px`, 'important');
  blockTitle.style.padding = isHidden ? '0' : '10px';
};

const addToggleBlockTitle = (rightActiveBlock) => {
  const blockTitle = rightActiveBlock.querySelector('.block-title');
  if (!blockTitle) {
    return;
  }

  const toggleLinkAlreadyCreated = !!document.querySelector('.recode-toggle-block-title');
  if (toggleLinkAlreadyCreated) {
    return;
  }

  const toggleLink = createToggleLink();
  blockTitle.parentNode.before(toggleLink);

  const isHidden = localStorage.getItem('recode-block-title-hidden') === 'true';
  setBlockTitleStyles(blockTitle, isHidden);
  toggleLink.setAttribute('aria-expanded', !isHidden);

  const toggleBlockTitle = (event) => {
    event.preventDefault();

    const hidden = blockTitle.style.maxHeight === '0px';
    if (!hidden) {
      blockTitle.style.setProperty('max-height', '0', 'important');
      blockTitle.style.setProperty('overflow', 'hidden', 'important');
      blockTitle.style.padding = '0';
    } else {
      blockTitle.style.setProperty('max-height', `${blockTitle.scrollHeight}px`, 'important');
      blockTitle.style.setProperty('overflow', 'visible', 'important');
      blockTitle.style.padding = '10px';
    }

    toggleLink.setAttribute('aria-expanded', hidden);
    toggleLink.classList.toggle('open', hidden);
    localStorage.setItem('recode-block-title-hidden', !hidden);
  };

  toggleLink.addEventListener('click', toggleBlockTitle);
};

export default addToggleBlockTitle;
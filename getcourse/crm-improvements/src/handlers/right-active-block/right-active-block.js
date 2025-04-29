const handleRightActiveBlockLoaded = (callbacks = []) => {
  const rightActiveBlock = document.querySelector('.gc-right-active-block');
  if (!rightActiveBlock) {
    return;
  }

  const observer = new MutationObserver(() => {
    callbacks.forEach((callback) => {
      callback(rightActiveBlock);
    });
  });

  observer.observe(rightActiveBlock, { childList: true, subtree: true });
}

export default handleRightActiveBlockLoaded;
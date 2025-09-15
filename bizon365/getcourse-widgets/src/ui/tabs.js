export const createTabNavigation = (tabsConfig) => {
  const navigation = document.createElement('ul');
  navigation.className = 'nav nav-tabs';
  navigation.setAttribute('role', 'tablist');

  tabsConfig.forEach((tabConfig, index) => {
    const listItem = document.createElement('li');
    listItem.setAttribute('role', 'presentation');

    if (index === 0) {
      listItem.classList.add('active');
    }

    const tabLink = document.createElement('a');
    tabLink.href = `#${tabConfig.id}`;
    tabLink.setAttribute('aria-controls', tabConfig.id);
    tabLink.setAttribute('role', 'tab');
    tabLink.setAttribute('data-toggle', 'tab');
    tabLink.textContent = tabConfig.title;

    listItem.appendChild(tabLink);
    navigation.appendChild(listItem);
  });

  return navigation;
};

export const createTabContent = (tabsConfig) => {
  const contentContainer = document.createElement('div');
  contentContainer.className = 'tab-content';

  tabsConfig.forEach((tabConfig, index) => {
    const tabPane = document.createElement('div');
    tabPane.className = 'tab-pane';
    tabPane.id = tabConfig.id;
    tabPane.setAttribute('role', 'tabpanel');

    if (index === 0) {
      tabPane.classList.add('active');
    }

    contentContainer.appendChild(tabPane);
  });

  return contentContainer;
};
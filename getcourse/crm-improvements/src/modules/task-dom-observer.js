class TaskDomObserver {
  constructor() {
    this.subscriptions = new WeakMap();
  }

  subscribe(formElement, subscriptionId, callback) {
    if (!this.subscriptions.has(formElement)) {
      const observer = new MutationObserver((mutations) => {
        const subs = this.subscriptions.get(formElement)?.subscribers;
        subs?.forEach(cb => cb(mutations));
      });

      observer.observe(formElement, {
        childList: true,
        subtree: true,
      });

      this.subscriptions.set(formElement, {
        observer,
        subscribers: new Map(),
      });
    }

    const formSubscriptions = this.subscriptions.get(formElement);
    formSubscriptions.subscribers.set(subscriptionId, callback);
  }

  unsubscribe(formElement, subscriptionId) {
    const formSubscriptions = this.subscriptions.get(formElement);
    if (!formSubscriptions) {
      return;
    }

    formSubscriptions.subscribers.delete(subscriptionId);

    if (!formSubscriptions.subscribers.size) {
      formSubscriptions.observer.disconnect();
      this.subscriptions.delete(formElement);
    }
  }
}

export default TaskDomObserver;
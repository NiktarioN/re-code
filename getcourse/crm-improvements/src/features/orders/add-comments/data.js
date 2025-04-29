const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split(' ')[0].split('-');
  const time = dateStr.split(' ')[1] || '';
  const [hours, minutes] = time.split(':');

  return `${day}.${month}.${year.slice(-2)} ${hours}:${minutes}`;
};

const filterDeals = (deals, currentDealCreatedAt) =>
  deals.reduce(
    (result, deal) => {
      if (deal.created_at < currentDealCreatedAt) {
        result.before.push(deal);
      } else if (deal.created_at > currentDealCreatedAt) {
        result.after.push(deal);
      } else {
        result.current.push(deal);
      }
      return result;
    },
    { before: [], after: [], current: [] }
  );

export { formatDate, filterDeals };

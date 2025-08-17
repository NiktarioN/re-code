// @shared
export const formatDateForGetCourse = (dateString) => {
  if (!dateString) {
    return null
  };
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export const mapOfferToResponse = (offer) => ({
  id: offer.id,
  title: offer.title,
  price: offer.final_price || offer.price || 0,
  tags: offer.tags ? offer.tags.map((tag) => tag.name) : [],
});

export const mapManagerToResponse = (manager) => ({
  id: manager.id,
  name: manager.name,
  email: manager.email,
  displayName: `${manager.name} (${manager.email})`,
});

export const mapUserWithCustomFieldsToResponse = (user, customFields) => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name || '',
  lastName: user.last_name || '',
  phone: user.phone || '',
  telegram: customFields?.[799909]?.value || '',
});
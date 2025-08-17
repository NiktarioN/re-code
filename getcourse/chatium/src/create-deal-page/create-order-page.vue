<template>
	<div class="create-order-page">
		<div class="container">
			<h1 class="title">Тестирование загрузки предложений</h1>

			<div class="test-info">
				<p><strong>Тестируем:</strong> Загрузка предложений из GetCourse и модальное окно выбора</p>
				<p><strong>Статус:</strong> {{ isLoading ? 'Загружается...' : `Загружено ${offers.length} предложений` }}</p>
			</div>

			<form class="form">
				<!-- Выбор предложений -->
				<div class="form-group">
					<label class="label">
						Выбор предложений
						<span class="required">*</span>
					</label>
					<p class="help-text">Тест загрузки предложений и модального окна</p>
					<button type="button" @click="openOfferModal" class="select-button" :disabled="isLoading">
						{{ selectedOffers.length > 0 ? `Выбрано предложений: ${selectedOffers.length}` : 'Выбрать предложения' }}
					</button>
					<div v-if="selectedOffers.length > 0" class="selected-items">
						<div v-for="offer in selectedOffers" :key="offer.id" class="selected-item">
							{{ offer.title }} ({{ formatPrice(offer.price) }})
							<button type="button" @click="removeOffer(offer.id)" class="remove-button">×</button>
						</div>
					</div>
				</div>

				<!-- Стоимость заказа -->
				<div class="form-group">
					<label class="label">Рассчитанная стоимость</label>
					<div class="price-info">
						<span>{{ formatPrice(calculatedTotal) }}</span>
					</div>
				</div>

				<!-- Отключенные поля для демонстрации -->
				<div class="disabled-section">
					<h3>Отключенные функции (для следующих тестов):</h3>
					<div class="form-group">
						<label class="label">Email пользователя (отключено)</label>
						<input type="email" class="input" placeholder="Будет тестироваться позже" disabled />
					</div>
					<div class="form-group">
						<label class="label">Менеджер заказа (отключено)</label>
						<select class="select" disabled>
							<option>Будет тестироваться позже</option>
						</select>
					</div>
					<button type="button" class="create-button" disabled>Создать заказ (отключено)</button>
				</div>
			</form>
		</div>

		<!-- Модальное окно выбора предложений -->
		<div v-if="showOfferModal" class="modal-overlay" @click="closeOfferModal">
			<div class="modal" @click.stop>
				<div class="modal-header">
					<h3>Выбор предложений (Тест)</h3>
					<button @click="closeOfferModal" class="modal-close">×</button>
				</div>

				<div class="modal-filters">
					<input v-model="offerSearchQuery" type="text" placeholder="Поиск по названию..." class="search-input" />
					<select v-model="selectedOfferTag" class="select">
						<option value="">Все теги</option>
						<option v-for="tag in offerTags" :key="tag" :value="tag">
							{{ tag }}
						</option>
					</select>
				</div>

				<div class="offers-list">
					<div v-if="isLoading" class="loading-message">Загружаем предложения...</div>
					<div v-else-if="filteredOffers.length === 0" class="empty-message">Предложения не найдены</div>
					<div
						v-else
						v-for="offer in filteredOffers"
						:key="offer.id"
						class="offer-item"
						:class="{ 'offer-selected': isOfferSelected(offer.id) }"
						@click="toggleOffer(offer)"
					>
						<div class="offer-info">
							<h4>{{ offer.title }}</h4>
							<div class="offer-details">
								<span class="offer-price">{{ formatPrice(offer.price) }}</span>
								<span v-if="offer.tags.length > 0" class="offer-tags">
									{{ offer.tags.join(', ') }}
								</span>
							</div>
						</div>
						<div class="offer-checkbox">
							<input type="checkbox" :checked="isOfferSelected(offer.id)" readonly />
						</div>
					</div>
				</div>

				<div class="modal-footer">
					<span class="selected-count">Выбрано: {{ selectedOffers.length }}</span>
					<button @click="closeOfferModal" class="button-secondary">Закрыть</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { get } from '@app/request';

const MESSAGES = {
	ERROR_LOADING_DATA: 'Ошибка загрузки предложений',
};

const isLoading = ref(false);
const showOfferModal = ref(false);

// Данные
const offers = ref([]);
const selectedOffers = ref([]);

// Фильтры для предложений
const offerSearchQuery = ref('');
const selectedOfferTag = ref('');

const calculatedTotal = computed(() => {
	return selectedOffers.value.reduce((sum, offer) => sum + (offer.price || 0), 0);
});

const formatPrice = (price) => {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
	}).format(price || 0);
};

const offerTags = computed(() => {
	const tags = new Set();
	offers.value.forEach((offer) => {
		offer.tags.forEach((tag) => tags.add(tag));
	});
	return Array.from(tags).sort();
});

const filteredOffers = computed(() => {
	return offers.value.filter((offer) => {
		const matchesSearch = offer.title.toLowerCase().includes(offerSearchQuery.value.toLowerCase());
		const matchesTag = !selectedOfferTag.value || offer.tags.includes(selectedOfferTag.value);
		return matchesSearch && matchesTag;
	});
});

const loadOffers = async () => {
	try {
		isLoading.value = true;
		console.log('🔄 Загружаем предложения...');

		const response = await get('/offers', { responseType: 'json' });
		offers.value = response.body;

		console.log('✅ Предложения загружены:', offers.value);
	} catch (error) {
		console.error('❌ Ошибка загрузки предложений:', error);
		alert(MESSAGES.ERROR_LOADING_DATA + ': ' + error.message);
	} finally {
		isLoading.value = false;
	}
};

const openOfferModal = () => {
	console.log('📂 Открываем модальное окно');
	showOfferModal.value = true;
};

const closeOfferModal = () => {
	console.log('❌ Закрываем модальное окно');
	showOfferModal.value = false;
	offerSearchQuery.value = '';
	selectedOfferTag.value = '';
};

const isOfferSelected = (offerId) => {
	return selectedOffers.value.some((offer) => offer.id === offerId);
};

const toggleOffer = (offer) => {
	const index = selectedOffers.value.findIndex((selected) => selected.id === offer.id);
	if (index > -1) {
		selectedOffers.value.splice(index, 1);
		console.log('➖ Убрали предложение:', offer.title);
	} else {
		selectedOffers.value.push(offer);
		console.log('➕ Добавили предложение:', offer.title);
	}
};

const removeOffer = (offerId) => {
	const index = selectedOffers.value.findIndex((offer) => offer.id === offerId);
	if (index > -1) {
		console.log('🗑️ Удаляем предложение:', selectedOffers.value[index].title);
		selectedOffers.value.splice(index, 1);
	}
};

onMounted(() => {
	console.log('🚀 Компонент загружен, начинаем тест');
	loadOffers();
});
</script>

<style scoped>
.create-order-page {
	min-height: 100vh;
	background: #f8f8f8;
	padding: 20px;
}

.container {
	max-width: 800px;
	margin: 0 auto;
	background: white;
	border-radius: 8px;
	padding: 30px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
	font-size: 28px;
	font-weight: bold;
	margin-bottom: 20px;
	color: #333;
	text-align: center;
}

.test-info {
	background: #e3f2fd;
	padding: 15px;
	border-radius: 6px;
	margin-bottom: 30px;
	border-left: 4px solid #007bff;
}

.test-info p {
	margin: 5px 0;
}

.form {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.label {
	font-weight: 600;
	color: #555;
	font-size: 14px;
}

.required {
	color: #dc3545;
	font-weight: bold;
}

.help-text {
	font-size: 14px;
	color: #666;
	margin-top: -4px;
	margin-bottom: 8px;
}

.select,
.input {
	padding: 12px;
	border: 1px solid #ddd;
	border-radius: 6px;
	font-size: 14px;
	transition: border-color 0.2s;
}

.select:focus,
.input:focus {
	outline: none;
	border-color: #007bff;
}

.select-button {
	padding: 12px;
	border: 1px solid #ddd;
	border-radius: 6px;
	background: white;
	text-align: left;
	cursor: pointer;
	transition: border-color 0.2s;
}

.select-button:hover:not(:disabled) {
	border-color: #007bff;
}

.select-button:disabled {
	background: #f5f5f5;
	cursor: not-allowed;
}

.selected-items {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-top: 8px;
}

.selected-item {
	background: #e3f2fd;
	padding: 6px 12px;
	border-radius: 20px;
	font-size: 12px;
	display: flex;
	align-items: center;
	gap: 8px;
}

.remove-button {
	background: none;
	border: none;
	color: #666;
	cursor: pointer;
	font-size: 16px;
	line-height: 1;
}

.price-info {
	font-size: 18px;
	font-weight: 600;
	color: #007bff;
	padding: 10px;
	background: #f8f9ff;
	border-radius: 6px;
}

.disabled-section {
	background: #f5f5f5;
	padding: 20px;
	border-radius: 8px;
	margin-top: 30px;
}

.disabled-section h3 {
	margin-bottom: 15px;
	color: #666;
}

.create-button {
	background: #ccc;
	color: white;
	border: none;
	padding: 15px 30px;
	border-radius: 6px;
	font-size: 16px;
	font-weight: 600;
	cursor: not-allowed;
	margin-top: 10px;
}

/* Модальное окно */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.modal {
	background: white;
	border-radius: 8px;
	width: 90%;
	max-width: 600px;
	max-height: 80vh;
	display: flex;
	flex-direction: column;
}

.modal-header {
	padding: 20px;
	border-bottom: 1px solid #eee;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #e3f2fd;
}

.modal-header h3 {
	margin: 0;
	font-size: 18px;
	color: #007bff;
}

.modal-close {
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
	color: #666;
}

.modal-filters {
	padding: 20px;
	border-bottom: 1px solid #eee;
	display: flex;
	gap: 15px;
}

.search-input {
	flex: 1;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 6px;
}

.offers-list {
	flex: 1;
	overflow-y: auto;
	padding: 20px;
}

.loading-message,
.empty-message {
	text-align: center;
	padding: 40px;
	color: #666;
	font-size: 16px;
}

.offer-item {
	border: 1px solid #eee;
	border-radius: 6px;
	padding: 15px;
	margin-bottom: 10px;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	align-items: center;
	transition: border-color 0.2s;
}

.offer-item:hover {
	border-color: #007bff;
}

.offer-selected {
	border-color: #007bff;
	background: #f8f9ff;
}

.offer-info h4 {
	margin: 0 0 5px 0;
	font-size: 14px;
}

.offer-price {
	font-weight: 600;
	color: #007bff;
}

.offer-tags {
	margin: 0;
	font-size: 12px;
	color: #666;
}

.offer-details {
	display: flex;
	gap: 10px;
	align-items: center;
}

.modal-footer {
	padding: 20px;
	border-top: 1px solid #eee;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #f8f9fa;
}

.selected-count {
	font-size: 14px;
	color: #666;
	font-weight: 600;
}

.button-secondary {
	background: #6c757d;
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 6px;
	cursor: pointer;
}

.button-secondary:hover {
	background: #5a6268;
}
</style>

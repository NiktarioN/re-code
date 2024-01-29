const getReformedFields = (fields) =>
	fields.reduce((result, field) => {
		if (field?.id && (field?.type?.toLowerCase() === 'user' || field?.type?.toLowerCase() === 'deal')) {
			const name = `formParams[${field.type.toLowerCase()}CustomFields][${field.id}]`;

			result.push({
				name,
				title: field.title,
				fieldSelector: `[name="${name}"]`,
				valueType: field.valueType,
				trigger: field.trigger,
			});
		}

		return result;
	}, []);

const getUserFields = (fields) => fields.filter(({ name }) => name.includes('userCustomFields'));

const getParamFields = (fields) => fields.filter(({ valueType, trigger }) => valueType === 'param' && trigger);

const getCookieFields = (fields) => fields.filter(({ valueType, trigger }) => valueType === 'cookie' && trigger);

const getOtherFields = (fields) => fields.filter(({ valueType, trigger }) => valueType === 'other' && trigger);

export { getReformedFields, getUserFields, getParamFields, getCookieFields, getOtherFields };

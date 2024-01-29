const cookieStorage = {
	getValue: (key) => {
		try {
			return decodeURIComponent(
				document.cookie.match(new RegExp(`(?:^|; )${key.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1')}=([^;]*)`))[1]
			);
		} catch (_) {
			return undefined;
		}
	},
};

const { getValue: getCookieValue } = cookieStorage;
export default getCookieValue;

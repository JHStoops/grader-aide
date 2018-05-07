/* global fetch */

export default {
	install: function(Vue, apiHost) {
		Vue.prototype.$apiCall = function (path, method, body) {
			let jwtToken = localStorage.getItem('token');
			return fetch(apiHost + path, {
				headers: {
					'accept': 'application/json',
					'content-type': 'application/json',
					'x-access-token': jwtToken
				},
				mode: 'cors',
				method: method,
				body: JSON.stringify(body)
			});
		};
	}
};

import {isObject, isEmpty} from 'lodash';
import {INVALID_RESPONSE} from '../actions/runtime';



/**
 *
 */
export const sendMessage = (message, options = {}) =>
	new Promise((resolve, reject) => {
		const handleResponse = (value) => {
			if (value === INVALID_RESPONSE) {
				reject();
			} else {
				resolve(value);
			}
		};

		// Chrome uses a callback as the third parameter...
		const promise = chrome.runtime.sendMessage(
			message,
			options,
			handleResponse
		);

		// Firefox returns a promise instead.
		if (isObject(promise) && promise.then) {
			promise.then(handleResponse, reject);
		}
	});

/**
 *
 */
export const createMessageHandler = (handler) =>
	(message, sender, sendResponse) => {
		const response = handler(message, sender);

		if (response instanceof Promise) {
			response.then(sendResponse);
			return true;
		} else if (!isEmpty(response)) {
			sendResponse(response);
		}
	};
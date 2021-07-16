import moment from 'moment';

function get_current_time() {
	const current_time = new Date().toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	});
	return current_time;
}

function get_date_from_now(dateObj) {
	const result = moment(dateObj).calendar(null, {
		sameDay: 'HH:MM A',
		lastDay: '[Yesterday]',
		sameElse: 'DD/MM/YYYY',
	});
	return result;
}

function scroll_to_bottom($element) {
	$element.animate(
		{
			scrollTop: $element[0].scrollHeight,
		},
		300
	);
}
async function get_rooms() {
	const res = await frappe.call({
		type: 'GET',
		method: 'chat.api.room.get',
	});
	return await res.message;
}
async function get_messages(room) {
	const res = await frappe.call({
		method: 'chat.api.message.get_all',
		args: {
			room: 'CR00001',
		},
	});
	return await res.message;
}
async function get_settings() {
	const res = await frappe.call({
		type: 'GET',
		method: 'chat.api.config.settings',
	});
	return await res.message;
}
async function setup_dependencies(socketio_port) {
	await frappe.require(
		[
			'assets/frappe/js/lib/socket.io.min.js',
			'assets/frappe/js/frappe/socketio_client.js',
		],
		() => {
			frappe.socketio.init(socketio_port);
		}
	);
}
export {
	get_current_time,
	scroll_to_bottom,
	get_rooms,
	get_messages,
	get_settings,
	setup_dependencies,
	get_date_from_now,
};

import ChatMessage from './chat_message';
import { get_rooms } from './chat_utils';

export default class ChatList {
	constructor($wrapper) {
		this.$wrapper = $wrapper;
		this.setup();
	}

	setup() {
		this.$chat_list = $(document.createElement('div'));
		this.$chat_list.addClass('chat-list');
		this.setup_header();
		this.setup_search();
		this.profiles = [
			{ name: 'Whitebeard' },
			{ name: 'Blackbeard' },
			{ name: 'Shanks' },
			{ name: 'Mihawk' },
			{ name: 'Oden' },
			{ name: 'Zura' },
			{ name: 'Kagura' },
			{ name: 'Ginsan' },
			{ name: 'Megane' },
			{ name: 'Brook' },
		];
		this.fetch_and_setup_rooms();
	}

	setup_header() {
		const chat_list_header_html = `
			<div class="chat-list-header">
				<h3>Chats</h3>
				<div class="chat-list-actions">
					<i class="fa fa-pencil-square-o fa-lg mr-2 text-primary"></i>
					<i class="fa fa-expand fa-lg chat-expand-button"></i>
				</div>
			</div>
		`;
		this.$chat_list.append(chat_list_header_html);
	}

	setup_search() {
		const chat_list_search_html = `
			<div class="input-group my-2 chat-search">
				<i class="fa fa-search pt-2 pl-3"></i>
				<input class="form-control py-1 chat-search-box" 
				type="search" 
				placeholder="Search or Create a new conversation"
				>	
			</div>
		`;
		this.$chat_list.append(chat_list_search_html);
	}

	fetch_and_setup_rooms() {
		get_rooms().then((res) => {
			this.rooms = res;
			this.setup_rooms();
			this.render_messages();
		});
	}

	setup_rooms() {
		this.$chat_message_container = $(document.createElement('div'));
		this.$chat_message_container.addClass('chat-message-container');
		this.chat_messages = [];
		this.rooms.forEach((element) => {
			const profile = {
				name: element.guest,
			};
			this.chat_messages.push(
				new ChatMessage(
					this.$wrapper,
					this.$chat_message_container,
					this,
					profile
				)
			);
		});
		this.$chat_list.append(this.$chat_message_container);
	}

	setup_events() {
		const me = this;
		$('.chat-search-box').on('input', function (e) {
			// Todo
		});
	}

	render_messages() {
		this.$chat_message_container.empty();
		this.chat_messages.forEach((element) => {
			element.render();
		});
	}

	render() {
		this.$wrapper.html(this.$chat_list);
		this.setup_events();
	}
}

import { create_guest } from './chat_utils';
import ChatSpace from './chat_space';

export default class ChatForm {
  constructor(opts) {
    this.$wrapper = opts.$wrapper;
    this.profile = opts.profile;
    this.setup();
  }

  setup() {
    this.$chat_form = $(document.createElement('div'));
    this.$chat_form.addClass('chat-form');
    this.setup_header();
    this.setup_form();
  }

  setup_header() {
    this.avatar_html = frappe.avatar(null, 'avatar-medium', this.profile.name);
    const header_html = `
			<div class='chat-header mb-2'>
				${this.avatar_html}
				<div class='chat-profile-info'>
					<div class='chat-profile-name'>
						${__(this.profile.name)}
						<div class='online-circle'></div>
					</div>
					<div class='chat-profile-status'>${__('一般我们将在2小时内回复您。')}</div>
				</div>
			</div>
		`;
    this.$chat_form.append(header_html);
  }

  setup_form() {
    const form_html = `
			<div class='chat-form-container'>
				<p class='chat-query-heading'>${__('请分享您的需求和建议。')}</p>
				<form>
					<div class='form-group'>
						<label class='form-label'>${__('姓名')}</label>
						<input type='text' class='form-control' id='chat-fullname' 
							placeholder='${__('请输入姓名')}'>
					</div>
					<div class='form-group'>
						<label class='form-label'>${__('电子邮箱')}</label>
						<input type='email' class='form-control' id='chat-email' 
							placeholder='${__('请输入您的电子邮箱')}'>
					</div>
					<div class='form-group'>
						<label class='form-label'>${__('留言信息')}</label>
						<textarea class='form-control' id='chat-message-area' 
							placeholder='${__('请输入您的留言信息')}'></textarea>
					</div>
					<button type='button' class='btn btn-primary w-100'
						id='submit-form'>
            ${__('提交')}
          </button>
				</form>
			</div>
		`;
    const footer_html = `
      <a class='chat-footer' target='_blank' href='http://e-meta.work/'>
        ${__('@e-meta.work')}
      </a>
    `;
    this.$chat_form.append(form_html + footer_html);
  }

  get_values() {
    const result = {
      email: $('#chat-email').val(),
      full_name: $('#chat-fullname').val(),
      message: $('#chat-message-area').val(),
    };
    return result;
  }

  async validate_form() {
    try {
      const form_values = this.get_values();
      const res = await create_guest(form_values);

      if (!res) {
        return;
      }
      const query_message = {
        content: form_values.message,
        creation: new Date(),
        sender: res.guest_name,
        sender_email: res.email,
      };
      localStorage.setItem('guest_token', res.token);

      let profile = {
        room_name: this.profile.name,
        room: res.room,
        is_admin: this.profile.is_admin,
        user: res.guest_name,
        user_email: res.email,
        message: query_message,
        room_type: res.room_type,
      };

      const chat_space = new ChatSpace({
        $wrapper: this.$wrapper,
        profile: profile,
      });
    } catch (error) {
      //pass
    }
  }

  render() {
    this.$wrapper.html(this.$chat_form);
    const me = this;
    $('#submit-form').on('click', function () {
      me.validate_form();
    });
  }
}

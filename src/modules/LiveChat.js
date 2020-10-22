import DOMPurify from 'dompurify';
import io from 'socket.io-client';

export default {
    dom: {
        chatButton: $('.header-chat-icon'),
        chatCloseButton: $('.chat-title-bar-close'),
        chatBox: $('.chat-wrapper'),
        chatField: $('#chatField'),
        chatForm: $('#chatForm'),
        chatLog: $('#chat')
    },
    io: null,
    showChatBox: function() {
        this.dom.chatBox.addClass('chat--visible');
    },
    hideChatBox: function() {
        this.dom.chatBox.removeClass('chat--visible');
    },
    chatIconAction: function() {
        this.dom.chatButton.on('click', (e) => {
            e.preventDefault();

            if (this.dom.chatBox.hasClass('chat--visible')) {
                this.hideChatBox();
            } else {
                this.showChatBox();
                this.chatFieldFocus();
            }

        });
    },
    closeChatAction: function() {
        this.dom.chatCloseButton.on('click', (e) => {
            e.preventDefault();

            this.hideChatBox();
        });
    },
    run: function() {

        if (!this.dom.chatBox) {
            return false;
        }

        this.chatIconAction();
        this.closeChatAction();
        this.chatFormAction();
        this.socketServer();
    },
    chatFieldFocus: function() {
        this.dom.chatField.focus();
    },
    chatFormAction: function() {
        this.dom.chatForm.on('submit', (e) => {
            e.preventDefault();
            let text = this.dom.chatField.val();

            this.dom.chatField.val('');
            this.appendChatSelf(text, null);
            this.io.emit('sendMessage', { message: text });
            this.chatFieldFocus();
            this.scrollToBottom();
        })
    },
    appendChatSelf: function(text,) {

        // let avatar = user.avatar ? `/uploads/${user.avatar}` : 'https://gravatar.com/avatar/f64fc44c03a8a7eb1d52502950879659?s=128';

        this.dom.chatLog.append(`
            <div class="chat-self">
                <div class="chat-message">
                    <div class="chat-message-inner">${DOMPurify.sanitize(text)}</div>
                </div>
            </div> 
        `);
    },
    appendChatOther: function(text, user) {
        let avatar = user.avatar ? `/uploads/${user.avatar}` : 'https://gravatar.com/avatar/f64fc44c03a8a7eb1d52502950879659?s=128';

        this.dom.chatLog.append(`
        <div class="chat-other">
        <a href="#"><img class="avatar-tiny" src="${avatar}"></a>
        <div class="chat-message"><div class="chat-message-inner">
          <a href="#"><strong>${user.username}:</strong></a>
          ${text}
        </div></div>
        `);
    },
    scrollToBottom: function() {
        this.dom.chatLog.scrollTop(document.getElementById('chat').scrollHeight);
    },
    openConnection: function() {
        this.io = new io();
    },
    socketServer: function() {
        this.openConnection();

        this.io.on('joinRoom', (data) => {
            console.log(data.message)
        });

        this.io.on('receiveMessage', (data) => {
            this.appendChatOther(data.message, data.user);
            this.scrollToBottom();
        } );
    }

}
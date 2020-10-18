import DOMPurify from 'dompurify';

export default {
    dom: {
        chatButton: $('.header-chat-icon'),
        chatCloseButton: $('.chat-title-bar-close'),
        chatBox: $('.chat-wrapper'),
        chatField: $('#chatField'),
        chatForm: $('#chatForm'),
        chatLog: $('#chat')
    },
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
    },
    chatFieldFocus: function() {
        this.dom.chatField.focus();
    },
    chatFormAction: function() {
        this.dom.chatForm.on('submit', (e) => {
            e.preventDefault();

            this.appendChat(this.dom.chatField.val());
            this.dom.chatField.val('');
            this.chatFieldFocus();
        })
    },
    appendChat: function(text, self = true) {
        
        let direction = 'chat-self';

        if (!self) {
            direction = 'chat-other'    
        }

        this.dom.chatLog.append(`
            <div class="${direction}">
                <div class="chat-message">
                    <div class="chat-message-inner">${DOMPurify.sanitize(text)}</div>
                </div>
            </div> 
        `);
    }

}
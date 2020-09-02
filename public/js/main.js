(function($) {
    $('.btn-save-avatar').on('click', function() {
        if (confirm('Save avatar?')) {
            console.log('wowo');
            $('#avatarForm').submit();
        }
    });
})(jQuery)
import 'bootstrap/dist/css/bootstrap.css';

(function($) {
    $('.btn-save-avatar').on('click', function() {
        if (confirm('Save avatar?')) {
            console.log('wowo');
            $('#avatarForm').submit();
        }
    });

    $('.delete-post-button').on('click', function(e) {
        e.preventDefault();

        if (confirm('Delete this post?')) {
            $('.delete-form').submit();
        }
    });

})(jQuery)
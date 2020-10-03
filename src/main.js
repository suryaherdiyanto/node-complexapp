import 'bootstrap/dist/css/bootstrap.css';
import moment from 'moment';
import DOMPurify from 'dompurify';

(function($) {
    const liveSearch = {
        dom: {
            searchOverlay: $('.search-overlay'),
            searchInput: $('#live-search-field'),
            searchResult: $('.live-search-results'),
            loaderCircle: $('.circle-loader'),
            resultCount: $('.result-count')
        },
        value: {
            searchValue: '',
            typeTimer: '',
        },
        run: function() {
            this.saveAvatar();
            this.deletePost();
            this.showSearchOverlay();
            this.hideSearchOverlay();
            this.typeOnSearchField();
        },
        showLoaderCircle: function() {
            this.dom.loaderCircle.addClass('circle-loader--visible');
        },
        hideLoaderCircle: function() {
            this.dom.loaderCircle.removeClass('circle-loader--visible');
        },
        showSearchResult: function() {
            this.dom.searchResult.addClass('live-search-results--visible');
        },
        hideSearchResult: function() {
            this.dom.searchResult.removeClass('live-search-results--visible');
        },
        saveAvatar: function() {
            $('.btn-save-avatar').on('click', function() {
                if (confirm('Save avatar?')) {
                    $('#avatarForm').submit();
                }
            });
        },
        deletePost: function() {
            $('.delete-post-button').on('click', function(e) {
                e.preventDefault();
        
                if (confirm('Delete this post?')) {
                    $('.delete-form').submit();
                }
            });
        },
        showSearchOverlay: function() {
            $('.header-search-icon').on('click', (e) => {
                e.preventDefault();
        
                setTimeout(() => {
                    this.dom.searchInput.focus();
                }, 500);
                this.dom.searchOverlay.addClass('search-overlay--visible');
            });
        },
        hideSearchOverlay: function() {
            $('.close-live-search').on('click', (e) => {
                e.preventDefault();

                this.dom.searchOverlay.removeClass('search-overlay--visible');
            });
        },
        typeOnSearchField: function() {
            this.dom.searchInput.on('keyup', (e) => {
                let value = this.dom.searchInput.val();

                if (value === "") {
                    clearTimeout(this.value.typeTimer);
                    this.hideSearchResult();
                    this.hideLoaderCircle();
                    return false;
                }

                if(value !== "" && value !== this.value.previousValue) {
                    this.showLoaderCircle();
                    this.hideSearchResult();
                    clearTimeout(this.value.typeTimer);
                    this.value.typeTimer = setTimeout(() => {

                        $.get(`/api/search?q=${value}`, (result) => {
                            this.hideLoaderCircle();
                            this.dom.resultCount.text(result.count);

                            let template = '';

                            result.data.forEach((item) => {
                                template += `<a class='list-group-item list-group-item-action' href='/post/${item.id}'>
                                    <img class='avatar-tiny' src='${(item.User.avatar) ? `/uploads/${item.User.avatar}` : 'https://gravatar.com/avatar/f64fc44c03a8a7eb1d52502950879659?s=128'}'>
                                    <strong>${DOMPurify.sanitize(item.title)}</strong>
                                    <span class='text-muted small'> by ${item.User.username} on ${moment(item.createdAt).format('DD MMM, YYYY')}</span>
                                </a>`;
                            });

                            this.dom.searchResult.find('.list-group.results').html(template);
                            this.showSearchResult();
                        });
                        
                    }, 800);
                }

                this.value.previousValue = value;
            });
        }
        
    }

    liveSearch.run();


})(jQuery)
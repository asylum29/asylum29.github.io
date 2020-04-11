$(document).ready(function() {
    $.ajax({
        dataType: 'json',
        url: 'lang.json',
        success: function(data) {
            let lang_button = $('.langbtn');
            let lang = 'RU' === lang_button.text() ? 'en' : 'ru';
            setLang(data, lang);
            $('.container').show();
            lang_button.on('click', function(e) {
                e.preventDefault();
                $(this).text(lang.toUpperCase());
                lang = 'ru' === lang ? 'en' : 'ru';
                setLang(data, lang);
            });
        }
    });

    function setLang(data, lang) {
        let str = data[lang];
        $('title').text(str.title.join(' '));
        $('.name span').html(str.name.join(' '));
        $('.about').html(str.about_header.join(' '));
        $('.about + div').html(str.about_text.join(' '));
        $('.experience').html(str.experience_header.join(' '));
        $('.experience + div').html(str.experience_text.join(' '));
        $('.projects').html(str.projects_header.join(' '));
        let projects_list = $('.projects + div');
        projects_list.empty();
        for (let i = 0; i < str.projects_list.length; i++) {
            let temp = `${str.projects_list[i].name.join(' ')}<br />${str.projects_list[i].description.join(' ')}`;
            projects_list.append(`<li>${temp}</li>`);
        }
        projects_list.children('li').wrapAll('<ul />');
        $('.extra').html(str.extra_header.join(' '));
        $('.extra + div').html(str.extra_text.join(' '));
    }
});

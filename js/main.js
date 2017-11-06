$(document).ready(function() {
    $.ajax({
        dataType: 'json',
        url: 'lang.json',
        success: function(data) {
            var lang = 'en';
            setLang(data, lang);
            $('.langbtn').on('click', function(e) {
                e.preventDefault();
                $(this).text(lang.toUpperCase());
                lang = lang == 'en' ? 'ru' : 'en';
                setLang(data, lang);
            });
        }
    });

    function setLang(data, lang) {
        var str = data[lang];
        $('title').text(str.title.join(' '));
        $('.name span').html(str.name.join(' '));
        $('.about').html(str.about_header.join(' '));
        $('.about + div').html(str.about_text.join(' '));
        $('.experience').html(str.experience_header.join(' '));
        $('.experience + div').html(str.experience_text.join(' '));
        $('.projects').html(str.projects_header.join(' '));
        var projects_list = $('.projects + div');
        projects_list.empty();
        for (var i = 0; i < str.projects_list.length; i++) {
            var temp = str.projects_list[i].name.join(' ') + '<br />' + str.projects_list[i].description.join(' ');
            projects_list.append('<li>' + temp + '</li>');
        }
        projects_list.children('li').wrapAll('<ul />');
        $('.extra').html(str.extra_header.join(' '));
        $('.extra + div').html(str.extra_text.join(' '));
    }
});

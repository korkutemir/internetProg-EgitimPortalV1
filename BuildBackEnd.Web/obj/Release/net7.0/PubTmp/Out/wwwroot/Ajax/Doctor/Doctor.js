$(document).ready(function () {
    
    $('.language-code-textareas').each(function () {
        new Jodit(this,{
            language: 'en' // İngilizce dil ayarı
        });
    });
    var editor = new Jodit('#Description', {
        language: 'en' // İngilizce dil ayarı
    });


    
    $("#CountryId").select2({
        ajax: {
            url: "/Country/GetCountrySelect",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                var query = params.term || '';
                return {
                    q: query,
                    page: params.page || 1
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: $.map(data.items, function (item) {
                        if (item.languageCode != "en") {
                            return {
                                id: item.id,
                                text: item.name,
                            };
                        }
                    }),
                    pagination: {
                        more: ((params.page * 10) < data.total_count)
                    }
                };
            },
            cache: true
        },
        theme: "bootstrap-5",
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        placeholder: $(this).data('placeholder'),
        allowClear: true
    });

});



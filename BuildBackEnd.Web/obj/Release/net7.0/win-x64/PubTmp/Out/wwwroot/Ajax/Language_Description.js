var languageInputValues = {};
var initialLanguageCodes = {};

// Başlangıçta seçili olan dil kodlarını topla
$('#LanguageId option:selected').each(function () {
    var languageId = $(this).val();
    var languageCode = $(this).data('language-code');
    initialLanguageCodes[languageId] = languageCode;
});



$("#LanguageId").select2({
    ajax: {
        url: "/Language/GetLanguageSelect",
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
                            languageCode: item.languageCode
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
}).on("change", function () {
    var selectedData = $(this).select2('data');
    var inputContainer = $('#languageInputs');

    // Mevcut input değerlerini kaydet
    $('.language-code-textareas').each(function () {
        var languageCode = $(this).data('language-code');
        languageInputValues[languageCode] = $(this).val();
    });

    inputContainer.empty(); // Önceki inputları temizle

    // Seçilen her dil için bir input oluştur
    selectedData.forEach(function (item) {
        var languageCode = item.languageCode || initialLanguageCodes[item.id];
        var inputValue = languageInputValues[languageCode] || '';

        var inputHTML = `
        <div class="col-md-12 mb-3">
            <div class="form-group desciription_jodit_${languageCode}">
                <label for="Desciription_${languageCode}" class="form-label">Desciription in <b class="text-danger"> ${languageCode}</b></label>
                <textarea id="Desciription_${languageCode}" data-language-code="${languageCode}" class="form-control language-code-textareas" placeholder="Desciription in ${item.text}" required>${inputValue}
            </div>
        </div>
        `;
        inputContainer.append(inputHTML);

        $('#Desciription_' + languageCode).each(function () {
            new Jodit(this, {
                language: 'en' // İngilizce dil ayarı
            })
       });
   
    });
});
$(document).ready(function () {

    $("#CategoryId").select2({
        ajax: {
            url: "/Group/GetCategorySelect",
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
                        return {
                            id: item.id,
                            text: item.name,
                            languageCode: item.languageCode
                        };
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


    // var languageInputValues = {};

    // $("#LanguageId").select2({
    //     ajax: {
    //         url: "/Language/GetLanguageSelect",
    //         dataType: 'json',
    //         delay: 250,
    //         data: function (params) {
    //             var query = params.term || '';
    //             return {
    //                 q: query,
    //                 page: params.page || 1
    //             };
    //         },
    //         processResults: function (data, params) {
    //             params.page = params.page || 1;
    //             return {
    //                 results: $.map(data.items, function (item) {
    //                     if (item.languageCode != "en") {
    //                         return {
    //                             id: item.id,
    //                             text: item.name,
    //                             languageCode: item.languageCode
    //                         };
    //                     }
    //                 }),
    //                 pagination: {
    //                     more: ((params.page * 10) < data.total_count)
    //                 }
    //             };
    //         },
    //         cache: true
    //     },
    //     theme: "bootstrap-5",
    //     width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    //     placeholder: $(this).data('placeholder'),
    //     allowClear: true
    // }).on("change", function () {
    //     var selectedData = $(this).select2('data');
    //     var inputContainer = $('#languageInputs');

    //     // Mevcut input değerlerini kaydet
    //     $('.language-code-inputs').each(function() {
    //         var languageCode = $(this).data('language-code');
    //         languageInputValues[languageCode] = $(this).val();
    //     });

    //     inputContainer.empty(); // Önceki inputları temizle

    //     // Seçilen her dil için bir input oluştur
    //     selectedData.forEach(function(item) {
    //         var inputHTML = `
    //         <div class="col-md-6 mb-3">
    //             <div class="form-group">
    //                 <label for="Name_${item.languageCode}" class="form-label">Name <b class="text-danger">in ${item.languageCode}</b></label>
    //                 <input type="text" id="Name_${item.languageCode}" data-language-code="${item.languageCode}" class="form-control language-code-inputs" placeholder="Name in ${item.text}" value="${languageInputValues[item.languageCode] || ''}" required/>
    //             </div>
    //         </div>`;
    //         inputContainer.append(inputHTML);
    //     });
    // });

});



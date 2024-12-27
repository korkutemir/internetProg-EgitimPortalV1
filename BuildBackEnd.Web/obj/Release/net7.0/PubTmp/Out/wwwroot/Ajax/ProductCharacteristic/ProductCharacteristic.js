function readURL(a) { if (a.files && a.files[0]) { var e = new FileReader; e.onload = function (e) { $(".image-upload-wrap").hide(), $(".file-upload-pdf").attr("src", e.target.result), $(".file-upload-content").show(), $(".image-title").html(a.files[0].name) }, e.readAsDataURL(a.files[0]) } else removeUpload() } function removeUpload() { $(".file-upload-input").replaceWith($(".file-upload-input").clone()), $(".file-upload-content").hide(), $(".image-upload-wrap").show() } $(".image-upload-wrap").bind("dragover", function () { $(".image-upload-wrap").addClass("image-dropping") }), $(".image-upload-wrap").bind("dragleave", function () { $(".image-upload-wrap").removeClass("image-dropping") });
// Drag Pdf End

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


$("#ProductGroupId").select2({
    ajax: {
        url: "/Group/GetProductCategorySelect",
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
});
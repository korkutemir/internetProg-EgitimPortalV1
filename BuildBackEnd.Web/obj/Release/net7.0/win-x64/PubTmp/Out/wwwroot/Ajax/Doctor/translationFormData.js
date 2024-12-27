function translationFormData(productId) {
    var translationsData = [];
    $('.language-code-textareas').each(function () {
        var languageCode = $(this).data('language-code');
        var descriptionValue = $('.desciription_jodit_' + languageCode ).find(".jodit-wysiwyg").html();

        var translation = {
            Id: productId,
            LanguageCode: $(this).data('language-code'),
            Description: descriptionValue,
        };
        translationsData.push(translation);
    });
    console.log(translationsData);

    $.ajax({
        type: "POST",
        url: "/Doctor/Translation",
        data: JSON.stringify(translationsData), // Düzeltme burada yapıldı
        contentType: "application/json",
        success: function (response) {
            if (response.success) {
                console.log("Çeviri:" + response.message);
                window.location.href = "/Doctor/Index";
            }
            else {
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }
        }
    });
}

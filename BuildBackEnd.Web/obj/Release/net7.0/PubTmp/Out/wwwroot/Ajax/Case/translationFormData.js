function translationFormData(id) {
    var translationsData = [];
    $('input.language-code-inputs').each(function () {
        var translation = {
            Id: id,
            LanguageCode: $(this).data('language-code'),
            Name: $(this).val(),
        };
        translationsData.push(translation);
    });

    $.ajax({
        type: "POST",
        url: "/Case/Translation",
        data: JSON.stringify(translationsData), // Düzeltme burada yapıldı
        contentType: "application/json",
        success: function (response) {
            if (response.success) {
                console.log("Çeviri:" + response.message);
                window.location.href = "/Case/Index";
            }
            else {
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }
        }
    });
}
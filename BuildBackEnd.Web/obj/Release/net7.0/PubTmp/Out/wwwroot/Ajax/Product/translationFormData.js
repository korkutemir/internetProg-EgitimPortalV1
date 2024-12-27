function translationFormData(productId) {
    var translationsData = [];
    $('input.language-code-inputs').each(function () {
        var translation = {
            Id: productId,
            LanguageCode: $(this).data('language-code'),
            Name: $(this).val(),
        };
        translationsData.push(translation);
    });

    $.ajax({
        type: "POST",
        url: "/Product/Translation",
        data: JSON.stringify(translationsData), // Düzeltme burada yapıldı
        contentType: "application/json",
        success: function (response) {
            if (response.success) {
                console.log("Çeviri:" + response.message);
                window.location.href = "/Product/Index";
            }
            else {
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }
        }
    });
}

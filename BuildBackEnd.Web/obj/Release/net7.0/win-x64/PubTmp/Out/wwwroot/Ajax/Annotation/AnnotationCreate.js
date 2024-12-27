function submitTranslationData(annotationId) {
    // TranslationsData dizisini oluştur
    var translationsData = [];

    // Tüm dil kodu inputlarını döngüye al
    $('.language-code-inputs').each(function () {
        var languageCode = $(this).data('language-code');
        var nameValue = $(this).val();

        // Aynı dil koduna sahip textarea'yı bul
        var descriptionValue = $('textarea.language-code-textareas[data-language-code="' + languageCode + '"]').val();

        var translation = {
            Id: annotationId,
            LanguageCode: languageCode,
            Name: nameValue,
            Description: descriptionValue, // Açıklama bilgisi eklendi
        };

        // Diziye ekle
        translationsData.push(translation);
    });

    // AJAX ile sunucuya gönder
    $.ajax({
        type: "POST",
        url: "/Annotation/Translation",
        data: JSON.stringify(translationsData), // Veriyi JSON string olarak gönder
        contentType: "application/json", // İçerik tipini belirt
        success: function (response) {
            // Başarılı yanıt geldiğinde işlemler
            if (response.success) {
                console.log("Translation successful: " + response.message);
                window.location.href = "/Product/Index"; // Sayfayı ürün listesi sayfasına yönlendir
            } else {
                // Yanıt başarısız olduğunda uyarı göster
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }
        }
    });
}



$("#CreateForm").submit(function (e) {
    e.preventDefault();

    const productId = $("#ProductId").val();
    var request = {
        Name: $("#Name").val(),
        Description: $("#Description").val(),
        OrderNo: $("#OrderNo").val(),
        ProductId: productId
    };

    $.ajax({
        type: "POST",
        url: "/Annotation/CreateJson",
        data: request,
        success: function (response) {
            if (!response.success) {
                iziToast.warning({ timeout: 4000, icon: 'fas fa-times', title: 'Warning!', message: response.message });
            }

            if (response.success) {
                iziToast.success({ timeout: 4000, icon: 'fas fa-check', title: 'Success!', message: response.message });
                submitTranslationData(response.data);
                window.location.href = "/Product/Index";
            }

        }
    });

});



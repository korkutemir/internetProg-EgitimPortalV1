function translationFormData(productId) {
    var translationsData = [];
    $('.language-code-inputs').each(function () {
        var languageCode = $(this).data('language-code'),
         name = $(this).val();
        


        var descriptionValue = $('.desciription_jodit_' + languageCode ).find(".jodit-wysiwyg").html();

        var translation = {
            Id: productId,
            LanguageCode: languageCode,
            Name: name,
            Description: descriptionValue
        };
        translationsData.push(translation);
    })

    $.ajax({
        type: "POST",
        url: "/Speaker/Translation",
        data: JSON.stringify(translationsData),
        contentType: "application/json",
        success: function (response) {
            if (response.success) {
                console.log("Çeviri:" + response.message);
                window.location.href = "/SpeakerHome/" + $("#EventId").val();
            }
            else {
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }
        }
    });
}

$(document).ready(function () {
    $("#UpdateForm").submit(function (e) {
        e.preventDefault();
        let languageId = $("#LanguageId").val(),
            categoryVM = {
                OrderNo: $("#OrderNo").val(),
                Name: $("#Name").val(),
                Id: $("#Id").val()
            };

        let data = {
            categoryUpdate: categoryVM,
        }

        if (languageId != null) {
            data.languages = languageId;
        }

        $.ajax({
            type: "POST",
            url: "/Category/UpdateJson",
            data: data,
            success: function (response) {
                responseError(response.errors);

                if (response.success) {
                    iziToast.success({ timeout: 1500, title: 'Successfuly!', message: response.message });
                    if (languageId != null) {
                        translationFormData();
                    }
                }
                else {
                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                }

            }
        });

    });

    function translationFormData() {
        var translationsData = [];
        $('input.language-code-inputs').each(function () {
            var translation = {
                Id: $("#Id").val(),
                LanguageCode: $(this).data('language-code'),
                Name: $(this).val(),
            };
            translationsData.push(translation);
        });
        console.log(translationsData);

        $.ajax({
            type: "POST",
            url: "/Category/Translation",
            data: JSON.stringify(translationsData), // Düzeltme burada yapıldı
            contentType: "application/json",
            success: function (response) {
                if (response.success) {
                    console.log("Çeviri:" + response.message);
                    window.location.href = "/Category/Index";
                }
                else {
                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                }
            }
        });
    }

});





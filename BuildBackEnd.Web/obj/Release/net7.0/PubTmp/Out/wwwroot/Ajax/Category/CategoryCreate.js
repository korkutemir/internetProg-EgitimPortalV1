

$("#CreateForm").submit(function (e) {

    e.preventDefault();

    let languageId = $("#LanguageId").val(),
        categoryVM = {
            Name: $("#Name").val(),
            OrderNo: $("#OrderNo").val(),
        }
    var data = {
        category: categoryVM,
    }

    if (languageId != null) {
        data.languages = languageId;
    }

    $.ajax({
        type: "POST",
        url: "/Category/CreateJson",
        data: data,
        success: function (response) {
            responseError(response.errors);
            if (response.success) {
                iziToast.success({ timeout: 1500, title: 'Successfuly!', message: response.message });
                     if (languageId != null) {
                        translationFormData(response.data);
                    }
            }
            else {
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }

        }
    });



    function translationFormData(Id) {
        var translationsData = [];
        $('input.language-code-inputs').each(function () {
            var translation = {
                Id: Id,
                LanguageCode: $(this).data('language-code'),
                Name: $(this).val(),
            };
            translationsData.push(translation);
        });

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



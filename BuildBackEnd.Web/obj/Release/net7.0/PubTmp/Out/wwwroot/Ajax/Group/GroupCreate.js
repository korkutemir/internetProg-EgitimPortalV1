
import { ImageDelete } from "../helpFnc.js";

$("#CreateForm").submit(function (e) {
    e.preventDefault();


    let base64 = $("#croppedImage").attr("src");


    $.ajax({
        type: "POST",
        url: "/Media/ImageUploadBase64",
        data: {
            base64: base64,
            _imageFolderPath: "wwwroot/uploads/groups/"
        },
        success: function (response) {
            if (!response.success) {
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }

            if (response.success) {

                let baseCover64 = $("#croppedCoverImage").attr("src");

                $.ajax({
                    type: "POST",
                    url: "/Media/ImageUploadBase64",
                    data: {
                        base64: baseCover64,
                        _imageFolderPath: "wwwroot/uploads/groups/"
                    },
                    success: function (responseCover) {
                        if (!responseCover.success) {
                            iziToast.warning({ timeout: 1500, title: 'Error!', message: responseCover.message });
                        }
            
                        if (responseCover.success) {
                            CreateFormData(response.data, responseCover.data);// ekleme işlemini başlat
                        }
                    }
                });
               
            }
        }
    });



    function CreateFormData(MediaName, MediaCoverName) {

        let languageId = $("#LanguageId").val(),
            categoryVM = {
                CategoryParentId: $("#CategoryId").val(),
                Name: $("#Name").val(),
                MediaName: MediaName,
                MediaCoverName: MediaCoverName,
                OrderNo: $("#OrderNo").val(),
            };

        var data = {
            category: categoryVM,
        }
        if (languageId != null) {
            data.languages = languageId;
        }


        $.ajax({
            type: "POST",
            url: "/Category/CreateJson",
            async: false,
            data: data,
            success: function (response) {
                responseError(response.errors);

                if (!response.success) {
                    ImageDelete(response.data);
                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                }

                if (response.success) {

                    if (languageId != null) {
                        translationFormData(response.data);
                    }

                    iziToast.success({ timeout: 1500, title: 'Successfuly!', message: response.message });
                }

            }
        });


    }




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
        console.log(translationsData);

        $.ajax({
            type: "POST",
            url: "/Category/Translation",
            data: JSON.stringify(translationsData), // Düzeltme burada yapıldı
            contentType: "application/json",
            success: function (response) {
                if (response.success) {
                    console.log("Çeviri:" + response.message);
                    window.location.href = "/ProductGroup/";
                }
                else {
                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                }
            }
        });
    }
});




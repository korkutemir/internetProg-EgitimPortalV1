import { ImageDelete } from "../helpFnc.js";

$(document).ready(function () {

    // Burada 1 numaralı ID'ye sahip öğeyi seçiyoruz.

    $("#UpdateForm").submit(function (e) {
        e.preventDefault();

        let base64 = $("#croppedImage").attr("src");


        let oldMediaNamePath = $("#oldMediaNamePath").val();
        let oldMediaName = $("#oldMediaName").val();

        if (oldMediaNamePath == base64) {
            CreateFormData(oldMediaName);
            return;
        }
        else {
            ImageDelete(oldMediaName, "wwwroot/uploads/language/");
        }

        $.ajax({
            type: "POST",
            url: "/Media/ImageUploadBase64",
            data: {
                base64: base64,
                _imageFolderPath: "wwwroot/uploads/language/"
            },
            success: function (response) {
                if (!response.success) {
                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                }

                if (response.success) {
                    CreateFormData(response.data);// ekleme işlemini başlat
                }
            }
        });



    });

    function CreateFormData(MediaName) {
        var LanguageVM = {
            Name: $("#Name").val(),
            LanguageCode: $("#Code").val(),
            MediaName: MediaName,
            Id: $("#Id").val()
        }
        var translations = [];
        $('.bulkTranslationModel-col input, .bulkTranslationModel-col textarea').each(function() {
            var key = $(this).attr('id');  // Input'un id'sini al
            var value = $(this).val();    // Input'un değerini al
            translations.push({ Key: key, Value: value });  // Objeye ekle
        });
        

        var model = {
            LanguageCode: $("#Code").val(),
            Translations: translations
        }
        $.ajax({
            type: "POST",
            url: "/Language/UpdateJson",
            data: {
                LanguageUpdate: LanguageVM,
                model: model
            },
            success: function (response) {
                if (response.success) {
                    window.location = "/Language/";
                    iziToast.success({ timeout: 1500, title: 'Successfuly!', message: response.message });
                }
                else {
                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                }

            }
        });
    }
});


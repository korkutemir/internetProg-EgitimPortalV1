import { ImageDelete } from "../helpFnc.js";

$(function () {
    // "Tümünü Seç" butonuna tıklanınca tüm dilleri seç
    $('#selectAllLanguages').on('click', function () {
        console.log($('#LanguageId option').html());

        // Tüm seçenekleri seçmek için .val() kullan
        // $('#LanguageId').val(allValues);

        // Seçim değişikliğini tetiklemek için trigger kullanabilirsin
        // $('#LanguageId').trigger('change');
    });

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
            ImageDelete(oldMediaName, "wwwroot/uploads/doctors/");
        }

        $.ajax({
            type: "POST",
            url: "/Media/ImageUploadBase64",
            data: {
                base64: base64,
                _imageFolderPath: "wwwroot/uploads/doctors/"
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
        let languageId = $("#LanguageId").val(),
            DoctorVM = {
                Name: $("#Name").val(),
                MediaName: MediaName,
                Description: $("#Description").val(),
                Id: $("#Id").val(),
                CountryId: $("#CountryId").val(),
                OrderNo: $("#OrderNo").val(),
            }

        let data = {
            DoctorUpdate: DoctorVM
        }

        if (languageId != null) {
            data.languages = languageId;
        }

        $.ajax({
            type: "POST",
            url: "/Doctor/UpdateJson",
            data: data,
            success: function (response) {
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
    };








});







$("#CreateForm").submit(function (e) {
    e.preventDefault();

    let base64 = $("#croppedImage").attr("src");

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

    function CreateFormData(MediaName) {
        let languageId = $("#LanguageId").val(),
            DoctorVM = {
                Name: $("#Name").val(),
                Description: $("#Description").val(),
                MediaName: MediaName,
                CountryId: $("#CountryId").val(),
                OrderNo: $("#OrderNo").val(),
            };

        let data = {
            doctor: DoctorVM,
        }

        if (languageId != null) {
            data.languages = languageId;
        }


        $.ajax({
            type: "POST",
            url: "/Doctor/CreateJson",
            data: {
                doctor: DoctorVM,
                languages: $("#LanguageId").val()
            },
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
    }

});
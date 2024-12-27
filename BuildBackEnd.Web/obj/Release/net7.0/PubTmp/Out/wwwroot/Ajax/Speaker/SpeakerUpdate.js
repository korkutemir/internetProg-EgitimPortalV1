import { ImageDelete } from "../helpFnc.js";


$("#UpdateForm").submit(function (e) {
    e.preventDefault();
    let base64 = $("#croppedImage").attr("src");


    let oldMediaNamePath = $("#oldMediaNamePath").val();
    let oldMediaName = $("#oldMediaName").val();

    if (oldMediaNamePath == base64) {
        return CreateFormData(oldMediaName);
    }
    else {
        ImageDelete(oldMediaName, "wwwroot/uploads/Speakers/");
    }

    $.ajax({
        type: "POST",
        url: "/Media/ImageUploadBase64",
        data: {
            base64: base64,
            _imageFolderPath: "wwwroot/uploads/Speakers/"
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


        let EventId = $("#EventId").val(),
            languageId = $("#LanguageId").val(),
            SpeakerUpdateVM = {
                Id: $("#Id").val(),
                Name: $("#Name").val(),
                Description: $("#Description").val(),
                DoctorId: $("#DoctorId").val(),
                MediaName: MediaName,
                EventId: EventId,
                OrderNo: $("#OrderNo").val(),

            };

        let data = {
            SpeakerUpdateVM: SpeakerUpdateVM,
        }

        if (languageId != null) {
            data.languages = languageId;
        }

        $.ajax({
            type: "POST",
            url: "/Speaker/UpdateJson",
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

});



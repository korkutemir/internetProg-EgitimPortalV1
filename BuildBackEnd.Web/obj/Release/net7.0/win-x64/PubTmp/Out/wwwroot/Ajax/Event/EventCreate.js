import { ImageDelete } from "../helpFnc.js";


$("#CreateForm").submit(function (e) {
    e.preventDefault();



    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");


    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (startDate > endDate) {
        alert("The start date must be smaller than the end date!");
        return;
    }


    let base64 = $("#croppedImage").attr("src");

    $.ajax({
        type: "POST",
        url: "/Media/ImageUploadBase64",
        data: {
            base64: base64,
            _imageFolderPath: "wwwroot/uploads/Events/"
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
        let EventTypeId = $("#EventTypeId").val(),
            languageId = $("#LanguageId").val(),
            EventVM = {
                Name: $("#Name").val(),
                Description: $("#Description").val(),
                EventType: EventTypeId,
                ApplyNowLink: $("#ApplyNowLink").val(),
                MediaName: MediaName,
                CountryId: EventTypeId == 1 ? null : $("#CountryId").val(),
                EventDate: $("#start-date").val(),
                EventEndDate: $("#end-date").val(),
            }

        if (EventTypeId == 0 && ($("#CountryId").val() == null || $("#CountryId").val() == "" || $("#CountryId").val() == 0 || $("#CountryId").val() == undefined)) {
            iziToast.warning({ timeout: 1500, title: 'Error!', message: "Please select country" });
            return;
        }


        $.ajax({
            type: "POST",
            url: "/Event/CreateJson",
            async: false,
            data: {
                EventVM: EventVM,
                languages: languageId,

            },
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




import { ImageDelete } from "../helpFnc.js";

$("#CreateForm").submit(function (e) {
    e.preventDefault();
    var caseId = $("#caseId").val();

    let base64 = $("#croppedImage").attr("src");

    $.ajax({
        type: "POST",
        url: "/Media/ImageUploadBase64",
        data: {
            base64: base64,
            _imageFolderPath: "wwwroot/uploads/CaseSlides/"
        },
        success: function (response) {
            if (!response.success) {
                ImageDelete(response.data, "wwwroot/uploads/CaseSlides/");
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }

            if (response.success) {
                CreateFormData(response.data);// ekleme işlemini başlat
            }
        }
    });

    function CreateFormData(MediaName) {

        let CaseVM = {
            Name: $("#Name").val(),
            OrderNo: $("#OrderNo").val(),
            caseId: caseId,
            MediaName: MediaName,
        }


        $.ajax({
            type: "POST",
            url: "/CaseSlide/CreateJson",
            async: false,
            data: {
                CaseSlide: CaseVM,
            },
            success: function (response) {
                responseError(response.errors);

                if (!response.success) {
                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                }

                if (response.success) {
                    iziToast.success({ timeout: 2500, title: 'Successfuly!', message: response.message });
                    $("#CreateForm")[0].reset();
                    $("#croppedImage").attr("src", "/Panel/img/warning.jpg");
                    $("#MediaFile").val(null);
                }
            }
        });
    }

});
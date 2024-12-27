import { ImageDelete } from "../helpFnc.js";

$("#CreateForm").submit(function (e) {
    e.preventDefault();

    let base64 = $("#croppedImage").attr("src");

    $.ajax({
        type: "POST",
        url: "/Media/ImageUploadBase64",
        data: {
            base64: base64,
            _imageFolderPath: "wwwroot/uploads/cases/"
        },
        success: function (response) {
            if (!response.success) {
                ImageDelete(response.data, "wwwroot/uploads/cases/");
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }

            if (response.success) {
                CreateFormData(response.data);// ekleme işlemini başlat
            }
        }
    });

    function CreateFormData(MediaName) {

        let doctorId = $("#DoctorId").val(),
            categoryId = $("#CategoryId").val(),
            CaseId = $("#CaseId").val(),
            sections = $("#SectionId").val(),
            languageId = $("#LanguageId").val(),
            OrderNo = $("#OrderNo").val(),
            CaseVM = {
                Name: $("#Name").val(),
                MediaName: MediaName,
            };

        var data = {
            icase: CaseVM,
            doctors: doctorId,
            // categories: categoryId,
            cases: CaseId,
            sections: sections
        }
        if (languageId != null) {
            data.languages = languageId;
        }

        if(categoryId != null){
            data.categories = categoryId;
        }



        $.ajax({
            type: "POST",
            url: "/Case/CreateJson",
            async: false,
            data: data,
            success: function (response) {
                responseError(response.errors);

                if (!response.success) {
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
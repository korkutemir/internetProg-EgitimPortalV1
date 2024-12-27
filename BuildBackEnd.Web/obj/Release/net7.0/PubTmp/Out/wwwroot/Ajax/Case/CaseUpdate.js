import { ImageDelete } from "../helpFnc.js";

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
        ImageDelete(oldMediaName, "wwwroot/uploads/cases/");
    }

    $.ajax({
        type: "POST",
        url: "/Media/ImageUploadBase64",
        data: {
            base64: base64,
            _imageFolderPath: "wwwroot/uploads/cases/"
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

        console.log("#DoctorId", $("#DoctorId").val());
        // return;
        let doctorId = $("#DoctorId").val(),
            categoryId = $("#CategoryId").val(),
            sectionId = $("#SectionId").val(),
            languageId = $("#LanguageId").val(),
            OrderNo = $("#OrderNo").val(),
            CaseVM = {
                Id: $("#Id").val(),
                Name: $("#Name").val(),
                MediaName: MediaName,
            };
            
        var data = {
            CaseUpdate: CaseVM,
            doctors: doctorId,
            // categories: categoryId,
            sections: sectionId,
        }
        if (languageId != null) {
            data.languages = languageId;
        }

        if (categoryId != null) {
            data.categories = categoryId;
        }


        $.ajax({
            type: "POST",
            url: "/Case/UpdateJson",
            async: false,
            data: {
                CaseUpdate: CaseVM,
                languages: $("#LanguageId").val(),
                doctors: doctorId,
                categories: categoryId,
                sections: sectionId,

            },
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
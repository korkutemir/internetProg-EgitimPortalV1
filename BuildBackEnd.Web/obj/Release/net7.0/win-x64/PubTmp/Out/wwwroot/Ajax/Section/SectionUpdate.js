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
        ImageDelete(oldMediaName, "wwwroot/uploads/sections/");
    }

    $.ajax({
        type: "POST",
        url: "/Media/ImageUploadBase64",
        data: {
            base64: base64,
            _imageFolderPath: "wwwroot/uploads/sections/"
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
     SectionVM = {
        Id: $("#Id").val(),
        Name: $("#Name").val(),
        MediaName: MediaName,
        OrderNo: $("#OrderNo").val(),

    };

    let data = {
        sectionUpdate: SectionVM,
    }

    if (languageId != null) {
        data.languages = languageId;
    }

    $.ajax({
        type: "POST",
        url: "/Section/UpdateJson",
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
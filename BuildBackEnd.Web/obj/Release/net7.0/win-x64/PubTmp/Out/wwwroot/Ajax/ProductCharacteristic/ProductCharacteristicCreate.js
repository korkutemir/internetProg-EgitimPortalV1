



$("#CreateForm").submit(function (e) {
    e.preventDefault();
    var pdfFile = $("#file1")[0].files[0];

    //Dosya boyutu kontrolü
    if (pdfFile.size > 900242880) { 
        alert("The file size is too large. The max file size should be 900 MB.");
        $("#pdfFile").val(null);
        return;
    }

    var formData = new FormData();
    formData.append("uploadedFile", pdfFile);
    formData.append("_pdfFolderPath", "wwwroot/uploads/ProductCharacteristics");

    var ajax = new XMLHttpRequest();
    ajax.upload.onprogress = function (Event) {
        var percent = (Event.loaded / Event.total) * 100;
        $("#loaded_n_total").html("Uploaded " + Event.loaded + " bytes of " + Event.total);
        $("#progressBar").val(Math.round(percent));
        $("#status").html(Math.round(percent) + "% uploaded... please wait");
    };

    ajax.onload = function (Event) {
        $("#progressBar").val(0);
        $("#status").html("");

        var response = Event.target.response.replace(/['"]+/g, '');

        CreateFormData(response);
    };

    ajax.onerror = function (Event) {
        iziToast.warning({ timeout: 1500, title: 'Error!', message: "Upload Failed" });
    };

    ajax.onabort = function (Event) {
        $("#status").html("Upload Aborted");
    };

    ajax.open("POST", "/Media/PdfUploadJson");
    ajax.setRequestHeader('X-XSRF-Token', $('input[name="__RequestVerificationToken"]').val());
    ajax.send(formData);
});

function CreateFormData(PdfMediaName) {
    var CharacteristicVM = {
        MediaName: PdfMediaName,
        LanguageId: $("#LanguageId").val(),
        ProductId: $("#ProductId").val(),
    };
    console.log(CharacteristicVM);

    $.ajax({
        type: "POST",
        url: "/ProductDocument/CreateJson",
        data: {
            Characteristic: CharacteristicVM,
        },
        success: function (response) {
            responseError(response.errors);
            if (response.success) {
                window.location = "/ProductCharacteristic/"+$("#ProductId").val();
                iziToast.success({ timeout: 1500, title: 'Successfully!', message: response.message });
            } else {
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }
        }
    });
}
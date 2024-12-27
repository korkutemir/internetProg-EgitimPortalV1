

// $("#CreateForm").submit(function (e) {
//     e.preventDefault();

//     if($("#pdfFile").val() == null){
//         iziToast.warning({ timeout: 1500, title: 'Error!', message: "Please select a pdf file." });
//         return;
//     }

//     let base64 = $("#croppedImage").attr("src");

//     $.ajax({
//         type: "POST",
//         url: "/Media/ImageUploadBase64",
//         data: {
//             base64: base64,
//             _imageFolderPath: "wwwroot/uploads/Characteristics/"
//         },
//         async: false,
//         success: function (responseBase64) {
//             if (!responseBase64.success) {
//                 iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
//             }

//             if (responseBase64.success) {
    
//                 var formData = new FormData();
//                 formData.append('uploadedFile', $('#pdfFile')[0].files[0]);
//                 formData.append("_pdfFolderPath", "wwwroot/uploads/Characteristics/");

//                 $.ajax({
//                     url: '/Media/PdfUploadJson',
//                     type: 'POST',
//                     data: formData,
//                     processData: false,
//                     contentType: false,
//                     async: false,
//                     success: function (response) {
//                         CreateFormData(responseBase64.data, response);
//                     },
//                 });
//                 CreateFormData(responseBase64.data);// kleme işlemini başlat
//                 // ekleme işlemini başlat
//             }
//         }
//     });




 








//     function CreateFormData(MediaName, PdfMediaName) {

//         var CharacteristicVM = {
//             Name: $("#Name").val(),
//             MediaName: MediaName,
//             PdfMediaName: PdfMediaName,
//             LanguageId: $("#LanguageId").val(),
//             CategoryId: $("#ProductGroupId").val(),
//             OrderNo: $("#OrderNo").val(),
//         }


//         $.ajax({
//             type: "POST",
//             url: "/Characteristic/CreateJson",
//             data: {
//                 Characteristic: CharacteristicVM,
//             },
//             success: function (response) {
//                 responseError(response.errors);
//                 if (response.success) {
//                     window.location = "/Characteristic/";
//                     iziToast.success({ timeout: 1500, title: 'Successfuly!', message: response.message });
//                 }
//                 else {
//                     iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
//                 }

//             }
//         });
//     }

// });




$("#CreateForm").submit(function (e) {
    e.preventDefault();
    var pdfFile = $("#file1")[0].files[0];

    //Dosya boyutu kontrolü
    if (pdfFile.size > 900242880) { // 5 MB
        alert("The file size is too large. The maximum file size should be 5 MB.");
        $("#pdfFile").val(null);
        return;
    }

    var formData = new FormData();
    formData.append("uploadedFile", pdfFile);
    formData.append("_pdfFolderPath", "wwwroot/uploads/Characteristics");

    var ajax = new XMLHttpRequest();
    ajax.upload.onprogress = function(Event) {
        var percent = (Event.loaded / Event.total) * 100;
        $("#loaded_n_total").html("Uploaded " + Event.loaded + " bytes of " + Event.total);
        $("#progressBar").val(Math.round(percent));
        $("#status").html(Math.round(percent) + "% uploaded... please wait");
    };

    ajax.onload = function(Event) {
        $("#progressBar").val(0);
        $("#status").html("");

        var response = Event.target.response.replace(/['"]+/g, '');

        var imageData = $("#croppedImage").attr("src");

        $.post("/Media/ImageUploadBase64", {
            base64: imageData,
            _imageFolderPath: "wwwroot/uploads/Characteristics/"
        }, function(responseBase64) {
            if (responseBase64.success) {
                CreateFormData(responseBase64.data, response);
            } else {
                iziToast.warning({ timeout: 1500, title: 'Error!', message: responseBase64.message });
            }
        });
    };

    ajax.onerror = function(Event) {
        iziToast.warning({ timeout: 1500, title: 'Error!', message: "Upload Failed" });
    };

    ajax.onabort = function(Event) {
        $("#status").html("Upload Aborted");
    };

    ajax.open("POST", "/Media/PdfUploadJson");
    ajax.setRequestHeader('X-XSRF-Token', $('input[name="__RequestVerificationToken"]').val());
    ajax.send(formData);
});

function CreateFormData(MediaName, PdfMediaName) {
    var CharacteristicVM = {
        Name: $("#Name").val(),
        MediaName: MediaName,
        PdfMediaName: PdfMediaName,
        LanguageId: $("#LanguageId").val(),
        CategoryId: $("#ProductGroupId").val(),
        OrderNo: $("#OrderNo").val(),
    };

    $.ajax({
        type: "POST",
        url: "/Characteristic/CreateJson",
        data: {
            Characteristic: CharacteristicVM,
        },
        success: function (response) {
            responseError(response.errors);
            if (response.success) {
                window.location = "/Characteristic/";
                iziToast.success({ timeout: 1500, title: 'Successfully!', message: response.message });
            } else {
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }
        }
    });
}
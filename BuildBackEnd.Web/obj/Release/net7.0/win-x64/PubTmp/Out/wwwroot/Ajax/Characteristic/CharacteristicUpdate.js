// import { ImageDelete } from "../helpFnc.js";

// $(function () {


//     $("#UpdateForm").submit(function (e) {
//         e.preventDefault();
//         let base64 = $("#croppedImage").attr("src");




//         let oldMediaNamePath = $("#oldMediaNamePath").val(),
//             oldMediaName = $("#oldMediaName").val(),
//             oldCharacteristic = $("#oldCharacteristic").val();


//         if (oldMediaNamePath == base64) {
//             CreateFormData(oldMediaName);
//             return;
//         }
//         else {
//             ImageDelete(oldMediaName, "wwwroot/uploads/Characteristics/");
//         }

//         $.ajax({
//             type: "POST",
//             url: "/Media/ImageUploadBase64",
//             data: {
//                 base64: base64,
//                 _imageFolderPath: "wwwroot/uploads/Characteristics/"
//             },
//             success: function (response) {
//                 if (!response.success) {
//                     iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
//                 }

//                 if (response.success) {
//                     CreateFormData(response.data);// ekleme işlemini başlat
//                 }
//             }
//         });





//         function CreateFormData(MediaName) {
//             let pdfFileNameSend;
//             if ($("#pdfFile").val() != null && $("#pdfFile").val() != "" && $("#pdfFile").val() != undefined) {
//                 alert("pdfFile");
//                 ImageDelete(oldCharacteristic, "wwwroot/uploads/Characteristics/");
//                 var formData = new FormData();
//                 formData.append('uploadedFile', $('#pdfFile')[0].files[0]);
//                 formData.append("_pdfFolderPath", "wwwroot/uploads/Characteristics");

//                 $.ajax({
//                     url: '/Media/PdfUploadJson',
//                     type: 'POST',
//                     data: formData,
//                     processData: false,
//                     contentType: false,
//                     async: false,
//                     success: function (response) {
//                         pdfFileNameSend = response;
//                     },
//                 });
//             }


//             var CharacteristicUpdateVM = {
//                 Name: $("#Name").val(),
//                 MediaName: MediaName,
//                 PdfMediaName: pdfFileNameSend ?? oldCharacteristic,
//                 Id: $("#Id").val(),
//                 LanguageId: $("#LanguageId").val(),
//                 CategoryId: $("#ProductGroupId").val(),
//                 OrderNo: $("#OrderNo").val(),
//             }

//             $.ajax({
//                 type: "POST",
//                 url: "/Characteristic/UpdateJson",
//                 data: {
//                     CharacteristicUpdate: CharacteristicUpdateVM
//                 },
//                 async: false,
//                 success: function (response) {
//                     if (response.success) {
//                         window.location = "/Characteristic/";
//                         iziToast.success({ timeout: 1500, title: 'Successfuly!', message: response.message });
//                     }
//                     else {
//                         iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
//                     }

//                 }
//             });
//         };


//     });









// });



import { ImageDelete } from "../helpFnc.js";

$(function () {
    $("#UpdateForm").submit(function (e) {
        e.preventDefault();
        let base64 = $("#croppedImage").attr("src");

        let oldMediaNamePath = $("#oldMediaNamePath").val(),
            oldMediaName = $("#oldMediaName").val(),
            oldCharacteristic = $("#oldCharacteristic").val();

        if (oldMediaNamePath == base64) {
            handlePdfUpload(oldMediaName);
            return;
        } else {
            ImageDelete(oldMediaName, "wwwroot/uploads/Characteristics/");
        }

        $.ajax({
            type: "POST",
            url: "/Media/ImageUploadBase64",
            data: {
                base64: base64,
                _imageFolderPath: "wwwroot/uploads/Characteristics/"
            },
            success: function (response) {
                if (!response.success) {
                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                }

                if (response.success) {
                    handlePdfUpload(response.data);
                }
            }
        });

        function handlePdfUpload(mediaName) {
            let pdfFileNameSend;

            if ($("#file1").val() != null && $("#file1").val() != "" && $("#file1").val() != undefined) {
                ImageDelete(oldCharacteristic, "wwwroot/uploads/Characteristics/");

                var formData = new FormData();
                formData.append('uploadedFile', $('#file1')[0].files[0]);
                formData.append("_pdfFolderPath", "wwwroot/uploads/Characteristics/");

                $.ajax({
                    url: '/Media/PdfUploadJson',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    xhr: function () {
                        var xhr = new window.XMLHttpRequest();
                        xhr.upload.addEventListener("progress", function (evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = evt.loaded / evt.total * 100;
                                $("#progressBar").val(percentComplete);
                                $("#status").text(Math.round(percentComplete) + "% uploaded... please wait");
                                $("#loaded_n_total").text("Uploaded " + evt.loaded + " bytes of " + evt.total);
                            }
                        }, false);
                        return xhr;
                    },
                    success: function (response) {

                        pdfFileNameSend = response;
                        createFormData(mediaName, pdfFileNameSend);
                    }
                });
            } else {
                createFormData(mediaName, oldCharacteristic);
            }
        }

        function createFormData(mediaName, pdfMediaName) {
            var CharacteristicUpdateVM = {
                Name: $("#Name").val(),
                MediaName: mediaName,
                PdfMediaName: pdfMediaName,
                Id: $("#Id").val(),
                LanguageId: $("#LanguageId").val(),
                CategoryId: $("#ProductGroupId").val(),
                OrderNo: $("#OrderNo").val(),
            };
             console.log(CharacteristicUpdateVM);

            $.ajax({
                type: "POST",
                url: "/Characteristic/UpdateJson",
                data: {
                    CharacteristicUpdate: CharacteristicUpdateVM
                },
                async: false,
                success: function (response) {
                    if (response.success) {
                        window.location = "/Characteristic/";
                        iziToast.success({ timeout: 1500, title: 'Successfully!', message: response.message });
                    } else {
                        console.log(response);
                        iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                    }
                }
            });
        }
    });
});






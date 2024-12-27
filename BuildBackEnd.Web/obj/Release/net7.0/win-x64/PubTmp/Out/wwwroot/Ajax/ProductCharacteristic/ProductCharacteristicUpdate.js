import { ImageDelete } from "../helpFnc.js";

$(function () {
    $("#UpdateForm").submit(function (e) {
        e.preventDefault();

        let   oldCharacteristic = $("#oldCharacteristic").val();


        handlePdfUpload();


        function handlePdfUpload() {
            let pdfFileNameSend;

            if ($("#file1").val() != null && $("#file1").val() != "" && $("#file1").val() != undefined) {
                ImageDelete(oldCharacteristic, "wwwroot/uploads/ProductCharacteristics/");

                var formData = new FormData();
                formData.append('uploadedFile', $('#file1')[0].files[0]);
                formData.append("_pdfFolderPath", "wwwroot/uploads/ProductCharacteristics/");

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
                        createFormData(pdfFileNameSend);
                    }
                });
            } else {
                createFormData(oldCharacteristic);
            }
        }

        function createFormData(pdfMediaName) {
            var CharacteristicUpdateVM = {
                LanguageId: $("#LanguageId").val(),
                ProductId: $("#ProductId").val(),
                MediaName: pdfMediaName,
                Id: $("#Id").val(),
            };
             console.log(CharacteristicUpdateVM);

            $.ajax({
                type: "POST",
                url: "/ProductDocument/UpdateJson",
                data: {
                    CharacteristicUpdate: CharacteristicUpdateVM
                },
                async: false,
                success: function (response) {
                    if (response.success) {
                        window.location = "/ProductCharacteristic/"+$("#ProductId").val();
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






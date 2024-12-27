import { ImageDelete } from "../helpFnc.js";

$(document).ready(function () {



    $("#UpdateForm").submit(async function (e) {
        e.preventDefault();

        let base64 = $("#croppedImage").attr("src");
        let baseCover64 = $("#croppedCoverImage").attr("src");
    
        let oldMediaNamePath = $("#oldMediaNamePath").val();
        let oldMediaName = $("#oldMediaName").val();
    
        let oldMediaCoverNamePath = $("#oldMediaCoverNamePath").val();
        let oldMediaCoverName = $("#oldMediaCoverName").val();
    
        try {
            if (oldMediaCoverNamePath == baseCover64 && oldMediaNamePath == base64) {
                return CreateFormData(oldMediaName, oldMediaCoverName);
            } else if (oldMediaCoverNamePath != baseCover64 && oldMediaNamePath == base64) {
                var data = await uploads(baseCover64);
                CreateFormData(oldMediaName, data);
            } else if (oldMediaCoverNamePath == baseCover64 && oldMediaNamePath != base64) {
                var data = await uploads(base64);
                CreateFormData(data, oldMediaCoverName);
            } else {

    
                ImageDelete(oldMediaCoverName, "wwwroot/uploads/groups/");
                ImageDelete(oldMediaName, "wwwroot/uploads/groups/");
                var data = await uploads(base64);
                var dataCover = await uploads(baseCover64);
                CreateFormData(data, dataCover);
            }
        } catch (error) {
            console.error("Error during image upload: ", error);
        }

        function uploads(base64) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: "POST",
                    url: "/Media/ImageUploadBase64",
                    data: {
                        base64: base64,
                        _imageFolderPath: "wwwroot/uploads/groups/"
                    },
                    success: function (response) {
                        if (!response.success) {
                            iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                            reject(response.message);
                        } else {
                            resolve(response.data);
                        }
                    },
                    error: function (error) {
                        iziToast.error({ timeout: 1500, title: 'AJAX Error!', message: 'An error occurred while uploading the image.' });
                        reject(error);
                    }
                });
            });
        }
        


        function CreateFormData(MediaName, MediaCoverName) {

            let languageId = $("#LanguageId").val(),
                categoryVM = {
                    Name: $("#Name").val(),
                    Id: $("#Id").val(),
                    CategoryParentId: $("#CategoryId").val(),
                    MediaName: MediaName,
                    MediaCoverName: MediaCoverName,
                    OrderNo: $("#OrderNo").val(),
                };

            let data = {
                categoryUpdate: categoryVM,
            }

            if (languageId != null) {
                data.languages = languageId;
            }

            $.ajax({
                type: "POST",
                url: "/Category/UpdateJson",
                data: data,
                success: function (response) {

                    responseError(response.errors);

                    if (!response.success) {
                        ImageDelete(response.data);
                        iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                    }


                    if (response.success) {
                        if (languageId != null) {
                            translationFormData();
                        }
                        iziToast.success({ timeout: 1500, title: 'Successfuly!', message: response.message });
                    }

                }
            });
        }

    });






    function translationFormData() {
        var translationsData = [];
        $('input.language-code-inputs').each(function () {
            var translation = {
                Id: $("#Id").val(),
                LanguageCode: $(this).data('language-code'),
                Name: $(this).val(),
            };
            translationsData.push(translation);
        });
        console.log(translationsData);

        $.ajax({
            type: "POST",
            url: "/Category/Translation",
            data: JSON.stringify(translationsData), // Düzeltme burada yapıldı
            contentType: "application/json",
            success: function (response) {
                if (response.success) {
                    console.log("Çeviri:" + response.message);
                    window.location.href = "/ProductGroup/";
                }
                else {
                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                }
            }
        });
    }



});





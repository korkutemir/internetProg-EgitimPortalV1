import { ImageDelete } from "../helpFnc.js";

$(document).ready(function () {

    $("#UpdateForm").submit(function (e) {
        e.preventDefault();

        var role = $("#Role").val();
        if(role == 2 && $("#CountryId").val() == null){
            iziToast.warning({ timeout: 1500, title: 'Error!', message: "Country is required!" });
            return;
        }

        let base64 = $("#croppedImage").attr("src");


        let oldMediaNamePath = $("#oldMediaNamePath").val();
        let oldMediaName = $("#oldMediaName").val();

        if (oldMediaNamePath == base64) {
            CreateFormData(oldMediaName);
            return;
        }
        else {
            ImageDelete(oldMediaName, "wwwroot/uploads/country/");
        }

        $.ajax({
            type: "POST",
            url: "/Media/ImageUploadBase64",
            data: {
                base64: base64,
                _imageFolderPath: "wwwroot/uploads/country/"
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
        var CountryVM = {
            Name: $("#Name").val(),
            MediaName: MediaName,
            Id: $("#Id").val(),
        }

        $.ajax({
            type: "POST",
            url: "/Country/UpdateJson",
            data: {
                countryUpdate: CountryVM
            },
            success: function (response) {
                if (response.success) {
                    window.location = "/Country/";
                    iziToast.success({ timeout: 1500, title: 'Successfuly!', message: response.message });
                }
                else {
                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                }

            }
        });
    }
});


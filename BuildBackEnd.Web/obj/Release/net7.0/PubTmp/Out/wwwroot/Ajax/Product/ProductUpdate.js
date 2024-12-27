import { ImageDelete } from "../helpFnc.js";


$("#UpdateForm").submit(function (e) {
    e.preventDefault();
    let base64 = $("#croppedImage").attr("src");


    let oldMediaNamePath = $("#oldMediaNamePath").val();
    let oldMediaName = $("#oldMediaName").val();

    if (oldMediaNamePath == base64) {
        return CreateFormData(oldMediaName);
    }
    else {
        ImageDelete(oldMediaName, "wwwroot/uploads/products/");
    }

    $.ajax({
        type: "POST",
        url: "/Media/ImageUploadBase64",
        data: {
            base64: base64,
            _imageFolderPath: "wwwroot/uploads/products/"
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

        let languageId = $("#LanguageId").val(),
            countryId = $("#CountryId").val(),
            categoryId = $("#CategoryId").val(),
            productCategoryId = $("#ProductCategoryId").val(),
            ProductVM = {
                Id: $("#Id").val(),
                Name: $("#Name").val(),
                MediaName: MediaName,
                SketchfabLink: $("#SketchfabLink").val(),
                OrderNo: $("#OrderNo").val(),
            };

        var data = {
            product: ProductVM,
            languages: languageId,
            countries: countryId,
            categories: categoryId,
        }

        if (productCategoryId != null) {
            data.productgroup = productCategoryId;
        }

        if (languageId != null) {
            data.languages = languageId;
        }


        $.ajax({
            type: "POST",
            url: "/Product/UpdateJson",

            data: data,
            success: function (response) {
                responseError(response.errors);

                if (!response.success) {
                    ImageDelete(response.data);
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



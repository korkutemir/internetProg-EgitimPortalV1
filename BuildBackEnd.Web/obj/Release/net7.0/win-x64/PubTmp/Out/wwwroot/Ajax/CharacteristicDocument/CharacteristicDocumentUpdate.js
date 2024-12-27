

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
                CreateFormData(response.data);// ekleme işlemini başlat
            }
        }
    });





    function CreateFormData(MediaName) {

        var CharacteristicVM = {
            CharacteristicId: $("#characteristicId").val(),
            MediaName: MediaName,
            OrderNo: $("#OrderNo").val(),
            Id: $("#Id").val(),
        }


        $.ajax({
            type: "POST",
            url: "/CharacteristicDocument/UpdateDocumentsJson",
            data: {
                document: CharacteristicVM,
            },
            success: function (response) {
                responseError(response.errors);
                if (response.success) {
                    window.location = "/CharacteristicDocumentsHome/"+ $("#characteristicId").val();
                    iziToast.success({ timeout: 1500, title: 'Successfuly!', message: response.message });
                }
                else {
                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                }

            }
        });
    }

});
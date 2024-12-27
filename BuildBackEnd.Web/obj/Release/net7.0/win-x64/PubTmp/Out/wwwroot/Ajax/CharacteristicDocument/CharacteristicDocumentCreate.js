

$("#CreateForm").submit(function (e) {
    e.preventDefault();

    let base64 = $("#croppedImage").attr("src");

    $.ajax({
        type: "POST",
        url: "/Media/ImageUploadBase64",
        data: {
            base64: base64,
            _imageFolderPath: "wwwroot/uploads/Characteristics/"
        },
        success: function (responseBase64) {
            if (!responseBase64.success) {
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }

            if (responseBase64.success) {
                CreateFormData(responseBase64.data);
            }
        }
    });




    function CreateFormData(MediaName) {

        var CharacteristicVM = {
            CharacteristicId: $("#characteristicId").val(),
            MediaName: MediaName,
            OrderNo: $("#OrderNo").val(),
        }


        $.ajax({
            type: "POST",
            url: "/CharacteristicDocument/CreateDocumentJson",
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
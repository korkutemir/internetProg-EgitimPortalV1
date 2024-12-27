function ImageDelete(mediaName, imageFolderPath) {
    $.ajax({
        type: "POST",
        url: "/Media/FileDelete",
        data: {
            mediaName: mediaName,
            _imageFolderPath: imageFolderPath
        },
        success: function (response) {
            if (response.success) {
                console.log(response.message);
            }
            else {
                console.log(response.message);
            }
        }
    });
}

export {  ImageDelete };
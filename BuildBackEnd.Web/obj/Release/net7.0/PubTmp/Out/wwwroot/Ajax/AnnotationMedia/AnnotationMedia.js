import { ImageDelete } from "../helpFnc.js";




$("#upload_form").submit(function (e) {

    e.preventDefault();
    var file = $("#file1")[0].files[0];


    // Dosya boyutu kontrolü
    if (file.size > 5048576) {
        alert("The file size is too large. The maximum file size should be 5 MB.");
        $("#file1").val(null);
        return; // İşlemi durdur
    }


    var formdata = new FormData();
    formdata.append("uploadedFile", file);
    formdata.append("_imageFolderPath", "wwwroot/uploads/products/annotations");

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
        $.post("/AnnotationMedia/CreateJson", {
            Name: Event.target.response.replace(/['"]+/g, ''),
            MediaType: 2,
            AnnotationId: $("#AnnotationId").val()
        }, function (response) {
            window.location.href = window.location;
        });
    };

    ajax.onerror = function (Event) {
        iziToast.warning({ timeout: 1500, title: 'Error!', message: "Upload Failed" });
    };

    ajax.onabort = function (Event) {
        $("#status").html("Upload Aborted");
    };

    ajax.open("POST", "/Media/VideoUploadJson");
    ajax.setRequestHeader('X-XSRF-Token', $('input[name="__RequestVerificationToken"]').val());
    ajax.send(formdata);
});




$("#image_file")[0].files[0];
$("#upload_form_image").submit(function (e) {
    e.preventDefault();


    var image_files = $("#image_file")[0].files;


    var durum = true;
    for (var i = 0; i < image_files.length; i++) {
        if (image_files[i].size > 1048576) {
            iziToast.warning({ timeout: 8000, title: 'Error!', message: image_files[i].name+ ": Dosya boyutu çok büyük! Maksimum dosya boyutu 1 MB olmalıdır." });
            durum = false;
            return;
        }
    }


    if (!durum) {
        return;
    }


    var image_file = $("#image_file")[0].files[0]; // Dosyayı doğru şekilde al


    var formdata = new FormData();
    formdata.append("image", image_file);
    formdata.append("_imageFolderPath", "wwwroot/uploads/products/annotations");


    $.ajax({
        type: "POST",
        url: "/Media/ImageUpload",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (response) {

            if (response.success) {
                $.ajax({
                    type: "POST",
                    url: "/AnnotationMedia/CreateJson",
                    data: {
                        Name: response.data,
                        MediaType: 1,
                        AnnotationId: $("#AnnotationId").val()
                    },
                    success: function (response) {
                        var url = window.location;
                        window.location.href = url;
                    }
                });

            }

            if (!response.success) {
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }

        }
    });

});













$(".deleteButton").click(function (e) {
    e.preventDefault();



    var id = $(this).data("id");
    var name = $(this).data("name");



    iziToast.question({
        timeout: 20000,
        close: false,
        overlay: true,
        displayMode: 'once',
        id: 'question',
        zindex: 999,
        title: 'Hey',
        message: 'Are you sure about that?',
        position: 'center',
        buttons: [
            ['<button><b>YES</b></button>', function (instance, toast) {

                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                try {
                    ImageDelete(name, "wwwroot/uploads/products/annotations/");
                } catch (error) {
                    console.log(error);
                }

                $.ajax({
                    type: "Post",
                    url: "/AnnotationMedia/DeleteJson",
                    data: {
                        id: id,
                    },
                    success: function (response) {

                        if (response.success) {
                            var url = window.location;
                            window.location.href = url;
                        }

                        if (!response.success) {
                            iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                        }

                    }
                });

            }, true],
            ['<button>NO</button>', function (instance, toast) {

                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

            }],
        ],
        onClosing: function (instance, toast, closedBy) {
            console.info('Closing | closedBy: ' + closedBy);
        },
        onClosed: function (instance, toast, closedBy) {
            console.info('Closed | closedBy: ' + closedBy);
        }
    });




});

$(".saveButton").click(function (e) {
    e.preventDefault();



    var id = $(this).data("id");
    var name = $(this).data("name");



    iziToast.question({
        timeout: 20000, close: false, overlay: true, displayMode: 'once', id: 'question', zindex: 999, title: 'Hey', message: 'Are you sure about that?', position: 'center', buttons: [
            ['<button><b>YES</b></button>', function (instance, toast) {

                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');


                $.ajax({
                    type: "Post",
                    url: "/AnnotationMedia/DeleteJson",
                    data: {
                        id: id,
                    },
                    success: function (response) {
                        if (!response.success) {
                            iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                        }

                    }
                });



                $.ajax({
                    type: "POST",
                    url: "/Media/DownloadAndSaveImageJson",
                    data: {
                        image: name,
                        _imageFolderPath: "wwwroot/uploads/products/annotations"
                    },
                    success: function (response) {
                        if (!response.success) {
                            iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                        }

                        if (response.success) {
                            $.ajax({
                                type: "POST",
                                url: "/AnnotationMedia/CreateJson",
                                data: {
                                    Name: response.data,
                                    MediaType: 1,
                                    AnnotationId: $("#AnnotationId").val()
                                },
                                success: function (response) {

                                    if (response.success) {
                                        var url = window.location;
                                        window.location.href = url;
                                    }

                                    if (!response.success) {
                                        iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                                    }
                                }
                            });

                        }


                    }
                });




            }, true],
            ['<button>NO</button>', function (instance, toast) {

                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

            }],
        ],
        onClosing: function (instance, toast, closedBy) {
            console.info('Closing | closedBy: ' + closedBy);
        },
        onClosed: function (instance, toast, closedBy) {
            console.info('Closed | closedBy: ' + closedBy);
        }
    });
});
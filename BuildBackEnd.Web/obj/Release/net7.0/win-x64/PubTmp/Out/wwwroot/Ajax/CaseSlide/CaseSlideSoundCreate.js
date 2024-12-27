$("#upload_form").submit(function (e) {
    const caseId = $("#caseId").val();
    const caseSlideId = $("#caseSlideId").val();
    
    e.preventDefault();
    var file = $("#file1")[0].files[0];


    // Dosya boyutu kontrolü
    if (file.size >5048576) {
        alert("The file size is too large. The maximum file size should be 5 MB.");
        $("#file1").val(null);
        return; // İşlemi durdur
    }


    var formdata = new FormData();
    formdata.append("uploadedFile", file);
    formdata.append("_imageFolderPath", "wwwroot/uploads/CaseSlides");

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
        $.post("/CaseSlide/CreateMediaJson", {
            MediaName: Event.target.response.replace(/['"]+/g, ''),
            MediaType: 0,
            CaseSlideId: $("#caseSlideId").val(),
            languageId: $("#LanguageId").val(),
        }, function(response) {
            window.location.href = "/CaseSlide/CaseSlideHome/" + caseId;

        });
    };

    ajax.onerror = function(Event) {
        iziToast.warning({ timeout: 1500, title: 'Error!', message: "Upload Failed" });
    };

    ajax.onabort = function(Event) {
        $("#status").html("Upload Aborted");
    };

    ajax.open("POST", "/Media/SoundUploadJson");
    ajax.setRequestHeader('X-XSRF-Token', $('input[name="__RequestVerificationToken"]').val());
    ajax.send(formdata);
});
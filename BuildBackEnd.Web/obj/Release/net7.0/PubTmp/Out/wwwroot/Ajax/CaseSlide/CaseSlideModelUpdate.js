$("#UpdateForm").submit(function (e) {
    e.preventDefault();
    var caseId = $("#caseId").val();

    let CaseVM = {
        Id: $("#Id").val(),
        MediaName: $("#ModelId").val(),
        CaseSlideId: $("#CaseSlideId").val(),
        languageId: $("#LanguageId").val(),
        MediaType: 2,
    }


    $.ajax({
        type: "POST",
        url: "/CaseSlide/CreateMediaJson",
        async: false,
        data: {
            CaseSlideUpdate: CaseVM,
        },
        success: function (response) {
            responseError(response.errors);

            if (!response.success) {
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }

            if (response.success) {
                iziToast.success({ timeout: 2500, title: 'Successfuly!', message: response.message });
                window.location.href = "/CaseSlide/CaseSlideHome/" + caseId;

            }
        }
    });


});
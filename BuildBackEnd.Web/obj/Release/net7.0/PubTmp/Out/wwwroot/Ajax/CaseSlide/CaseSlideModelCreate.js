$("#CreateForm").submit(function (e) {
    e.preventDefault();
    var caseId = $("#caseId").val(),
        caseSlideId = $("#caseSlideId").val();

    let CaseVM = {
        MediaName: $("#ModelId").val(),
        CaseSlideId: caseSlideId,
        languageId: null,
        MediaType: 2,
    }


    $.ajax({
        type: "POST",
        url: "/CaseSlide/CreateMediaJson",
        data: {
            CaseSlideMedia: CaseVM,
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
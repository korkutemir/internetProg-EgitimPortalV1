$('#CreateForm').submit(function (e) {
    e.preventDefault();
    const role = $('#Role').val();
    var model = {
        Name: $('#Name').val(),
        Surname: $('#Surname').val(),
        UserName: $('#UserName').val(),
        Email: $('#Email').val(),
        Phone: $('#Phone').val(),
        Password: $('#Password').val(),
        ConfirmPassword: $('#ConfirmPassword').val(),
        Role: role,
        CountryIds: $('#CountryId').val(),
    };


    if (role == 2 && model.CountryIds == null) {
        iziToast.warning({ timeout: 4000, icon: 'fas fa-exclamation-triangle', title: "error", message: "Please select a country responsible" });
        return;
    }


    $.ajax({
        url: '/User/UserAddJson',
        type: 'POST',
        data:{
            model: model,
            countryResponsibleIds: $('#CountryResponsibleId').val() ?? null
        },
        success: function (response) {
            if (response.success) {
                iziToast.success({ timeout: 4000, icon: 'fas fa-check', title: "Sucessfully!", message: response.message });

                window.location = "/User/";
            }

            if (!response.success) {
                console.log(response);
                responseError(response.errors);
                iziToast.warning({ timeout: 4000, icon: 'fas fa-exclamation-triangle', title: "error", message: response.message });
            }
        },
        error: function (error) {
            console.log("Hata :", error);
        }
    });
});
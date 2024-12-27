$('#UpdateForm').submit(function (e) {
    e.preventDefault();
    const role = $('#Role').val();
    var model = {
        Id: $('#userId').val(),
        Name: $('#Name').val(),
        Surname: $('#Surname').val(),
        UserName: $('#UserName').val(),
        Email: $('#Email').val(),
        Phone: $('#Phone').val(),
        Password: $('#Password').val(),
        ConfirmPassword: $('#ConfirmPassword').val(),
        Role: role,
        CurrentPassword: $('#CurrentPassword').val(),
        CategoryIds: $('#CategoryId').val(),

    };
    
    if (role == 2 && model.CategoryIds == null) {
        iziToast.warning({ timeout: 4000, icon: 'fas fa-exclamation-triangle', title: "error", message: "Please select a Category responsible" });
        return;
    }


    $.ajax({
        url: '/User/UserUpdateJson',
        type: 'POST',
        data:{
            model: model,
            CategoryResponsibleIds: $('#CategoryResponsibleId').val() ?? null
        },
        success: function (response) {
            if (response.success) {
                window.location = "/User/";
                iziToast.success({ timeout: 4000, icon: 'fas fa-check', title: "Successfully!", message: response.message });
            }

            if (!response.success) {
                console.log(response);
                // iziToast.warning({ timeout: 4000, icon: 'fas fa-exclamation-triangle', title: "error", message: response.message });
                // responseError(response.errors);
            }
        },
        error: function (error) {
            console.log("Hata :", error);
        }
    });
});
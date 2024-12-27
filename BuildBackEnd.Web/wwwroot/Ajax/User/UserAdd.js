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
        CategoryIds: $('#CategoryId').val(),
    };


    if (role == 2 && model.CategoryIds == null) {
        iziToast.warning({ timeout: 4000, icon: 'fas fa-exclamation-triangle', title: "error", message: "Please select a Category responsible" });
        return;
    }


    $.ajax({
        url: '/User/UserAddJson',
        type: 'POST',
        data:{
            model: model,
            CategoryResponsibleIds: $('#CategoryResponsibleId').val() ?? null
        },
        success: function (response) {
            if (response.success) {
                alert(response.message);
                window.location = "/Home/";
            }

            if (!response.success) {
                console.log(response);
                // responseError(response.errors);
                alert(response.message);
            }
        },
        error: function (error) {
            console.log("Hata :", error);
        }
    });
});
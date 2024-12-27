
$("#signInForm").submit(function (e) {
    e.preventDefault();

    var formData = $("#signInForm").serialize();
    $.ajax({
        type: "POST",
        url: "/Member/SignIn",
        data: formData,
        dataType: "json",
        success: function (response) {
            if (!response.success) {
                alert(response.message);
            }


            if (response.success) {
               alert(response.message);
                setTimeout(function () {
                     window.location = "/Home/Index";
                }, 1500);
            }

        }
    });

});

$(document).ready(function () {

    // Burada 1 numaralı ID'ye sahip öğeyi seçiyoruz.

    $("#UpdateForm").submit(function (e) {
        e.preventDefault();
        var KioskVM = {
            Id: $("#Id").val(),
            Name: $("#Name").val(),
            SerialNumber: $("#SerialNumber").val(),
            Password: $("#Password").val(),
            KioskNumber: $("#KioskNumber").val(),
            CountryId: $("#CountryId").val(),
            Active: $("#ActiveCheckDefault").is(":checked"),
            UserAgent: $("#UserAgent").val(),
            IpAddress: $("#IpAddress").val()
        }

        $.ajax({
            type: "POST",
            url: "/Kiosk/UpdateJson",
            data: {
                KioskUpdate: KioskVM
            },
            success: function (response) {
                if (response.success) {
                    window.location = "/Kiosk/";
                    iziToast.success({ timeout: 1500, title: 'Successfuly!', message: response.message });
                }
                else {
                console.log(response);

                    iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                }

            }
        });

    });
});


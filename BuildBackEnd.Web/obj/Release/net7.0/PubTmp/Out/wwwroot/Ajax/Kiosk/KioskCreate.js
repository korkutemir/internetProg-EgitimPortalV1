

$("#CreateForm").submit(function (e) { 
    e.preventDefault();
    let KioskVM ={
        Name: $("#Name").val(),
        SerialNumber: null,
        Password: $("#Password").val(),
        KioskNumber: $("#KioskNumber").val(),
        Active: $("#ActiveCheckDefault").is(":checked"),
        CountryId: $("#CountryId").val(),
    };
    $.ajax({
        type: "POST",
        url: "/Kiosk/CreateJson",
        data: {
            Kiosk: KioskVM
        },
        success: function (response) {
            responseError(response.errors);
            if(response.success){
                window.location = "/Kiosk/";
                iziToast.success({timeout: 1500, title: 'Successfuly!', message: response.message});
            }
            else{
                iziToast.warning({timeout: 1500, title: 'Error!', message: response.message});
            }
            
        }
    });
    
});
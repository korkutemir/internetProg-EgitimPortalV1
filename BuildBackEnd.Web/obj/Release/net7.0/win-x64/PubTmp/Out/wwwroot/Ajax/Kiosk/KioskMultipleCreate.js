

$("#CreateForm").submit(function (e) { 
    e.preventDefault();
    let KioskVM ={
        KioskCount: $("#KioskCount").val(),
        Name: $("#Name").val(),
        Active: $("#ActiveCheckDefault").is(":checked"),
        CountryId: $("#CountryId").val(),
    };
    $.ajax({
        type: "POST",
        url: "/Kiosk/CreateMultipleJson",
        data: {
            Kiosk: KioskVM
        },
        success: function (response) {
            responseError(response.errors);
            if(response.success){
                console.log(response);
                // iziToast.success({timeout: 1500, title: 'Successfuly!', message: response.message});

                var base64Data = response.file;
                downloadBase64File('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', base64Data, 'KioskData.xlsx');

                window.location = "/Kiosk/";
            }
            else{
                console.log(response);

            }
            
        }
    });
    
});


function downloadBase64File(contentType, base64Data, fileName) {
    // Base64 verisini decode ederek byte array'ine çeviriyoruz
    var byteCharacters = atob(base64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += 512) {
        var slice = byteCharacters.slice(offset, offset + 512);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    // Blob nesnesi oluşturuyoruz
    var blob = new Blob(byteArrays, { type: contentType });

    // Blob URL'si oluşturuyoruz
    var blobUrl = URL.createObjectURL(blob);

    // window.location.href = blobUrl;

    // Link elemanı oluşturup indirme işlemini başlatıyoruz
    var link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    // Link elemanını DOM'dan kaldırıyoruz
    document.body.removeChild(link);

    // Blob URL'sini serbest bırakıyoruz
    URL.revokeObjectURL(blobUrl);
}
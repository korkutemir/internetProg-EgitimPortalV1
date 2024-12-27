function reloadDataTable() {
    $('#example').DataTable().ajax.reload();
    iziToast.success({ timeout: 5000, icon: 'fa-solid fa-check', position: 'bottomRight', title: 'Renewed!', message: 'Successfully renewed!' });
}


function createFormDataFromInput(elementId) {
    // Element ID'sine göre dosya giriş elementini al
    var fileInput = document.getElementById(elementId);
    // Seçilen dosyayı al (birden fazla dosya seçimi destekleniyorsa, files[0] ilk dosyayı alır)
    var file = fileInput.files[0];

    // Yeni bir FormData nesnesi oluştur
    var formData = new FormData();
    // FormData nesnesine dosyayı ekle ("file" anahtarıyla)
    formData.append("file", file);

    // Oluşturulan FormData nesnesini döndür
    return formData;
}
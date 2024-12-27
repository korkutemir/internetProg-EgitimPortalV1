var languageCode = $('#languageCode').val();

// JSON dosyasından çevirileri çek
$.ajax({
    url: '/Language/GetTranslations',  // JSON dosyasının çevirilerini çeken endpoint
    type: 'POST',
    data: { languageCode: languageCode },
    success: function(response) {
        console.table   (response);
        // Çevirileri al ve form alanlarını doldur
        for (var key in response) {
            $('#' + key).val(response[key]);
        }
    },
    error: function(xhr, status, error) {
        console.error('Çeviriler yüklenirken bir hata oluştu: ' + xhr.responseText);
    }
});
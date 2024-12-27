$(function () {
    
    $('.annotation--textarea--description').each(function () {
         new Jodit(this, {
            language: 'en' // İngilizce dil ayarı
        });
    });
});
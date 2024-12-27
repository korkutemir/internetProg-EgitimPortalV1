$(document).ready(function() {
    var viewer = new Viewer(document.querySelector('.image-gallery'), {
        navbar: true, // Üstteki gezinti çubuğunu göster
        toolbar: true, // Araç çubuğunu göster
        title: true // Resim başlıklarını göster
    });
});

$("#example").on("click", "tbody td.dt-control", function() {
     var viewer = new Viewer(document.querySelector('.image-gallery'), {
        navbar: true, // Üstteki gezinti çubuğunu göster
        toolbar: true, // Araç çubuğunu göster
        title: true // Resim başlıklarını göster
    }); 
});
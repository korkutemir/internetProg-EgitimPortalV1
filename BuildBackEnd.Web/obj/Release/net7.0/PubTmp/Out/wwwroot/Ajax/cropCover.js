// Resim seçme olayı dinleyicisi
document.getElementById('MediaCoverFile').addEventListener('change', function (Event) {
    

    var data_width = $(this).data('width');
    var data_height = $(this).data('height');
    var data_aspectRatio = data_width / data_height;

    var input = Event.target;
    var reader = new FileReader();

    reader.onload = function () {
        var dataURL = reader.result;
        var imagePreviewCover = document.getElementById('imagePreviewCover');
        imagePreviewCover.src = dataURL;

        // Modalı göster
        $('#cropCoverModal').modal('show');

        // Modal gösterildiğinde Cropper.js'i başlat
        $('#cropCoverModal').on('shown.bs.modal', function () {
            $("body").css("overflow", "hidden");
            var cropper = new Cropper(imagePreviewCover, {
                aspectRatio: data_aspectRatio,
                viewMode: 1,
                dragMode: 'move',
                cropBoxResizable: false,
                autoCropArea: 1, // Kırpma alanını otomatik olarak maksimum yap
            });

            // Yakınlaştırma butonu olay dinleyicisi
            // document.getElementById('zoomInButton').addEventListener('click', function () {
            //     cropper.zoom(0.1);
            // });

            // // Uzaklaştırma butonu olay dinleyicisi
            // document.getElementById('zoomOutButton').addEventListener('click', function () {
            //     cropper.zoom(-0.1);
            // });

            // // Sola döndürme butonu olay dinleyicisi
            // document.getElementById('rotateLeftButton').addEventListener('click', function () {
            //     cropper.rotate(-90);
            // });

            // // Sağa döndürme butonu olay dinleyicisi
            // document.getElementById('rotateRightButton').addEventListener('click', function () {
            //     cropper.rotate(90);
            // });

            // // Crop sıfırlama butonu olay dinleyicisi
            // document.getElementById('resetcropCoverButton').addEventListener('click', function () {
            //     cropper.reset();
            // });

            // Kırpma butonu olay dinleyicisi
            document.getElementById('cropCoverButton').addEventListener('click', function () {
                $("body").css("overflow", "unset");

                // Kırpma verilerini al ve croppedCanvas değişkeni olarak tanımla
                var croppedCanvas = cropper.getCroppedCanvas({
                    width: data_width,
                    height: data_height
                });

                // Canvas'dan Blob olarak görüntüyü al
                croppedCanvas.toBlob(function (blob) {
                    var imageSize = blob.size / 1024 / 1024; // Boyutu MB cinsinden hesapla

                    if (imageSize > 1) { // Eğer görüntü boyutu 2 MB'dan büyükse
                        alert("Kırpılan resim boyutu 1 MB'dan büyük olamaz. Lütfen daha küçük bir alan seçin.");
                        cropper.reset(); // Cropper'ı sıfırla
                    } else {
                        // Kırpılan resmi görüntüle
                        var croppedCoverImage = document.getElementById('croppedCoverImage');
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            croppedCoverImage.src = e.target.result;
                            $("#croppedCoverImageHref").attr("href", e.target.result);
                            $("#croppedCoverImage").attr("src", e.target.result);
                        };
                        reader.readAsDataURL(blob);

                        // Modalı gizle
                        $('#cropCoverModal').modal('hide');

                        // Cropper.js'i temizle
                        cropper.destroy();
                    }
                }, 'image/jpeg');
            });

            $("#closeCoverCrop").click(function () {
                $('#cropCoverModal').modal('hide');
                cropper.destroy();
                $("#MediaCoverFile").val(null);
                $("body").css("overflow", "unset");
            });
        });
    };

    reader.readAsDataURL(input.files[0]);
});

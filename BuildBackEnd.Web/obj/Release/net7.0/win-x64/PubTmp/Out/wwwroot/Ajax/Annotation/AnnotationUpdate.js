

function submitTranslationData() {
    let annotationId = $("#Id").val();
    // TranslationsData dizisini oluştur
    var translationsData = [];

    // Tüm dil kodu inputlarını döngüye al
    $('.language-code-inputs').each(function () {
        var languageCode = $(this).data('language-code');
        var nameValue = $(this).val();

        // Aynı dil koduna sahip textarea'yı bul
        var descriptionValue = $('textarea.language-code-textareas[data-language-code="' + languageCode + '"]').val();

        var translation = {
            Id: annotationId,
            LanguageCode: languageCode,
            Name: nameValue,
            Description: descriptionValue, // Açıklama bilgisi eklendi
        };

        // Diziye ekle
        translationsData.push(translation);
    });

    // AJAX ile sunucuya gönder
    $.ajax({
        type: "POST",
        url: "/Annotation/Translation",
        data: JSON.stringify(translationsData), // Veriyi JSON string olarak gönder
        contentType: "application/json", // İçerik tipini belirt
        success: function (response) {
            // Başarılı yanıt geldiğinde işlemler
            if (response.success) {
                console.log("Translation successful: " + response.message);
                window.location.href = "/Product/Index"; // Sayfayı ürün listesi sayfasına yönlendir
            } else {
                // Yanıt başarısız olduğunda uyarı göster
                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
            }
        }
    });
}



$("#UpdateForm").submit(function (e) {
    e.preventDefault();

    const productId = $("#ProductId").val();
    var request = {
        Id: $("#Id").val(),
        Name: $("#Name").val(),
        Description: $("#Description").val(),
        OrderNo: $("#OrderNo").val(),
        ProductId: productId
    };

    $.ajax({
        type: "POST",
        url: "/Annotation/UpdateJson",
        data: request,
        success: function (response) {
            if (!response.success) {
                iziToast.warning({ timeout: 4000, icon: 'fas fa-times', title: 'Warning!', message: response.message });
            }

            if (response.success) {
                iziToast.success({ timeout: 4000, icon: 'fas fa-check', title: 'Success!', message: response.message });
                submitTranslationData();
                return;
                window.location.href = "/Product/Index";
            }

        }
    });

});



$("#getDataAgainBtn").click(function (e) {

    var modelId = $(this).data("model-id"), // Model ID'yi al
        id = $(this).data("id"),
        order = $(this).data("order");

    iziToast.question({
        timeout: 20000, close: false, overlay: true, displayMode: 'once', id: 'question', zindex: 999, title: 'Hey', message: 'When you perform the data extraction, the saved English data will be reset and the unsaved pictures will be deleted?', position: 'center', buttons: [
            ['<button><b>YES</b></button>', function (instance, toast) {



                $(".loading-overlay").css({ "visibility": "visible", "opacity": "0.5" });


                try {
                    var version = '1.12.1'; // Sketchfab API versiyonu
                    var iframe = document.getElementById('api-frame'); // iframe elementini al
                    var client = new window.Sketchfab(version, iframe); // Sketchfab API client'ını oluştur

                    // // Hata fonksiyonu
                    var error = function () {
                        alert('Sketchfab API error');
                        $(".loading-overlay").css({ "visibility": "hidden", "opacity": "0" });

                    };

                    // Başarı fonksiyonu
                    var success = function (api) {
                        api.start(function () {
                            api.addEventListener('viewerready', function () {
                                $(".loading-overlay").css({ "visibility": "hidden", "opacity": "0" });

                                // Hata fonksiyonu
                                var error = function () {
                                    alert('Sketchfab API error');
                                    $(".loading-overlay").css({ "visibility": "hidden", "opacity": "0" });

                                };

                                api.getAnnotationList(function (err, annotations) {
                                    var annotaiton = {};

                                    if (err) {
                                        console.log('Error getting annotations');
                                    }

                                    if (!err) {
                                        annotations.forEach(function (annotation, index) {

                                            if (index != order) {
                                                return;
                                            }
                                            var parser = new DOMParser();
                                            var doc = parser.parseFromString(annotation.content.rendered, 'text/html');


                                            // Hem span.lazyload hem de img etiketlerini seç
                                            var imageElements = doc.querySelectorAll('span.lazyload, img');
                                            var imageLinks = Array.from(imageElements).map(function (element) {
                                                var imageLink;
                                                if (element.tagName.toLowerCase() === 'span') {
                                                    imageLink = element.getAttribute('data-uri');
                                                    // Span'ı DOM'dan kaldır
                                                    element.parentNode.removeChild(element);
                                                } else if (element.tagName.toLowerCase() === 'img') {
                                                    imageLink = element.getAttribute('src');
                                                    // Img'yi DOM'dan kaldır
                                                    element.parentNode.removeChild(element);
                                                }

                                                // URL'den gereksiz boşlukları ve satır sonu karakterlerini kaldır
                                                imageLink = imageLink.replace(/\s+/g, '').replace(/\\n/g, '');
                                                return imageLink;
                                            });

                                            var cleanedContent = doc.body.innerHTML; // Temizlenmiş içeriği al

                                            var images = [];

                                            imageLinks.forEach(function (imageLink) { images.push(imageLink); });

                                            annotaiton = {
                                                OrderNo: order,
                                                Name: annotation.name,
                                                Description: cleanedContent,
                                                Images: images,
                                                productId: $("#ProductId").val()
                                            };
                                            console.log(annotaiton);


                                        });



                                    }

                                    $.ajax({
                                        type: "POST",
                                        url: "/Annotation/getAnnotationDataAgainJson",
                                        data: {
                                            annotationId: id,
                                            annotation: annotaiton,
                                        },
                                        success: function (response) {
                                            $(".loading-overlay").css({ "visibility": "hidden", "opacity": "0" });

                                            if (!response.success) {
                                                iziToast.warning({ timeout: 1500, title: 'Error!', message: response.message });
                                            }

                                            if (response.success) {

                                                iziToast.success({ timeout: 1500, title: 'Success!', message: response.message });
                                                window.location = "/Product"
                                            }
                                        }
                                    });


                                });

                                // Animasyonları oynatma (Örnek)
                                api.getAnimations(function (err, animations) {
                                    if (!err && animations.length > 0) {
                                        api.setCurrentAnimationByUID(animations[0][0]);
                                        api.pause(function (err) {
                                            if (!err) {
                                                console.log('Animation paused');
                                            }
                                        });
                                    }
                                });
                            });
                        });
                    };

                    // Sketchfab API'sini model ID ile başlat
                    client.init(modelId, {
                        success: success,
                        error: error,
                        autostart: 1,
                        preload: 0,
                        // Diğer gerekli konfigürasyonlar...
                    });






                } catch (e) {
                    alert('Sketchfab API error');
                    $("#annotationInputs").empty();
                    $(".loading-overlay").css({ "visibility": "hidden", "opacity": "0" });
                }






                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');






            }, true],
            ['<button>NO</button>', function (instance, toast) {
                instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            }],
        ]
    });

});
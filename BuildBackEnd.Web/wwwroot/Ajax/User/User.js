function validateUserNameInput(e) {
    var key = e.charCode || e.keyCode || 0;

    // İzin verilenler: rakamlar, harfler, backspace, tab, enter, boşluk karakteri hariç
    return (
        (key >= 48 && key <= 57) || // rakamlar
        (key >= 65 && key <= 90) || // büyük harfler
        (key >= 97 && key <= 122) || // küçük harfler
        key == 8 || // backspace
        key == 9 || // tab
        key == 13 // enter
    ) && key != 32; // boşluk karakteri hariç
}

$('#UserName').keypress(validateUserNameInput);




$("#Role").change(function (e) {
    e.preventDefault();

    if ($(this).val() == 1) {
        $(".Category-col").css("display", "none");
        $(this).attr("required", true);
        return;
    }

    $(".Category-col").css("display", "block");
    $(this).removeAttr("required");

});



$("#CategoryId").select2({
    ajax: {
        url: "/Category/GetCategorySelect",
        dataType: 'json',
        delay: 250,
        data: function (params) {
            var query = params.term || '';
            return {
                q: query,
                page: params.page || 1
            };
        },
        processResults: function (data, params) {
            params.page = params.page || 1;
            return {
                results: $.map(data.items, function (item) {
                    return {
                        id: item.id,
                        text: item.name,
                    };
                }),
                pagination: {
                    more: ((params.page * 10) < data.total_count)
                }
            };
        },
        cache: true
    },
    theme: "bootstrap-5",
    width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    placeholder: $(this).data('placeholder'),
    allowClear: true
});
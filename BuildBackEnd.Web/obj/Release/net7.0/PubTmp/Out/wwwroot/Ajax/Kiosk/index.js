$("#CountryId").select2({
    ajax: {
        url: "/Country/GetCountrySelect",
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
                    if (item.languageCode != "en") {
                        return {
                            id: item.id,
                            text: item.name,
                        };
                    }
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



$(function () {
    var dateFormat = "mm/dd/yy",
        from = $("#from")
            .datepicker({
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1,
                dateFormat: dateFormat,
                monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
                    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
                dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
                dayNamesShort: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
                dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
                weekHeader: 'Hf',
                firstDay: 1, // Haftanın ilk günü olarak Pazartesi'yi ayarlar
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''

            })
            .on("change", function () {
                to.datepicker("option", "minDate", getDate(this));
            }),
        to = $("#todate").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
            monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
                'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
            dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
            dayNamesShort: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
            dayNamesMin: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
            weekHeader: 'Hf',
            firstDay: 1, // Haftanın ilk günü olarak Pazartesi'yi ayarlar
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ''

        })
            .on("change", function () {
                from.datepicker("option", "maxDate", getDate(this));
            });

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }
        return date;
    }
});
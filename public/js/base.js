// Match Height
$(function() {
    $('.rail_container > div').matchHeight();
    $('#contact_page .departments .department-inner').matchHeight();
});

// Event Index service select
$(function() {
    $('#event_index form select[name="service"]').change(function() {
        $(this).parent('form').submit();
    });
});

// Pikaday Calendar
$(document).ready(function() {
    var field = $('#datepicker');
    var base_url = field.attr('data-base-url');
    //document.getElementById('datepicker');
    if (field) {
        var picker = new Pikaday({
            defaultDate: new Date(field.attr('data-year'), field.attr('data-month'), field.attr('data-date')),
            setDefaultDate: new Date(field.attr('data-year'), field.attr('data-month'), field.attr('data-date')),
            onSelect: function(date) {
                window.location.href = base_url +
                    '?y=' + date.getFullYear() +
                    "&m=" + (date.getMonth() + 1) +
                    "&d=" + date.getDate() +
                    "#events";
            },
            disableDayFn: function(date) {
                if (!window.available_calendar_dates) {
                    return false;
                }
                var doDisable = true;
                available_calendar_dates.forEach(function(element, index, array) {
                    if (element.date === date.getDate() && element.months === date.getMonth() && element.years === date.getFullYear()) {
                        doDisable = false;
                    }
                });
                return doDisable;
            },
            onDraw: function() {
                if (window.available_calendar_dates) {
                    available_calendar_dates.forEach(function(element, index, array) {
                        $('[data-pika-year="' + element.years + '"][data-pika-month="' + element.months + '"][data-pika-day="' + element.date + '"]').parent().addClass('active');
                    });
                }
            }
        });

        field.append(picker.el);
    }

});

// Navbar Stickiness
$(document).ready(function() {
    var navBar = $('.navbar');
    var offsetTop = $('.navbar').offset().top;
    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();
        if (scrollTop >= offsetTop) {
            $('body').addClass('stickyNav');
        } else {
            $('body').removeClass('stickyNav');
        }
    });
});

// Phone Number Recognition
$(document).ready(function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

        var countrycodes = "1"
        var delimiters = "-|\\.|—|–|&nbsp;"
        var phonedef = "\\+?(?:(?:(?:" + countrycodes + ")(?:\\s|" + delimiters + ")?)?\\(?[2-9]\\d{2}\\)?(?:\\s|" + delimiters + ")?[2-9]\\d{2}(?:" + delimiters + ")?[0-9a-z]{4})"
        var spechars = new RegExp("([- \(\)\.:]|\\s|" + delimiters + ")", "gi") //Special characters to be removed from the link
        var phonereg = new RegExp("((^|[^0-9])(href=[\"']tel:)?((?:" + phonedef + ")[\"'][^>]*?>)?(" + phonedef + ")($|[^0-9]))", "gi")

        function ReplacePhoneNumbers(oldhtml) {
            //Created by Jon Meck at LunaMetrics.com - Version 1.0
            var newhtml = oldhtml.replace(/href=['"]callto:/gi, 'href="tel:');
            newhtml = newhtml.replace(phonereg, function($0, $1, $2, $3, $4, $5, $6) {
                if ($3) return $1;
                else if ($4) return $2 + $4 + $5 + $6;
                else return $2 + "<a href='tel:" + $5.replace(spechars, "") + "' class='phone-number'>" + $5 + "</a>" + $6;
            });
            return newhtml;
        }

        if ($(".contact").length > 0) {
            $(".contact").html(ReplacePhoneNumbers($(".contact").html()));
        }

        if ($(".department").length > 0) {
            $(".department").html(ReplacePhoneNumbers($(".department").html()));
        }

        if ($("#footer").length > 0) {
            $("#footer").html(ReplacePhoneNumbers($("#footer").html()));
        }
    }

    function replaceEmails(element) {
        
        var regEx = /(\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)/;
        
        $(element).filter(function() {
            return $(this).html().match(regEx);
        }).each(function() {
            $(this).html($(this).html().replace(regEx, "<a href=\"mailto:$1\">$1</a>"));
        });

    }

    if ($(".contact").length > 0) {
        $(".contact").html(replaceEmails('.contact'));
    }

    if ($(".department").length > 0) {
        $(".department").html(replaceEmails('.department'));
    }

    if ($("#footer").length > 0) {
        $("#footer").html(replaceEmails('#footer'));
    }

    if ($(".resources").length > 0) {
        var revealClass = window.location.href.toString().split('/')[4];
        $('.'+revealClass).removeClass('invisible');
    }
});

$(function() {

 	var $shareThisElems = $('.share_this .contents span');

 	$.each($shareThisElems, function(index, item){

 		var itemUrl   = window.location.protocol + '//' + window.location.host + $(item).attr('st_url'),
 			itemTitle = $(item).attr('st_title'); 

 		$(item).attr('st_url', itemUrl);
 		$(item).attr('st_title', 'Check out this page: '+ itemTitle + ': ');
 		$(item).attr('st_summary', 'Check out this page: '+ itemTitle + ': ');
 		$(item).attr('st_image', window.location.protocol + '//' + window.location.host + '/images/bellefaire-general-icon.png');
 	});


});

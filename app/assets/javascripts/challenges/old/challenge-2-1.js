var lesson = "2-1";

jQuery(function($) {
  question('Instead of a confirm() for the "reserve a seat" function, use a prompt() that asks for the reservation name. Use jQuery.ajax() via POST to submit the value to a "/reservations" with "success" callback that adds the reservation to the reservation list.');
});

function isSeatReserved(seat) {
  console.log(lesson + " isSeatReserved");
  return $(seat).attr('data-reserved') == 'true';
}

function removeReservation(e) {
  console.log(lesson + " removeReservation");
  if (isSeatReserved(this)) {
    e.stopImmediatePropagation();
    if (confirm('Already Reserved! Clear Reservation?')) {
      $(this).removeAttr('data-reserved').removeClass('reserved');
      $(this).unbind('click', confirmReserveSeat);
    }
  }
}

function removeSeatFromReservation(e) {
  $(this).parent().remove();
}

function displayPrice(e) {
  $(this).html("$99");
}

function hidePrice(e) {
  if(!isSeatReserved(this)) {
    $(this).html("");
  }
}

function reserveSeat(seat) {
  console.log(lesson + " reserveSeat");
  $(seat).attr('data-reserved', 'true').addClass("reserved");
  $("#reservations").append("<li>Row 1, Seat 4. <a href='#' class='remove'>remove</a></li>");
}



jQuery(function($) {
  $('.row li:not(.aisle)').bind('click', removeReservation);
  $('#reservations a.remove').live('click', removeSeatFromReservation);  
  $('.row').delegate('li:not(.aisle)', 'hover', displayPrice);
  $('.row').delegate('li:not(.aisle)', 'mouseleave', hidePrice);
});



jQuery(function($) {
  $('.row li:not(.aisle)').bind('click', function (e) {
    var reservationName = prompt('Provide a name for your reservation');
    if (reservationName) {
      $.ajax('/reservations', {
        type: 'POST',
        success: function() {
          reserveSeat(this)
        }
      });
    }
  });
});
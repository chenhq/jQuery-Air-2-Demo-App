jQuery(function($) {
  question("Finish the selectSeat function. Make an Ajax call to reserve the seat.");

  /* Starts with

  function selectSeat(event) {
    event.preventDefault();

    var flight_id = 815;
    var seat = $(this).data('seat');

    $.ajax('/flights/' + flight_id + '/reserve', {
      type: 'post',
      dataType: 'json',
      data: { seat: seat },
      success: function(result) {
        // example result: {'confirmation': '3DF9Q4'}
        // show #reservations and update #confirmation-number
      }
    });
  }

  */

  /* resources */

  function setSeat(element) {
    $('.selected').removeClass('selected').click(selectSeat);
    $(element).addClass('selected').unbind('click', selectSeat);
    $('#seatSelected').text($(element).data('seat'));
  }

  $('div.seating-chart ol.economy-class li a.available').click(selectSeat);

  /* answer */

  function selectSeat(e) {
    e.preventDefault();

    var flight_id = 815;
    var seat = $(this).data('seat');

    $.ajax('/flights/' + flight_id + '/reserve', {
      type: 'post',
      dataType: 'json',
      data: { seat: seat },
      success: function(result) {
        setSeat(e.target);
        $('#reservations').show();
        $('#confirmation-number').text(result.confirmation);
      }
    });
  }
});

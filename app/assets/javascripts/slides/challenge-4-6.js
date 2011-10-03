jQuery(function($) {

  var lesson = "4-6";

  question("Encapsulate and organize the methods here better");
  
  $.fn.addToolTip = function() {
    return this.bind({
      mouseenter: function(e) {
        var tip = $(e.target).data('tooltip');  
        $("<span class='tooltip'>" + tip + "</span>").appendTo(e.target).delay(100).fadeIn();
      },
      mouseleave: function(e) {
        $(e.target).find('span.tooltip').stop().fadeOut(function(){ 
          $(this).remove(); 
        });
      }
    });
  }
  
  
  var selectFlights = {
    fetchingFlights : null,
    
    init : function() {
      $("#tabs ul li a").addToolTip();

      $("#tabs ul li a").bind({
        click: this.changeTab
      });

      $("#tabs #error a").click(function (e){
        e.preventDefault();
        this.showFlights($("#tabs li a.active").attr("href"));
      });

      $("#tabs div").delegate('#flights a', 'click', this.selectFlight);
      $("#tabs ul li:eq(2) a").click();

      $('#confirm #login form').submit(confirmFlight.login);
    },
    
    // Tabbing and listing flights
    
    showFlights : function(active_div) {
      $("#tabs div").hide();
      if (selectFlights.fetchingFlights) {
        selectFlights.fetchingFlights.abort();
      }
      selectFlights.fetchingFlights = $.ajax('/flights.json', {  
        data: { date: active_div },
        cache: false, 
        beforeSend: function(result) {
          $('#tabs #loading').show();
        },
        complete: function(result) {
          $('#tabs #loading').hide();
          selectFlights.fetchingFlights = null;
        },
        success: function(flights) {
          $(active_div + ' tbody td').remove();
          $( "#flightTemplate2" ).tmpl( flights ).appendTo(active_div + ' tbody');
          $('#tabs #error').hide();
          $(active_div).show();
        },
        error: function(result) {
          if (result.statusText != "abort") { 
            $('#tabs #error').show();
          }
        }
      });
    },
    
    changeTab : function(e) {
      e.preventDefault();
      $("#tabs li a.active").removeClass("active").click(selectFlights.changeTab);
      $(e.target).addClass("active").unbind("click", selectFlights.changeTab);

      selectFlights.showFlights($(e.target).attr("href"));
    },
    
    selectFlight : function(e) {
      e.preventDefault();
      $("#tabs a.selected").removeClass('selected');
      $(e.target).toggleClass('selected');

      var flight = $(e.target).data('flight');
      var flightClass = $(e.target).data('class');
      
      // Would be the second half, in the new component... confirmFlight fetchFlightInfo
      confirmFlight.init(flight, flightClass);
    }
  }
  
  var confirmFlight = {
    
    init : function(flight, flightClass) {
      $('#confirm').hide();

      $.ajax('/flights/' + flight, {
        data: { 'class': flightClass },
        dataType: 'json',
        success: confirmFlight.showTotal
      });
    },
    
    // Selecting a flight
    showTotal : function(json) {
      $('#price').text(json.price);
      $('#fees').text(json.fees);
      $('#total').text(json.total);
      $('#confirm').slideDown();
      $('#confirm').queue(function() {
        $(this).find("input[type=email]").focus();
        $(this).dequeue();
      });
    },
    
    // login and confirm button
    login : function(e) {
      e.preventDefault();
      var form = $(e.target).serialize();

      $('#login').fadeOut();

      $.ajax('/login', {  
        data: form + "&lesson=3-5",
        dataType: 'script',
        type: 'post'
      });
    }
  }
  
  selectFlights.init();

});
/*~~~~~~~~~~~~~~~~~~ ALL ~~~~~~~~~~~~~~~~~~*/
$(document).ready( function() {
    /** Load Header **/
    $.get("/header", function (data) {
        $("#header").html(data);
    });
  $('[data-toggle=collapse]').click( function() {

    var caret = $(this).find('i');
    caret.toggleClass('fa-caret-right');
    caret.toggleClass('fa-caret-down');
	});


 $(document).on('click', '.tool-view-button', function (e) {
	 e.preventDefault();
	  $("div.tool-div").removeClass("current");
	  var href = $(this).attr("href");
	  $(this).parent(".tool-view-btn").parent(".tool-div").addClass("current");
   
      window.location = href;
 });

  $(':button').click(function () {
      if ($(this).html() === 'SAVE CHANGES') {
          $('#status').val('started'); 
      }
      else {
          $('#status').val('completed');
      }
      
 });


	function ShowDialog(id) {
		var myPos = { my: "center top", at: "center top+50", of: window };
		$("#"+ id).removeClass("hide");
		$("#" + id).dialog({
			autoOpen: true,
			appendTo: "#s-page",
			height: 'auto',
			width: 300,
			position: myPos,
			modal: true,
			title: "Example " ,
			fluid: true,
			closeText: 'X',
			
			buttons: {
				"OK": function () {

					$(this).dialog("close");


				}

			},
			close: function () {
			}
		});
	}
/*~~~~~~~~~~~~~~~~~~ determine_your_approach.html ~~~~~~~~~~~~~~~~~~*/
    $('#Prob_Appr_B').change(function () {
        var value = $(this).val();
        var subject = "subjects";        

    var otherSpecify = $("#other-specify");

    if (value === "other") otherSpecify.show();
    else otherSpecify.hide();
    if (value != "Select an option" && value != "other") {
        subject = value;
    }
        if (value !== "other") {
        $(".section-c-header").text(subject);
    }
    else {
        $(".section-c-header").text("subjects");

    }
    });
    
    $('#Prob_Appr_A').change(function () {
        var a = $(this).val();
        var c = $("#Prob_Appr_C").val();
        var b = $("#Prob_Appr_B").val();
		var p1 = $(".p1"), p2 = $(".p2"), p3 = $(".p3");
        if ((a === "Yes") && c === "No" && b !== "Select an option") {
            p2.show(); p1.hide(); p3.hide();
        }
        else if (a === "No" && c === "No" && b !== "Select an option") {
            p3.show(); p1.hide(); p2.hide();
        }
        else if ((a === "Yes" && c === "Yes" && b !== "Select an option") || (a === "No" && c === "Yes" && b !== "Select an option")) {
            p1.show(); p3.hide(); p2.hide();
        }
        else { p1.hide(); p2.hide(); p3.hide(); }
    });

    $('#Prob_Appr_C').change(function () {
        var c = $(this).val();
		var a = $("#Prob_Appr_A").val(); 
        var b = $("#Prob_Appr_B").val();
		var p1 = $(".p1"), p2 = $(".p2"), p3 = $(".p3");
        if ((a === "Yes") && c === "No" && b !== "Select an option") {
            p2.show(); p1.hide(); p3.hide();
        }
        else if (a === "No" && c === "No" && b !== "Select an option") {
            p3.show(); p1.hide(); p2.hide();
        }
        else if ((a === "Yes" && c === "Yes" && b !== "Select an option") || (a === "No" && c === "Yes" && b !== "Select an Option")) {
            p1.show(); p3.hide(); p2.hide();
        }
        else { p1.hide(); p2.hide(); p3.hide(); }
    });

	$("#Prob_Appr_B").change(function () {
		var b = $(this).val();
		var c = $("#Prob_Appr_C").val();
        var a = $("#Prob_Appr_A").val();
		var p1 = $(".p1"), p2 = $(".p2"), p3 = $(".p3");
        if ((a === "Yes") && c === "No" && b !== "Select an option") {
            p2.show(); p1.hide(); p3.hide();
        }
        else if (a === "No" && c === "No" && b !== "Select an option") {
            p3.show(); p1.hide(); p2.hide();
        }
        else if ((a === "Yes" && c === "Yes" && b !== "Select an option") || (a === "No" && c === "Yes" && b !== "Select an Option")) {
            p1.show(); p3.hide(); p2.hide();
        }
        else { p1.hide(); p2.hide(); p3.hide(); }
    });

  
    $(".section-c-header").text(function () {
        var subject = "subjects";
        var value = $("#Prob_Appr_B").val();
        if (value == "other") {
            $("#other-specify").show();
            subject = $("#Prob_Appr_B_other").val();
        }
        
        if (value != "Select an option" && value != "other") {
            subject = value;
        }
        return subject;
     }
    );
  


  $("#Prob_Appr_B_other").keyup( function() {
      var value = $(this).val();
      $(".section-c-header").text(value);   
  });


/*~~~~~~~~~~~~~~~~~~ craft_your_research_q.html ~~~~~~~~~~~~~~~~~~*/


  $('#Plan_Question_B_1').change( function() {
    var value = $(this).val();

    var otherSpecify = $("#Question_B_Other");

    if (value === "Other") otherSpecify.show();
    else otherSpecify.hide();

    if (value !== "Other" && value !== "Select an option") {
        $(".q11answer").text(value);
    }
    else {
        $(".q11answer").text("B");
    }
  });

  $("#Plan_Question_B_Other").keyup( function() {
    var value = $(this).val();
    $(".q11answer").text(value);
  });


  $('#Plan_Question_A').keyup( function() {
    var value = $(this).val();
    $('.q1answer').text(value);
  });

  //$('#q11').change( function() {
  //  var value = $(this).val();
  //  $('.q11answer').text(value);
  //});

  $('#Plan_Question_B_3').change( function() {
    var value = $(this).val();
    $('.q12aanswer').text(value);
  });  

  $('#Plan_Question_C').keyup( function() {
    var value = $(this).val();
    $('.q8answer').text(value);
  });

  $('#Plan_Question_D').keyup( function() {
    var value = $(this).val();
    $('.qdanswer').text(value);
  });    


/*~~~~~~~~~~~~~~~~~~  plan_next_steps.html ~~~~~~~~~~~~~~~~~~*/
  $('#dropdn-cost-saves').change( function() {
    var value = $(this).val();
    $('.cost-saves').text(value);
  });

  $('#QBD-1').change( function() {
    var value = $(this).val();
    $('.QBD-1').text(value);
  });

  $('#QBD-2a').change( function() {
    var value = $(this).val();
    $('.QBD-2a').text(value);
  });

   $('#QBD-2b').change( function() {
    var value = $(this).val();
    $('.QBD-2b').text(value);
  });

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

}); //<-end document.ready

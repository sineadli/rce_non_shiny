/*~~~~~~~~~~~~~~~~~~ ALL ~~~~~~~~~~~~~~~~~~*/
$(document).ready( function() {

  $('[data-toggle=collapse]').click( function() {

    var caret = $(this).find('i');
    caret.toggleClass('fa-caret-right');
    caret.toggleClass('fa-caret-down');
  });


/*~~~~~~~~~~~~~~~~~~ determine_your_approach.html ~~~~~~~~~~~~~~~~~~*/
    $('#Prob_Appr_B').change(function () {
        var value = $(this).val();
        var subject = "";        
        var a = $("#Prob_Appr_A").val();
        if (a === "Yes") { subject = "Are all " + value + " using " }
        else if (a === "No") { subject = "Will all " + value + " use " }
    

    var otherSpecify = $("#other-specify");

    if (value === "other") otherSpecify.show();
    else otherSpecify.hide();

        if (value !== "other") {
        $(".section-c-header").text(subject);
    }
    else {
        $(".section-c-header").text("subjects");

    }
    });
    
    $('#Prob_Appr_A').change(function () {
        var a = $(this).val();
        var subject = "";
        var value = $("#Prob_Appr_B").val();
        if (a === "Yes") { subject = "Are all " + value + " using " }
        else if (a === "No") { subject = "Will all " + value + " use " }
        
        
        var otherSpecify = $("#Prob_Apprr_B_other");
        
        if (value === "other") otherSpecify.show();
        else otherSpecify.hide();
        
        if (value !== "other") {
            $(".section-c-header").text(subject);
        }
        else {
            $(".section-c-header").text("subjects");

        }
    });
    
  
    $(".section-c-header").text(function () {
        var subject = "";
        var a = $("#Prob_Appr_A").val();
        var value = $("#Prob_Appr_B").val();
        if (value === "other") { $("#other-specify").show();}
        if (a === "Yes") { subject = "Are all " + value + " using " }
        else if (a === "No") { subject = "Will all " + value + " use " }
        return subject;
     }
    );
  


  $("#Prob_Apprr_B_other").keyup( function() {
        var value = $(this).val();
        var a = $("#Prob_Appr_A").val();
        var subject = "";
        if (a === "Yes") { subject = "Are all " + value + " using " }
        else if (a === "No") { subject = "Will all " + value + " use " }
    $(".section-c-header").text(subject);    
  });


/*~~~~~~~~~~~~~~~~~~ craft_your_research_q.html ~~~~~~~~~~~~~~~~~~*/
  $('#Plan_Question_B_1').change( function() {
    var value = $(this).val();

    var otherSpecify = $("#other-specify-q11");

    if (value === "other") otherSpecify.show();
    else otherSpecify.hide();

    if (value !== "other") {
        $("#other-specify-text-q11").text(value);
    }
    else {
        $(".q11answer").text("B");
    }
  });

    $("#other-specify-text-q11").keyup( function() {
    var value = $(this).val();
    $(".q11answer").text(value);
  });


  $('#Plan_Question_A').keyup( function() {
    var value = $(this).val();
    $('.q1answer').text(value);
  });

  $('#q11').change( function() {
    var value = $(this).val();
    $('.q11answer').text(value);
  });

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

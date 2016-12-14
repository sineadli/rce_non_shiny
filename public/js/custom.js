
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

/*~~~~~~~~~~~~~~~~~~ ALL ~~~~~~~~~~~~~~~~~~*/
$(document).ready(function() {
    /** Load Header **/
    $.get("/header", function(data) {
        $("#header").html(data);
        //$("#breadcrb").show();
    });
   
    $('[data-toggle=collapse]').click(function() {

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


/*~~~~~~~~~~~~~~~~~~ determine_your_approach.html ~~~~~~~~~~~~~~~~~~*/
  $('#Prob_Appr_Pre1').change(function () {
      var value = $(this).val();
      var subject = "subjects";
      
      var otherSpecify = $("#other-specify-pre1");

      if (value.toLowerCase() === "other") otherSpecify.show();
      else otherSpecify.hide();
      if (value.toLowerCase() != "select an option" && value.toLowerCase() != "other") {
          subject = value;
      }
      
      setConclusion();
  });
  $('#Prob_Appr_Pre2').change(function () {
      setConclusion();
  });
    //Q.3
  $('#Prob_Appr_A').change(function () {
      setConclusion();    
  });
  $('#Prob_Appr_B').change(function () {

        var value = $(this).val();
        var subject = "subjects";        
    var otherSpecify = $("#other-specify");
    if (value === "other") otherSpecify.show();
    else otherSpecify.hide();
    if (value.toLowerCase() != "select an option" && value.toLowerCase() != "other") {
        subject = value;
    }
    if (value.toLowerCase() !== "other") {
      
        $(".section-c-header").text(subject);
    }
    else {
        
        $(".section-c-header").text("subjects");

    }
    setConclusion();
    });
    $('#Prob_Appr_C').change(function () {
        setConclusion();     
    });
    $('#Prob_Appr_D').change(function () {
        setConclusion();     
    });
    $('#Prob_Appr_E').change(function () {
        setConclusion();
    });
    $('#Prob_Appr_F').change(function () {
        setConclusion();
    });


  
    $(".section-c-header").text(getSubject());
  $("#Prob_Appr_B_other").keyup( function() {
      var value = $(this).val();
      $(".section-c-header").text(value);   
  });

 
/*~~~~~~~~~~~~~~~~~~ craft_your_research_q.html ~~~~~~~~~~~~~~~~~~*/


  $('#Basics_Outcome').change( function() {
    var value = $(this).val();

    var otherSpecify = $("#Question_Outcome_Other");

    if (value.toLowerCase() === "other") otherSpecify.show();
    else otherSpecify.hide();

    if (value.toLowerCase() !== "other" && value.toLowerCase() !== "select an option") {
        $(".eval-outcome").text(value);
    }
    else {
        $(".eval-outcome").text("B");
    }
  });

  $("#Basics_Outcome_Other").keyup( function() {
    var value = $(this).val();
    $(".eval-outcome").text(value);
  });

	/* Outcome Measure */
  $('#Outcome_Measure').keyup(function () {
	  var value = $(this).val();
	  $('.effect-measure').text("as measured by " + value);
  }); 


  $('#Outcome_Direction').change( function() {
    var value = $(this).val();
    $('.change-direction').text(value);
  });  

  $('#Intervention_Group_Desc').keyup( function() {
    var value = $(this).val();
    $('.treatment-group').text(value);
  });

  $('#Comparison_Group_Desc').keyup( function() {
    var value = $(this).val();
    $('.comparison-group').text(value);
  });    

/*~~~~~~~~~~~~~~~~~~ plan_next_steps.html ~~~~~~~~~~~~~~~~~~*/
  $('#Measure_Units').change(function () {
	  var value = $(this).val();

	  var otherSpecify = $("#Question_Units_Other");

	  if (value.toLowerCase() === "other") otherSpecify.show();
	  else otherSpecify.hide();

	  var munits = $("#Measure_Units").val();
	  if (munits.toLowerCase === "other") {
		  munits = $("#Measure_Units_Other").val();
	  }
	  if (munits === "" || munits.toLowerCase() === "select an option") {
		  munits = "units";
	  }
	  $(".measure-units").text(munits);
	  
  });

  $("#Measure_Units_Other").keyup(function () {
	  var value = $(this).val();
	  $(".measure-units").text(value);
  });

	 $('#Success_Effect_Size').change(function () {
	  var value = $(this).val();
	  $('.success-effect-size').text(value);
  });

	 $('#Pass_Probability').change(function () {
	  var value = $(this).val();
	  $('.prob-success').text(value);
  });

	 $('#Fail_Probability').change(function () {
	  var value = $(this).val();
	  $('.prob-failure').text(value);
  });

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

}); //<-end document.ready

function setFeedbackOptions(email, page) {
	var fm_options = {
		bootstrap: true,
		position: "right-top",
		name_placeholder: "Name please",
		name_required: true,
		title_label: "",
		message_label: "Message",
		message_placeholder: "Please send us your feedback on the site&rsquo;s functionality and appearance",
		feedback_url: "/feedback",
		custom_params: {
			user_email: email,
			page: page
		},
        delayed_options: {
			success_color: "#5cb85c",
			fail_color: "#d2322d",
			delay_success_milliseconds: 3500,
			send_success: "Thanks for your feedback."
		}
	}
    return fm_options;
};

function setWizardNav(step, stepvisited) {
    step = parseInt(step);

	$("li.wizard-item").each(function (index) {

		if (index === step - 2) {
			$(this).addClass("active");
		}
		if (index === step - 1) {
			$("#Next-link").html($(this).children("p").text() + " <span class='fa fa-chevron-right fa-2x'></span> ");
		}
		if (index === step - 3) {
			$("#Prev-link").html("<span class='fa fa-chevron-left fa-2x'></span> " + $(this).children("p").text());
		}
		if (stepvisited.indexOf(index + 2) > -1) { $(this).addClass("previous"); }
	});

	if (step === 6) {
		$('.bottom-next').hide();
	} else {
		$('.bottom-next').show();
	}
	if (step === 2) {
		$('.bottom-prev').hide();
	} else {
		$('.bottom-prev').show();
	}
}
function recordViewPDF(name, step, path) {

    $.ajax({
        type: "POST",
        url: "/pdf_view",
        data: JSON.stringify({
            "tname": name,
            "step": step
        }),

        dataType: "json",
        contentType: "application/json",
      
    });
    setTimeout('', 10000);
    window.open(path, '_blank', 'fullscreen=yes');

};



function setConclusion() {
    var strConclusion, subject;
    var pre1 = $('#Prob_Appr_Pre1').val();
    var pre2 = $('#Prob_Appr_Pre2').val();
    var a = $("#Prob_Appr_A").val();
    var b = $("#Prob_Appr_B").val();
    var c = $("#Prob_Appr_C").val();
    var d = $("#Prob_Appr_D").val();
    var e = $("#Prob_Appr_E").val();
    var f = $("#Prob_Appr_F").val();
    $("#conclusion").html("");
    $("#conclusion_sub").html("");
 
    if (pre1.toLowerCase() === "i have not identified an outcome yet") {
        //block B
        strConclusion = "To measure a technology&#39;s effectiveness it is critical to know what you are hoping to accomplish from its use. We encourage you to talk with your colleagues about possible outcomes that you would like to improve. This could be based on your priorities or what you think the technology could reasonably achieve. In order to plan an effective evaluation, you will need to know what outcomes you&#39;re measuring. Come back to the Coach when you know what outcome you wish to target and have identified a technology to pilot. ";
        $('#Prob_Appr_Pre2').val("");
        $("#Prob_Appr_A").val("");
        $("#Prob_Appr_B").val("");
        $("#Prob_Appr_C").val("");
        $("#Prob_Appr_D").val("");
        $("#Prob_Appr_E").val("");
        $("#Prob_Appr_F").val("");
        $("#pre2").hide();
        $(".notA").hide();
        $("#conclusion").html(strConclusion);
        $("#complete").removeAttr("disabled");     
        return;     // reach conclusion
    }
    else if (pre1.toLowerCase() !== "select an option") {
        strConclusion = "";
        $("#pre2").show();

    }
    else {
        strConclusion = "";
        $('#Prob_Appr_Pre2').val("");
        $("#Prob_Appr_A").val("");
        $("#Prob_Appr_B").val("");
        $("#Prob_Appr_C").val("");
        $("#Prob_Appr_D").val("");
        $("#Prob_Appr_E").val("");
        $("#Prob_Appr_F").val("");
        $("#pre2").hide();
        $(".notA").hide();
        $("#conclusion").html("");
        $("#complete").attr("disabled", "disabled");
        return;   //haven't select anything
    }
    $("#conclusion").html("");
    $("#complete").attr("disabled", "disabled");
    if (pre2) {
        if (pre2.toLowerCase() === "no") {
            //block D
            strConclusion = "The Coach is designed to help you assess the effectiveness of a technology. This guide will help you identify a technology to achieve your goals. Once you have selected a technology come back to continue to the next step!";
            $("#Prob_Appr_A").val("");
            $("#Prob_Appr_B").val("");
            $("#Prob_Appr_C").val("");
            $("#Prob_Appr_D").val("");
            $("#Prob_Appr_E").val("");
            $("#Prob_Appr_F").val("");
            $(".notA").hide();
            $("#conclusion").html(strConclusion);
            $("#complete").removeAttr("disabled");  
            return; // reach conclusion
        }
        else if (pre2.toLowerCase() === "yes") {
            var subConclusion = "";
            strConclusion = "";
            $(".notB").hide();
            $(".notA").show();
            if (!a || a.toLowerCase() === "select an option") {
                $("#complete").attr("disabled", "disabled");
                $(".notB").hide();
                return;   //return to continue
            }
            if (a && a !== "select an option") {
                $(".notB").show();
                //matching
                if (a.toLowerCase() === "already using the technology") {
                    $(".notC").hide();
                    $("#morr").html(" Who are the technology users be?");
                    $("#bmatching").show();
                    $("#Prob_Appr_C").show();
                    $("#brandom1").hide();   //randomizing text 1
                    $("#brandom2").hide();   //randomizing text 2
                    $("#Prob_Appr_D").val("");
                    $("#Prob_Appr_E").val("");
                    $("#Prob_Appr_F").val("");
                    // block P
                    //check c
                    if (c.toLowerCase() === "no") {
                        strConclusion = "Based on your answers, the Coach will guide you through a matched comparison design. Since only some " + getSubject() + " are using the technology, a matched comparison will allow you to compare those already using the technology to a similar group of non-users that you can create using the RCE Coach Matching Dashboard. This tool will create two groups that are similar in terms of observed characteristics for which you have data. Using this method you&#39;ll be able to compare across groups and have some confidence that the differences are due to the technology. However, it is possible that differences in outcomes could be due to differences in unobserved characteristics that also drive outcomes.";
                        subConclusion = "This tool will create two groups that are similar in terms of observed characteristics for which you have data.Using this method you&#39; ll be able to compare across groups and have some confidence that the differences are due to the technology.However, it is possible that differences in outcomes could be due to differences in unobserved characteristics that also drive outcomes. ";

                    }
                    // block N
                    else if (c.toLowerCase() === "yes") {
                        strConclusion = "In order to evaluate whether the educational technology is moving the needle, you&#39;ll need to be able to compare " + getSubject() + " using the technology to similar " + getSubject() + " not using the technology. Your answers indicate that all " + getSubject() + " will be using the technology. This means it would not be possible to create a comparison group of non-users. ";
                        subConclusion = "Our guide on understanding correlations in your data may help you if you want to learn more about how an implemented technology is working. You may also be able to test options for improving implementation of the technology. Contact us at EdTechRCE@mathematica-mpr.com if you wish to discuss alternative options.";
                    }
                    $("#conclusion").html(strConclusion);
                    $("#conclusion_sub").html(subConclusion);
                    $("#complete").removeAttr("disabled");
                    return;    // reach conclusion done for matching

                }
                //randomizing
                else {
                    $("#morr").html(" Who will the new technology users be?");
                    $("#bmatching").hide();
                    $("#Prob_Appr_C").hide();
                    if (a.toLowerCase() === "expanding an implemented technology") {
                        $("#brandom1").show();
                        $("#Prob_Appr_C").show();
                        $("#brandom2").hide();
                    }
                    else {
                        $("#brandom2").show();
                        $("#Prob_Appr_C").show();
                        $("#brandom1").hide();
                    }
                    //N
                    if (c.toLowerCase() === "no") {
                        $(".notC").hide();
                        strConclusion = "In order to evaluate whether the educational technology is moving the needle, you&#39;ll need to be able to compare " + getSubject() + " using the technology to similar " + getSubject() + " not using the technology. Your answers indicate that all " + getSubject() + " will be using the technology. This means it would not be possible to create a comparison group of non-users. ";
                        subConclusion = "Our guide on understanding correlations in your data may help you if you want to learn more about how an implemented technology is working. You may also be able to test options for improving implementation of the technology. Contact us at EdTechRCE@mathematica-mpr.com if you wish to discuss alternative options.";
                        $("#conclusion").html(strConclusion);
                        $("#conclusion_sub").html(subConclusion);
                        $("#complete").removeAttr("disabled");
                        return;
                        // $(".N").show(); $(".notC").hide(); $(".P").hide();
                    }
                    else {
                        $("#conclusion").html("");
                        $("#conclusion_sub").html("");
                        $("#complete").attr("disabled", "disabled");
                        $(".notC").show();
                        if (!d || d.toLowerCase() === "select an option") {
                            $("#Prob_Appr_E").val("");
                            $("#Prob_Appr_F").val("");
                            $(".E").hide();
                            $(".F").hide();
                            return;
                        }
                        else {
                            if (d.toLowerCase() === "we will not be asking for volunteers") {
                                $(".E").show();
                                $(".F").hide();
                                $("#Prob_Appr_F").val("");
                                if (!e || e.toLowerCase() === "select an option") {
                                    return;
                                }
                                else {
                                    if (e.toLowerCase() === "i will choose randomly") {
                                        //L
                                        strConclusion = "Based on your answers, the Coach will guide you through a randomized pilot. The choice of who will pilot the technology will be determined by chance, like a coin flip. This design is the gold standard to determine if an education technology is moving the needle because it allows us to create two groups that are similar on both observed and unobserved characteristics. This means that you can be confident that any differences you see in outcomes are due to the technology and not other factors.";
                                        subConclusion = "";
                                    }
                                    else if (e.toLowerCase() === "i will use a cutoff") {
                                        //M
                                        strConclusion = "Since you use a cutoff to determine who will use the technology, a Regression Discontinuity design (RD) would be a good approach. This design compares outcomes for individuals just above and just below the cutoff to determine whether the technology is having an effect. This works because we assume that those around the cutoff are very similar and that any differences are due to using the technology. However, your conclusions may not apply to those farther away from the cutoff.";
                                        subConclusion = "The Coach does not yet include tools for RD, but if you&#39;re interested in pursuing an evaluation please contact us at EdTechRCE@mathematica-mpr.com and you may be able to use beta versions of tools we are creating to handle this type of design.";
                                    }
                                    else {
                                        //Q
                                        strConclusion = "Based on your answers, the Coach will guide you through a matched comparison design. Since you are selecting your users, a matched comparison will allow you to compare those you select to a similar group of non&#45;users that you can create using the RCE Coach Matching Dashboard. For this method to work, you&#39;ll want to be sure that some similar " + getSubject() + " are not pilot users. ";
                                        subConclusion = "";

                                    }
                                    $("#conclusion").html(strConclusion);
                                    $("#conclusion_sub").html(subConclusion);
                                    $("#complete").removeAttr("disabled");
                                    return;
                                }
                            }
                            else {
                                $(".F").show();
                                $(".E").hide();
                                $("#Prob_Appr_E").val("");
  
                                if (!f || f.toLowerCase() === "select an option") {
                                    return;
                                }
                                else {
                                    
                                    if (f.toLowerCase() === "yes, i can choose some of the volunteers using a random process like a coin flip") {
                                        //L
                                        strConclusion = "Based on your answers, the Coach will guide you through a randomized pilot. The choice of who will pilot the technology will be determined by chance, like a coin flip. This design is the gold standard to determine if an education technology is moving the needle because it allows us to create two groups that are similar on both observed and unobserved characteristics. This means that you can be confident that any differences you see in outcomes are due to the technology and not other factors.";
                                        subConclusion = "";
                                    }
                                    else if (f.toLowerCase() === "yes, i can use a cutoff to do this") {
                                        //M
                                        strConclusion = "Since you use a cutoff to determine who will use the technology, a Regression Discontinuity design (RD) would be a good approach. This design compares outcomes for individuals just above and just below the cutoff to determine whether the technology is having an effect. This works because we assume that those around the cutoff are very similar and that any differences are due to using the technology. However, your conclusions may not apply to those farther away from the cutoff.";
                                        subConclusion = "The Coach does not yet include tools for RD, but if you&#39;re interested in pursuing an evaluation please contact us at EdTechRCE@mathematica-mpr.com and you may be able to use beta versions of tools we are creating to handle this type of design.";
                                    }
                                    else {
                                        //Q
                                        strConclusion = "Based on your answers, the Coach will guide you through a matched comparison design. Since you are selecting your users, a matched comparison will allow you to compare those you select to a similar group of non&#45;users that you can create using the RCE Coach Matching Dashboard. For this method to work, you&#39;ll want to be sure that some similar " + getSubject() + " are not pilot users. ";
                                        subConclusion = "";

                                    }
                                    $("#conclusion").html(strConclusion);
                                    $("#conclusion_sub").html(subConclusion);
                                    $("#complete").removeAttr("disabled");
                                    
                                    return;
                                }
                            }
                        }
                    }
                } //end of randomizing
            }
            else {
                $(".notB").hide();
                return;
            }

        }
        else {
            strConclusion = "";
            $("#Prob_Appr_A").val("");
            $("#Prob_Appr_B").val("");
            $("#Prob_Appr_C").val("");
            $(".notA").hide();
        }
    }

};

function getSubject() {
    var subject = "subjects";
    var value = $("#Prob_Appr_B").val();
    if (value) {
        if (value == "other") {
            $("#other-specify").show();
            subject = $("#Prob_Appr_B_other").val();
        }

        if (value.toLowerCase() != "select an option" && value.toLowerCase() != "other") {
            subject = value;
        }
    }

    return subject;
};

function AChanged() {
    var a = $(this).val();
 
    if (a.toLowerCase() !== "select an option") {

        if (a.toLowerCase() === "already using the technology") {
            $("#morr").html("Who are the technology users be?");
            $("#bmatching").show();
            $("#brandom1").hide();
            $("#brandom2").hide();
        }
        else {
            $("#morr").html("Who will the new technology users be?");
            $("#bmatching").hide();
            if (a.toLowerCase() === "expanding an implemented technology") {
                $("#brandom1").show();
                $("#brandom2").hide();
            }
            else {
                $("#brandom2").show();
                $("#brandom1").hide();
            }
        }
        $(".notB").show();
    }

}


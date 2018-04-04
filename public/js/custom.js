
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


    if (typeof (UserAgentInfo) != 'undefined' && !window.addEventListener) {
        UserAgentInfo.strBrowser = 1;
    }
    $('.datepicker').datepicker({
        todayHighlight: true
    });
	$('[data-toggle="tooltip"]').tooltip({ html: true, trigger: "click focus hover" });
    $('[data-toggle=collapse]').click(function() {
        var caret = $(this).find('i');
        caret.toggleClass('fa-caret-right');
        caret.toggleClass('fa-caret-down');
    });

// If peeking a tool, deactivate links and buttons, add tooltips
	$('body.peeking div.step-action a').click(function (e) {
		e.preventDefault();
		e.stopPropagation();
	    e.stopImmediatePropagation();
	    return false;
	});
	$('body.peeking div.step-action a').each(function () {		
		$(this).replaceWith($('<span title="This action is not available in peek mode" data-toggle="tooltip" class="tooltip-gr">' + this.innerHTML + '</span>'));
    });
	$('body.peeking button').each(function () {
        $(this).prop('disabled', true);
		$(this).children("span").prop('title', 'This action is not available in peek mode.');
    });

	// If get to brief through shared eval page, hide return links and change breadcrumb path
	$('body.sharing p.prev-answer').each(function () {
		$(this).hide();
    });
	$('body.sharing ol.breadcrumb>li.breadcrumb-item>a').prop("href", "/publications");
	$('body.sharing ol.breadcrumb>li.breadcrumb-item>a')
		.html("<span class='fa fa-caret-left'></span> BACK TO SHARED EVALUATIONS");
	$('body.sharing button#Save').hide();
	$('body.sharing button#open-complete-evaluation-modal').hide();
	

// For links with return paths, get return tool name to use in button text and breadcrumb
	var urlParams = new URLSearchParams(window.location.search);

	if (urlParams.has('return')) {
	    var ToolName = "";
		var returnpath = urlParams.get('return');
		$("#returnpath").val(returnpath); 
		switch (returnpath) {
			case "evaluation_plan":
			    ToolName = "Evaluation Plan";
				break;
			case "outcome_measure":
				ToolName = "Define Your Outcome and Measure";
				break;
			case "measure_instrument":
				ToolName = "Find an Instrument to Measure Your Outcome";
				break;
			case "shareresult":
			    ToolName = "Share Your Results";
				break;
			case "getresult":
				ToolName = "Get Results";
				break;
			case "context_and_usage":
				ToolName = "Summarize Context";
				break;
			case "basics":
				ToolName = "The Basics";
				break;
			case "craft_your_research_q":
				ToolName = "Craft Your Research Question";
				break;
			case "randomization":
				ToolName = "Random Assignment";
				break;
			case "prepare_data_random":
				ToolName = "Prepare for Random Assignment";
				break;
			case "prepare_data":
				ToolName = "Prepare Your Data for Analysis";
				break;
			case "matching":
				ToolName = "Matching";
				break;
			case "plan_next_steps":
				ToolName = "Think About How to Use Your Results";
				break;
			default:
				ToolName = "";
		}
		$("button#Complete").hide();
		$("button#Save").html("Save and Return to " + ToolName);
		$('ol.breadcrumb>li.breadcrumb-item>a').prop("href", "/" + returnpath);
	    $('ol.breadcrumb>li.breadcrumb-item>a')
	        .html("<span class='fa fa-caret-left'></span> BACK TO " + ToolName);
	}

	$('button#Complete').click(function () {
		$('#status').val('completed');
	});
	$('button#Save').click(function () {
		$('#status').val('started');
	});
	$('button#match').click(function () {
		$('#status').val('started');
	});
	$('button#match').click(function () {
		$('#status').val('started');
	});

	$(".redirect-link").click(function (e) {
		e.preventDefault();
		var returnpath = this.pathname.substr(1) + this.search;
		$("#returnpath").val(returnpath);
		$("#status").val("started");
		$("form").submit();

	});

	$(".capitalize-one").each(function () {
		var x = $(this).text().trim();
		if(x.length > 0) {$(this).text(capitalize(x));}
	});

	
	
   }); //<-end document.ready



function UrlExists(url) {
	if (url == $("#coreurl").val()) {
		return false;
	} 
    var http = new XMLHttpRequest();
    http.open('GET', url, false);
    http.send();
	console.log("Status = " + http.status);
    return http.status == 200;
}

function IfDownloadFile(dl) {
	var url = $("#coreurl").val() + dl;
  // alert("does url exist " + UrlExists(url));  
   if (UrlExists(url)) {
            $("#downloadData")
                .removeClass("disabled");
            $("#downloadDataDiv").removeClass("hidden");
            $("#downloadData").removeClass("hidden")
                .attr("target", "_blank")
                .attr("href", $("#coreurl").val() + $("#downloadPath").val()).removeAttr("disabled");
        }
    
}

function capitalize(x) {
	return x[0].toUpperCase() + x.substring(1);
}


$(document).on('click', '.tool-view-button', function (e) {
	e.preventDefault();
	$("div.tool-div").removeClass("current");
	var href = $(this).attr("href");
	$(this).parent(".tool-view-btn").parent(".tool-div").addClass("current");

	window.location = href;
});





/*~~~~~~~~~~~~~~~~ The Basics ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function usersUpdate(t) {

	var value = $(t).val();
	var subject = "users";
	var otherSpecify = $("#Question_Users_Other");
	if (value === "other") otherSpecify.show();
	else {
	    $("#Basics_Users_Other").val("");
		otherSpecify.hide();
	}
	
	if (value.toLowerCase() != "select an option" && value.toLowerCase() != "other") {
		subject = value;
	}
	$(".tech_users").text(subject);
};
function techNameUpdate(t) {
	var tech = $(t).val();
	$('.tech-name').text(tech);
}
function outcomeUpdate(t) {

	var value = $(t).val().toLowerCase();

	var otherSpecify = $("#Question_Outcome_Other");
	if (value === "other") otherSpecify.show();
	else {
		$("#Basics_Outcome_Other").val("");
		otherSpecify.hide();
	}

	if (value !== "other" && value !== "select an option") {
		$(".eval-outcome").text(value);
	} else {
		$(".eval-outcome").text("B");
	}

};

function setBasicsConclusion() {
	var haveTech = $('#Basics_Have').val();
	var techName = $('#Basics_Tech_Name').val();
	var whoUsers = $('#Basics_Users').val();
	if (whoUsers.toLowerCase() === "other") whoUsers = $('#Basics_Users_Other').val();
	

	if (haveTech.toLowerCase() === "no") {

		$("#Q_Tech_Name").hide();
		$("#Q_Who_Users").hide();
		$("#Q_Have_Outcome").hide();
		$("#Step_Conclusion").show();
		$("#stop-no-tech").show();
		$("#stop-no-outcome").hide();
		$("#success").hide();
		$("button.complete").attr("disabled", "disabled");

	}
	
	else if (techName !== "" &&
		whoUsers.toLowerCase() !== "select an option" && whoUsers.toLowerCase() !== "" &&
		haveTech.toLowerCase() !== "no" ) {
		$("#Step_Conclusion").show();
		$("#success").show();
		$("#stop-no-tech").hide();
		$("#stop-no-outcome").hide();
		$("button.complete").removeAttr("disabled");
	}
	else {
		$("#Q_Tech_Name").show();
		$("#Q_Who_Users").show();
		$("#Q_Have_Outcome").show();
		$("#Step_Conclusion").hide();
		$("#stop-no-tech").hide();
		$("#stop-no-outcome").hide();
		$("#success").hide();
		$("button.complete").attr("disabled", "disabled");
	}
}






/*~~~~~~~~~~~~~~~~~~ craft_your_research_q.html ~~~~~~~~~~~~~~~~~~*/



function outcomeOtherUpdate(t) {
	var value = $(t).val();
	$(".eval-outcome").text(value);
};

/* Outcome Measure */
function outcomeMeasureUpdate(t) {
	var value = $(t).val();
	var newtext = value === "" ? "" : " as measured by " + value;
	$('.effect-measure').text(newtext);
};


function outcomeDirectionUpdate(t) {
	var value = $(t).val();
	$('.change-direction').text(value);
};

function interventionGroupDescUpdate(t) {
	var value = $(t).val();
	$('.treatment-group').text(value);
};

function comparisonGroupDescUpdate(t) {
	var value = $(t).val();
	$('.comparison-group').text(value);
};



/*~~~~~~~~~~~~~~~~~~ plan_next_steps.html ~~~~~~~~~~~~~~~~~~*/
function outcomeMeasureUpdate2(t) {
	var value = $(t).val();
	$('.effect-measure').text(value);
};

function measureUnitsUpdate(t) {
	var value = $(t).val();

	var otherSpecify = $("#Question_Units_Other");

	if (value.toLowerCase() === "other") otherSpecify.show();
	else {
		$("#Measure_Units_Other").val("");
		otherSpecify.hide();
	}

	var munits = $("#Measure_Units").val();
	if (munits.toLowerCase() === "other") {
		munits = $("#Measure_Units_Other").val();
	}
	if (munits === "" || munits.toLowerCase() === "select an option") {
		munits = "units";
	}
	$(".measure-units").text(munits);

};

function measureUnitsOtherUpdate(t) {
	var value = $(this).val();
	$(".measure-units").text(value);
};

function successEffectSizeUpdate(t) {
	var value = $(t).val();
	$('.success-effect-size').text(value);
};

function passProbUpdate(t) {
	var value = $(t).val();
	$('.prob-success').text(value + "%");
};

function failProbUpdate(t) {
	var value = $(t).val();
	$('.prob-failure').text(value);
};









            //this piece of code is the solution for getting rid of “Object doesn't support this property or method” error in IE11, so the datepicker will work



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
		    $("h1#p-title").html($(this).children("p").text());
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

/*~~~~~~~~~~~~~~~~~~ randomization.html ~~~~~~~~~~~~~~~~~~*/


function ShowCluster(t) {
    var value = $(t).val();

	var clusterSpecify = $("#Question_Cluster");

	if (value.toLowerCase().indexOf("group") !== -1) clusterSpecify.show();
	else clusterSpecify.hide();	
}


function ShowClusterOther(t) {
	var value = $(t).val();
	
    var otherSpecify = $("#Question_Cluster_Other");

    if (value.toLowerCase() === "other") otherSpecify.show();
	else {
		$("#Cluster_Group_Other").val("");
		otherSpecify.hide();
	}

}

function UpdateUserLimitExists(t) {
    var value = $(t).val();

    var specifyLimits = $("#Question_User_Limits");

    if (value.toLowerCase() === "yes") specifyLimits.show();
    else {
        $("#intervention_quantity").val("");
        $("#intervention_type").val("Select an option");

        specifyLimits.hide();
    }


};


function setUserLimitsSelections() {

	var users = $('#Basics_Users').val();
	if (users.toLowerCase() === "other") {
		users = $('#Basics_Users_Other').val();
	}

	var gORi = $('#Individual_Group').val();
    var cluster = $('#Cluster_Group').val();
    var scluster = "";
    var pcluster = "";
   
    if (cluster === 'classes') {
        scluster = 'class';
        pcluster = 'classrooms';
    }
	else if (cluster === 'schools') {
        scluster = 'school';
        pcluster = 'schools';
    }
	else if (cluster === 'other') {
        scluster = 'group';
        pcluster = 'groups';
    } else {
        scluster = cluster;
        pcluster = cluster + "s";
    }

	var ocluster = $('#Cluster_Group_Other').val();
    var datanote = "";
	var pretestnote = "";
	var assignlevel = users;
    var assign = users;
    var compile = " all " + users + " who could potentially use the technology. Your list or dataset will need to include a unique and anonymous id for each one of your " + users;
	if (gORi === "groups") {
		$('#Question_Cluster').show();
		compile = " all " + users + " who could potentially use the technology or a list of all " + cluster + ". If your list or dataset will be at the individual level, it must include a unique and anonymous id for each one of your " + users + " and a " + scluster + " indicator. If your data set will be at the " + scluster + " level, then it just needs a " + scluster + " indicator";
		assign = "groups of " + users;
		assignlevel = users + " by " + scluster;
	    datanote = "You indicated you will randomly assign " + users + " by "
			+ scluster + ".  Your data set can be at the individual or group level. If at the group level, A " + scluster + "'s background characteristic value should be the average value for all " + users + " in the " + scluster + ".";
		pretestnote = "You indicated you will randomly assign " + users + " by "
			+ scluster + ".  Your data set can be at the individual or group level. If at the group level, A " + scluster + "'s pretest value should be the average value for all " + users + " in the " + scluster + ".";
	}
	if (cluster.toLowerCase() !== "select an option" && gORi === "groups") {
		assign = pcluster;
	}
	if (cluster.toLowerCase() === "other" ) {
		$('#Question_Cluster_Other').show();

	}
    if (cluster.toLowerCase() === "other" && ocluster !== '') {
        assign = ocluster;
    }
	
	
    $(".indivs-or-groups").text(assign);
    $(".assign-level").text(assignlevel);
	$(".compile").text(compile);
	$(".tech_users").text(users);
	$(".group-data-prep-note").text(datanote);
	$(".group-pretest-prep-note").text(pretestnote);

	
	//Your data file can have one row   *for each of your *pcluster* or one row for each  *user*  and a unique *scluster* identifier*. 
    $(".indiv-or-group").text("one of your " + assign);
	if (gORi == "groups") {
		$(".indiv-or-group").text(" of your " + pcluster + ", or one row for each one of your  " + users +  " and a unique " + scluster + " identifier, ");
	}

	$("select#intervention_type").empty();

	$("#intervention_type")
		.append($("<option></option>")
			.attr("value", "Select an option")
			.text("Select an option"));
	$("#intervention_type")
		.append($("<option></option>")
			.attr("value", "percentage")
			.text("percent of " + assign));
	$("#intervention_type")
		.append($("<option></option>")
			.attr("value", "number")
			.text(assign));

}
  /*~~~~~~~~~~~~~~~~~~ randomization.html ~~~~~~~~~~~~~~~~~~*/
$('#Targeted_Access').change(function () {
    var value = $(this).val();

    var specifyTarget = $("#Question_Targeted_Desc");

    if (value.toLowerCase() === "yes") specifyTarget.show();
    else specifyTarget.hide();


});









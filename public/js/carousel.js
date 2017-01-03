
/*****************************************************************************
* RCE Coach software is available through a GLPv3 open-source software license.
* Any attribution should include the following:
*   © 2016, Mathematica Policy Research, Inc. The RCE Coach software was developed by 
*   Mathematica Policy Research, Inc. as part of the Rapid Cycle Tech Evaluations project funded 
*   by the U.S. Department of Education’s Office of Educational Technology through 
*   Contract No. ED-OOS-15-C-0053.
*******************************************************************************/

/*~~~~~~~~~~~~~~~~~~ carousel related scripts ~~~~~~~~~~~~~~~~~~*/
$(document).ready(function () {

    // initial index is 0, make initial highlights
	$(".anno0").addClass("highLight");


    $("#annoCarousel").on('slide.bs.carousel', function (e) {
        var currentIndex = $(this).find('.active').index();
        var nextIndex = $(e.relatedTarget).index();
        
		$(".anno" + currentIndex).removeClass("highLight");
		$(".anno5").parent().removeClass("highLight");
        $(".anno" + nextIndex).addClass("highLight");
    
       
            // need to change text in carousel
            var obj = $("#row-note");
            var newText = " For example, the current highlighted row is for the student with id 834305.";
            obj.html(newText);
       

      
    });

	$("div.step-subquestion table td").click(function () {
		
		for (i = 0; i < 6; i++) {
			if ($(this).hasClass("anno" + i)) {
				var defhighlight = true;
				
				if (i == 5) {
					$('#annoCarousel').carousel(0);
					$(".anno0").removeClass("highLight");
					$(".anno5").parent().removeClass("highLight");
					$(this).parent().addClass("highLight");
					var obj = $("#row-note");
					var thisval = $(this).text();
					var newText = " For example, the current highlighted row is for the student with id " + thisval + ".";
					obj.html(newText);
					var defhighlight = false;
				}
				else $('#annoCarousel').carousel(i);
				
				return;
			}
		}
    
       
        
	});
	
	

    $("div.step-subquestion table th").click(function () {   
		var col = $(this).parent().children().index($(this));
            $('#annoCarousel').carousel(1);
    });
});
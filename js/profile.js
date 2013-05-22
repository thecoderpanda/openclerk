/**
 * Add graph functionality.
 */
$(document).ready(function() {
	var i;
	var e = $(document).find("#graph_type"), template = $(document).find("#graph_type_template");
	template.hide();
	for (i = 0; i < graph_types().length; i++) {
		var temp = template.clone();
		temp.attr('value', graph_types()[i]['id']);
		temp.text(graph_types()[i]['title']);
		temp.data('index', i);
		temp.attr('id', '');
		e.append(temp);
		temp.show();
	}
	template.remove();	// so we can't select it while hidden
	var callback = function(event) {
		var data = $(event.target).find("option:selected").data('index');
		if (typeof data != 'undefined') {
			$("#graph_description").html(graph_types()[data]['description']);
			if (typeof graph_types()[data]['days'] != 'undefined' && graph_types()[data]['days']) {
				$("#add_graph_days").show();
			} else {
				$("#add_graph_days").hide();
			}
			if (typeof graph_types()[data]['technical'] != 'undefined' && graph_types()[data]['technical']) {
				$("#add_graph_technical").show();
				$("#graph_technical").keyup();
			} else {
				$("#add_graph_technical").hide();
				$("#add_graph_period").hide();
			}
		}
	};
	e.keyup(callback);
	e.change(callback);
	e.keyup();
});

/**
 * Fill in technical graph types.
 */
$(document).ready(function() {
	var i;
	var e = $(document).find("#graph_technical"), template = $(document).find("#graph_technical_template");
	template.hide();
	for (i = 0; i < graph_technical_types().length; i++) {
		var temp = template.clone();
		temp.attr('value', graph_technical_types()[i]['id']);
		temp.text(graph_technical_types()[i]['title']);
		temp.data('index', i);
		temp.attr('id', '');
		if (graph_technical_types()[i]['premium']) {
			temp.addClass('premium');
			/*
			if (!user_has_premium()) {
				temp.prop('disabled', 'true');
			}
			*/
		}
		e.append(temp);
		temp.show();
	}
	template.remove();	// so we can't select it while hidden
	var callback = function(event) {
		var data = $(event.target).find("option:selected").data('index');
		var e = $("#graph_technical");
		if (typeof data != 'undefined') {
			$("#graph_description").html(graph_technical_types()[data]['description']);
			if (e.is(":visible") && typeof graph_technical_types()[data]['period'] != 'undefined' && graph_technical_types()[data]['period']) {
				$("#add_graph_period").show();
			} else {
				$("#add_graph_period").hide();
			}
			if (graph_technical_types()[data]['premium']) {
				$("#add_graph_technical").addClass('premium');
				if (!user_has_premium()) {
					$("#premium_warning").show();
				}
			} else {
				$("#add_graph_technical").removeClass('premium');
				$("#premium_warning").hide();
			}
		} else {
			// "none" is selected
			$("#add_graph_period").hide();
			$("#add_graph_technical").removeClass('premium');
			$("#premium_warning").hide();
		}
	};
	e.keyup(callback);
	e.change(callback);
	e.keyup();
});

/**
 * Enable graph layout editing.
 */
$(document).ready(function() {
	var e = $(document).find("#enable_editing");
	if (e) {
		e.change(function(event) {
			var enabled = ($(document).find("#enable_editing:checked").val());
			var targets = $(document).find(".graph_controls");
			if (enabled) {
				targets.show();
			} else {
				targets.hide();
			}
			if (already_editing !== null) {
				hideGraphProperty(event.target, already_editing);
			}
			var targets = $(document).find(".render_time");
			if (enabled) {
				targets.show();
			} else {
				targets.hide();
			}
		});
		e.change(); // in case it's already checked at page generation time
	}
});

var already_editing = null;

/**
 * Enable inline editing of graph properties.
 */
function editGraphProperty(target, id, graph_data) {
	if (already_editing != null) {
		if (already_editing == id) {
			return;	// no need to redisplay our own page
		}
		hideGraphProperty(target, already_editing);
	}

	// create a modal screen
	var e = $(document).find("#edit_graph_target_" + id);
	if (e) {
		// clone the edit form
		var temp = $(document).find("#edit_graph_form").clone(true /* withDataAndEvents */);
		temp.attr('id', '');
		temp.addClass('open_property_page');

		// update form elements
		$(temp).find("select[name='type']").val(graph_data['type']);
		$(temp).find("select[name='width']").val(graph_data['width']);
		$(temp).find("select[name='height']").val(graph_data['height']);
		$(temp).find("select[name='days']").val(graph_data['days']);
		$(temp).find("select[name='technical']").val(graph_data['technical']);
		$(temp).find("input[name='period']").val(graph_data['period']);
		$(temp).find("input[name='id']").val(graph_data['id']);
		$(temp).find("input:submit").val("Update graph");

		e.append(temp);
		temp.show();
		e.show();
		already_editing = id;

		$(temp).find("select[name='type']").keyup();	// trigger the event handler (AFTER it's been added to the DOM, otherwise the original form will get it)
	}
}

function hideGraphProperty(target, id) {
	var e = $(document).find("#edit_graph_target_" + id);
	if (e) {
		var temp = $(e).find(".open_property_page");
		temp.remove();
		e.hide();
		already_editing = null;
	}
}

/**
 * Enable add graph/pages tabs.
 */
$(document).ready(function() {
	initialise_tabs('#tabs_profile');
});


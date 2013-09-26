/**
 * Wizard page 'currencies': initialise currency selections
 */
$(document).ready(function() {
	$("#page_wizard_currencies .wizard .exchanges").hide();

	// hide/show possible exchanges
	var callback = function(event) {
		var parent = event.target;

		$(parent.parentNode).find(".exchanges").toggle();

		if ($(parent).hasClass("collapsed")) {
			$(parent).removeClass("collapsed");
		} else {
			$(parent).addClass("collapsed");
		}
	};
	$("#page_wizard_currencies a.set-exchange").click(callback);

	// update exchange text
	var callback2 = function(event) {
		var parent = event.target;

		// get all exchanges
		var ex = $(parent.parentNode /* li */.parentNode /* ul */).find("input:checked");
		var list = [];
		ex.each(function(i, e) {
			list.push($(e.parentNode).find("label").html());
		});

		// get default exchange
		var defaultExchange = $(parent.parentNode /* li */.parentNode /* ul */).find("label.default-exchange").html();

		$(parent.parentNode.parentNode.parentNode.parentNode).find(".exchange-text").text("Exchange" + (list.length > 1 ? "s" : "") + ": " + (list.length == 0 ? defaultExchange : list.join(", ")));

		// select the parent currency checkbox if necessary
		$(parent.parentNode.parentNode.parentNode.parentNode.parentNode).find("input.parent-currency").prop('checked', list.length != 0);
	};

	$("#page_wizard_currencies .exchanges input[type=checkbox]").change(callback2);
	$("#page_wizard_currencies .exchanges input[type=checkbox]").keypress(callback2);	// for keyboard navigation
	// and call the callback to refresh text
	$("#page_wizard_currencies .exchanges input[type=checkbox]").change();
});

/**
 * Wizard page 'accounts': initialise input fields and help pages
 */
$(document).ready(function() {
	var callback = function(event) {
		var exchanges = available_exchanges();
		for (var i = 0; i < exchanges.length; i++) {
			if (exchanges[i]['exchange'] == $(event.target).val()) {
				var key = $(event.target).val();

				// selected exchange: remove any fields that were added before
				// TODO we could store the saved fields for adding back later
				$("form.wizard-add-account .added-field").remove();

				// for every input
				var inputs = exchanges[i]['inputs'];
				for (var j = 0; j < inputs.length; j++) {
					// dropdown or normal input?
					var dropdown = (typeof inputs[j]['dropdown'] != 'undefined') ? inputs[j]['dropdown'] : false;
					var temp = $(dropdown ? "#add_account_template_dropdown" : "#add_account_template").clone();
					temp.addClass("added-field");

					var tempInput = temp.find(dropdown ? "select" : "input");
					tempInput.attr('name', inputs[j]['key']);
					tempInput.attr('id', 'input_' + inputs[j]['key']);
					if (dropdown) {
						var tempOption = temp.find("#option_template");
						for (var option_key in dropdown) {
							if (dropdown.hasOwnProperty(option_key)) {
								var tempOption1 = tempOption.clone();
								tempOption1.val(option_key);
								tempOption1.text(dropdown[option_key]);
								tempOption1.attr('id', '');
								if (typeof inputs[j]['style_prefix'] != 'undefined') {
									tempOption1.addClass(inputs[j]['style_prefix'] + option_key);
								}
								tempInput.append(tempOption1);
							}
						}
						tempOption.remove();
					} else {
						tempInput.attr('maxlength', inputs[j]['length']);
						tempInput.attr('size', 20 + (inputs[j]['length'] * 1/5));
					}

					var tempTitle = temp.find("label");
					tempTitle.html(inputs[j]['title'] + ":");
					tempTitle.attr('for', 'input_' + inputs[j]['key']);

					temp.insertBefore($("#add_account_template"));
					temp.show();
				}

				// display associated help, stored in accounts_help div
				var target = $("#accounts_help_target");
				var temp = $("#accounts_help #accounts_help_" + key);
				target.html(temp.html());

				// clean up link display etc
				var link_text = target.find("a.wizard_link").text();
				target.find("a.wizard_link").replaceWith(link_text);	// replace link with text

				// link up instructions_add heading with help page
				var help_text = target.find(".instructions_add h2").text();
				target.find(".instructions_add h2").text("");
				target.find(".instructions_add h2").append(target.find(".more_help").clone().find("a").text(help_text));

				// add collapse functionality to safety text
				var collapseCallback = function(event) {
					var parent = $(event.target);
					if ($(parent).hasClass("collapsed")) {
						$(parent).removeClass("collapsed");
						$(parent.parent(0)).find("ul").removeClass("collapsed");
					} else {
						$(parent).addClass("collapsed");
						$(parent.parent(0)).find("ul").addClass("collapsed");
					}
				};
				target.find(".instructions_safe h2").click(collapseCallback);
				// collapse by default
				target.find(".instructions_safe h2").click();
			}
		}
	};

	$("form.wizard-add-account select#type").change(callback);
	$("form.wizard-add-account select#type").keypress(callback);	// for keyboard navigation
	// call callback to initialise first field
	$("form.wizard-add-account select#type").change();
});

/**
 * Wizard page 'reports': initialise toggles
 */
$(document).ready(function() {
	var callback = function(event) {
		var parent = $(event.target);
		if ($(parent).hasClass("collapsed")) {
			$(parent).removeClass("collapsed");
			$(parent.parent(0)).find(".report-help-details").removeClass("collapsed");
		} else {
			$(parent).addClass("collapsed");
			$(parent.parent(0)).find(".report-help-details").addClass("collapsed");
		}
	};

	$("#page_wizard_reports .report-help").click(callback);
});

/**
 * Wizard page 'reports': initialise warning messages
 */
$(document).ready(function() {
	var callback = function(event) {
		var parent = $(event.target);
		// hide all other warnings
		$("#page_wizard_reports .reset-warning").hide();

		var warnings = $(parent.parent(0).parent(0)).find(".reset-warning");
		if (parent.is(":checked")) {
			warnings.show();
		} else {
			warnings.hide();
		}
	};

	$("#page_wizard_reports input[type=radio]").change(callback);
	$("#page_wizard_reports input[type=radio]").keypress(callback);	// for keyboard navigation

	// hide all other warnings
	$("#page_wizard_reports .reset-warning").hide();
});
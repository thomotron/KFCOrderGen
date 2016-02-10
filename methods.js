var db = {};

function webInit() {
	db = {"totals": {"cash": 0, "order": 0, "change": 0}, "order": [], "subtotals": []};
	
	var items = [];
	
	for (var i = 0; i < menu.callback.length; i++) {
		if (menu.callback[i].name.includes("---")) {
			items[i] = ("<option disabled=true style=\"display: block;\">" + menu.callback[i].name + "</option>");
		} else {
			items[i] = ("<option value=\"" + i + "\">" + menu.callback[i].name + "</option>");
		}
	};

	$('#menuPicker').append( items.join('') );
}

function printInit() {
	db = JSON.parse(getURLParameter("db"));
	//db = {"totals": {"cash": 0, "order": 0, "change": 0}, "order": [], "subtotals": []};
}

function webTables() {
	// Clean up old tables
	$("#subtotalTable").find("tr:gt(0)").remove();
	$("#orderTable").find("tr:gt(0)").remove();
	
	// Generate new tables
	for (var i = 0; i < db.order.length; i++) {
		$('#orderTable tbody').append(tableRow(db.order[i].amount, db.order[i].itemName, db.order[i].name, "$" + db.order[i].cost));
	}
	
	for (var name in db.subtotals) {
		$('#subtotalTable tbody').append(tableRow(name, "$" + db.subtotals[name].cash, "$" + db.subtotals[name].subtotal, "$" + db.subtotals[name].change));
		if (db.subtotals[name].change < 0) {
			$('#subtotalTable td:contains("' + name + '")').parent().addClass("danger");
		} else if (db.subtotals[name].change <= 1.5) {
			$('#subtotalTable td:contains("' + name + '")').parent().addClass("warning");
		}
	}
	
	// Put the total back on the order table
	$('#orderTable tbody').append("<tr><th></th><th></th><th>Total</th><th>" + "$" + (db.totals.order).toFixed(2) + "</th></tr>");
}

function printTables() {	
	// Generate new tables
	for (var i = 0; i < db.order.length; i++) {
		$('#orderTable tbody').append(tableRow(db.order[i].amount, db.order[i].itemName, "$" + db.order[i].cost));
	}
	
	// Put the total back on the order table
	$('#orderTable tbody').append("<tr><th></th><th>Total</th><th>" + "$" + (db.totals.order).toFixed(2) + "</th></tr>");
}

function resetInputs() {
	$('#multiplier').val(1);
	$('#defaultOption').attr("selected", "selected");
}

function subtotalSetup(name, cost) {
	if (db.subtotals[name] == undefined) {
		cash = prompt("How much money does " + name + " have?");
		while (isNaN(cash) || cash == "" || cash > 200) {
			cash = prompt("How much money does " + name + " have?\nNumbers only, please!");
		}
		db.subtotals[name] = {"cash": 0, "subtotal": 0, "change": 0};
		db.subtotals[name].cash = (+cash).toFixed(2);
		db.subtotals[name].subtotal = (+cost).toFixed(2);
		db.subtotals[name].change = (+cash - +db.subtotals[name].subtotal).toFixed(2);
	} else {
		db.subtotals[name].subtotal = (+db.subtotals[name].subtotal + +cost).toFixed(2);
		db.subtotals[name].change = (+cash - +db.subtotals[name].subtotal).toFixed(2);
	}
}

function orderSetup(amount, itemName, name, cost) {
	db.order[db.order.length] = {"amount": amount, "itemName": itemName, "name": name, "cost": cost}
}

function validate() {
	if ($('#multiplier').val() == "" || $('#nameField').val() == "" || $('#menuPicker option:selected').text() == "Please Select...") {
		alert("You sure you put everything in?");
		return false;
	}
	return true;
}

function tableRow() {
	var row = "";
	for (var i = 0; i < arguments.length; i++) {
		row = row + "<td>" + arguments[i] + "</td>";
	}
	return "<tr>" + row + "</tr>";
}

function getURLParameter(name) {
	return decodeURIComponent(
		((RegExp('[?|&]'+name + '=' + '(.+?)(&|$)').exec(location.search)||[null,null])[1]
	).replace(/\+/g, '%20'));
}
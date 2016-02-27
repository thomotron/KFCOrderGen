var db = {};

function webInit() {
	db = {"totals": {"cash": 0, "order": 0, "change": 0}, "order": [], "subtotals": {}};
	
	var items = [];
	
	for (var i = 0; i < menu.callback.length; i++) {
		if (menu.callback[i].name.includes("---")) {
			items[i] = ("<option disabled=true style=\"display: block;\">" + menu.callback[i].name + "</option>");
		} else if (menu.callback[i].xl != undefined) {
			items[i] = ("<option value=\"" + i + "\" size-select=\"drink\">" + menu.callback[i].name + "</option>");
		} else if (menu.callback[i].lrg != undefined || menu.callback[i].reg != undefined) {
			items[i] = ("<option value=\"" + i + "\" size-select=\"size\">" + menu.callback[i].name + "</option>");
		} else if (menu.callback[i].combo != undefined) {
			items[i] = ("<option value=\"" + i + "\" size-select=\"combo\">" + menu.callback[i].name + "</option>");
		} else {
			items[i] = ("<option value=\"" + i + "\">" + menu.callback[i].name + "</option>");
		}
	}

	$('#menuPicker').append( items.join('') );
}

function printInit() {
	db = JSON.parse(getURLParameter("db"));
}

function webTables() {
	// Clean up old tables
	$("#subtotalTable").find("tr:gt(0)").remove();
	$("#orderTable").find("tr:gt(0)").remove();
	
	// Generate new tables
	for (var i = 0; i < db.order.length; i++) {
		$('#orderTable tbody').append("<tr><td>"+db.order[i].amount+"</td><td>"+db.order[i].itemName+"</td><td>"+db.order[i].name+"</td><td>$"+db.order[i].cost+"</td><td class=\"noprint\"><button type=\"button\" class=\"btn btn-xs btn-danger remover\"><div class=\"glyphicon glyphicon-minus-sign\" /></button></td></tr>");
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
	$('#orderTable tbody').append("<tr><th></th><th></th><th>Total</th><th>" + "$" + (db.totals.order).toFixed(2) + "</th><th class=\"noprint\"></th></tr>");
}

function printTables() {
	// Merge items into a new array
	var newOrder = []
	for (var i = 0; i<db.order.length; i++) {
		var obj = db.order[i];
		
		if (!matchObj(obj)) {
			newOrder.push(obj);
		}
	}
		
	// Generate new tables
	for (var i = 0; i<newOrder.length; i++) {
		$('#orderTable tbody').append(tableRow(newOrder[i].amount, newOrder[i].itemName, "$" + (newOrder[i].cost*newOrder[i].amount).toFixed(2)));
	}
	
	// Put the total back on the order table
	$('#orderTable tbody').append("<tr><th></th><th>Total</th><th>" + "$" + (db.totals.order).toFixed(2) + "</th></tr>");
	
	function matchObj(obj) {
		for (var i = 0; i<newOrder.length; i++) {
			if (obj.itemName == newOrder[i].itemName) {
				newOrder[i].amount++;
				return true;
			}
		}
		return false;
	}
}

function resetInputs() {
	$('#multiplier').val(1);
	$('.defaultOption').attr("selected", "selected");
}

function subtotalSetup(name, cost) {
	if (db.subtotals[name] == undefined) {
		cash = prompt("How much money does " + name + " have?");
		while (isNaN(cash) || cash == "" || cash > 100) {
			cash = prompt("How much money does " + name + " have?\nNumbers below 100 only, please!");
		}
		db.subtotals[name] = {"cash": 0, "subtotal": 0, "change": 0};
		db.subtotals[name].cash = (+cash).toFixed(2);
		db.subtotals[name].subtotal = (+cost).toFixed(2);
		db.subtotals[name].change = (+cash - +db.subtotals[name].subtotal).toFixed(2);
	} else {
		db.subtotals[name].subtotal = (+db.subtotals[name].subtotal + +cost).toFixed(2);
		db.subtotals[name].change = (+cash - +db.subtotals[name].subtotal).toFixed(2);
		
		if (db.subtotals[name].subtotal == 0) { //Will remove subtotal data for names with nothing on order
			delete(db.subtotals[name]);
		}
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
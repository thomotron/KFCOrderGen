$(document).ready(function(){
	
	webInit();
	
	$('#add').click(function(){
		if (validate()) {
			var multiplier = $('#multiplier').val();
			if (multiplier > 15) {multiplier = 15};
			var name = $('#nameField').val();
			var itemName = $('#menuPicker option:selected').text();
			var menuCallback = menu.callback[parseInt($('#menuPicker option:selected').val())]; //Damn, this is a long line
			var price;
			
			// Below is size selection. It'll determine the price and name based on sizes/combos etc.
			if ($('#menuPicker option:selected').attr("size-select") == "" || $('#menuPicker option:selected').attr("size-select") == undefined) {
				price = ((menuCallback.price)*multiplier).toFixed(2);
			} else if ($('#menuPicker option:selected').attr("size-select") == "size") {
				if ($('#sizePicker option:selected').val() == "Reg") {
					price = ((menuCallback.reg.price)*multiplier).toFixed(2);
					itemName = menuCallback.reg.name;
				} else if ($('#sizePicker option:selected').val() == "Lrg") {
					price = ((menuCallback.lrg.price)*multiplier).toFixed(2);
					itemName = menuCallback.lrg.name;
				} else {
					alert("Something went wrong with the size picker.\nThe rest of the code may not act as expected from now on.")
				}
			} else if ($('#menuPicker option:selected').attr("size-select") == "combo") {
				if ($('#sizePicker option:selected').val() == "Reg") {
					price = ((menuCallback.price)*multiplier).toFixed(2);
				} else if ($('#sizePicker option:selected').val() == "CRg") {
					price = ((menuCallback.combo.reg.price)*multiplier).toFixed(2);
					itemName = menuCallback.combo.reg.name;
				} else if ($('#sizePicker option:selected').val() == "CLg") {
					price = ((menuCallback.combo.lrg.price)*multiplier).toFixed(2);
					itemName = menuCallback.combo.lrg.name;
				} else {
					alert("Something went wrong with the size picker.\nThe rest of the code may not act as expected from now on.")
				}
			} else if ($('#menuPicker option:selected').attr("size-select") == "drink") {
				if ($('#sizePicker option:selected').val() == "Reg") {
					price = ((menuCallback.reg.price)*multiplier).toFixed(2);
					itemName = menuCallback.reg.name;
				} else if ($('#sizePicker option:selected').val() == "Lrg") {
					price = ((menuCallback.lrg.price)*multiplier).toFixed(2);
					itemName = menuCallback.lrg.name;
				} else if ($('#sizePicker option:selected').val() == "XL") {
					price = ((menuCallback.xl.price)*multiplier).toFixed(2);
					itemName = menuCallback.xl.name;
				} else {
					alert("Something went wrong with the size picker.\nThe rest of the code may not act as expected from now on.")
				}
			}
			
			db.totals.order = +(+db.totals.order + +price).toFixed(2);
			orderSetup(multiplier,itemName,name,price);
			subtotalSetup(name,price);
			webTables();
			resetInputs();
		}
	})
	
	$(document).keypress(function(e){
		if (e.which == 13) {
    	$('#add').click();
    }
	})
	
	$('#print').click(function(){
		if (!$(this).hasClass("disabled")) {
			window.print();
			$.redirect('print.html', {'db': JSON.stringify(db)}, "GET");
		}
	})
	
	$('#menuPicker').click(function(){
		if ($('#menuPicker option:selected').attr("size-select") == "size") {
			$('#sizePicker option').remove();
			$('#sizePicker').append("<option>Reg</option><option>Lrg</option>");
			$('#sizePicker').attr("disabled",false);
		} else if ($('#menuPicker option:selected').attr("size-select") == "combo") {
			$('#sizePicker option').remove();
			$('#sizePicker').append("<option>Reg</option><option>CRg</option><option>CLg</option>");
			$('#sizePicker').attr("disabled",false);
		} else if ($('#menuPicker option:selected').attr("size-select") == "drink") {
			$('#sizePicker option').remove();
			$('#sizePicker').append("<option>Reg</option><option>Lrg</option><option>XL</option>");
			$('#sizePicker').attr("disabled",false);
		} else if ($('#menuPicker option:selected').attr("size-select") == "" || $('#menuPicker').attr("size-select") == undefined) {
			$('#sizePicker option').remove();
			$('#sizePicker').append("<option></option>");
			$('#sizePicker').attr("disabled",true);
		} else {
			alert("Unable to detect what sizes the menu item is applicable for.\nThe rest of the code might not work as expected from now on.");
		}
	})
	
	$(document).on("click",".remover",function(){ //Bloody hell, finally an event bound to a non-existent element
		if ($(this).find("div").hasClass("glyphicon")) {
			var index = this.parentNode.parentNode.rowIndex-1; //DOM! Straight DOM! I'm a REAL developer!
			subtotalSetup(db.order[index].name,-Math.abs(db.order[index].cost))
			db.totals.order = +(+db.totals.order - db.order[index].cost).toFixed(2)
			db.order.splice(index,1);
			webTables();
		}
	});
})
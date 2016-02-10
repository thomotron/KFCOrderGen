$(document).ready(function(){
	
	webInit();
	
	$('#add').click(function(){
		if (validate()) {
			var multiplier = $('#multiplier').val();
			if (multiplier > 15) {multiplier = 15};
			var name = $('#nameField').val();
			var price = ((menu.callback[parseInt($('#menuPicker option:selected').val())].price)*multiplier).toFixed(2)
			var itemName = $('#menuPicker option:selected').text()
			
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
})
// Una sola vez...
var script = document.createElement('script');script.src = "https://code.jquery.com/jquery-3.4.1.min.js";document.getElementsByTagName('head')[0].appendChild(script);

// Agarra los tr del tbody donde se muestran los resultados
$("#resultados").contents().find("tbody").eq(2).find("tr").toArray().map(fila => $(fila).find("td")).map(celdas => {
	return {
		"nombre": celdas.eq(1).text(),
		"domicilio": celdas.eq(2).text().replace(/( P\:.*)$/, ""),
		"domicilio_completo": celdas.eq(2).text(),
		"telefonos": celdas.eq(3).text(),
		"posicion": [],
	};
});

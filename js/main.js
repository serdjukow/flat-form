function showMap(address) {
	ymaps.ready(init)

	function init() {
		var myMap = new ymaps.Map('map', {
			center: [55.753994, 37.622093],
			zoom: 9,
		})

		ymaps
			.geocode(address, {
				/**
				 * Опции запроса
				 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geocode.xml
				 */

				results: 1,
			})
			.then(function (res) {
				// Выбираем первый результат геокодирования.
				var firstGeoObject = res.geoObjects.get(0),
					// Координаты геообъекта.
					coords = firstGeoObject.geometry.getCoordinates(),
					// Область видимости геообъекта.
					bounds = firstGeoObject.properties.get('boundedBy')

				firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption')
				firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine())
				myMap.geoObjects.add(firstGeoObject)
				myMap.setBounds(bounds, {
					checkZoomRange: true,
				})

				/**
				 * Все данные в виде javascript-объекта.
				 */
				console.log('Все данные геообъекта: ', firstGeoObject.properties.getAll())
				/**
				 * Метаданные запроса и ответа геокодера.
				 * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/GeocoderResponseMetaData.xml
				 */
				console.log('Метаданные ответа геокодера: ', res.metaData)
				/**
				 * Метаданные геокодера, возвращаемые для найденного объекта.
				 * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/GeocoderMetaData.xml
				 */
				console.log('Метаданные геокодера: ', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData'))
				/**
				 * Точность ответа (precision) возвращается только для домов.
				 * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/precision.xml
				 */
				console.log('precision', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.precision'))
				/**
				 * Тип найденного объекта (kind).
				 * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/kind.xml
				 */
				console.log('Тип геообъекта: %s', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.kind'))
				console.log('Название объекта: %s', firstGeoObject.properties.get('name'))
				console.log('Описание объекта: %s', firstGeoObject.properties.get('description'))
				console.log('Полное описание объекта: %s', firstGeoObject.properties.get('text'))
				/**
				 * Прямые методы для работы с результатами геокодирования.
				 * @see https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeocodeResult-docpage/#getAddressLine
				 */
				console.log('\nГосударство: %s', firstGeoObject.getCountry())
				console.log('Населенный пункт: %s', firstGeoObject.getLocalities().join(', '))
				console.log('Адрес объекта: %s', firstGeoObject.getAddressLine())
				console.log('Наименование здания: %s', firstGeoObject.getPremise() || '-')
				console.log('Номер подъезда: %s', firstGeoObject.getPremiseNumber() || '-')

				const results = {
					coords: coords,
					country: firstGeoObject.getCountry(),
					city: firstGeoObject.getLocalities().join(', '),
					address: firstGeoObject.getAddressLine(),
				}
				resultToHtml(results)
			})
	}
}

function getFlat() {
	const searchFlatForm = document.getElementById('search-flat-form')
	const address = {}
	let addressString = ''
	searchFlatForm.addEventListener('submit', e => {
		e.preventDefault()
		const formInputs = e.target.querySelectorAll('input')
		formInputs.forEach(el => {
			address[el.name] = el.value
			addressString += el.value + ','
		})
		showMap(addressString)
	})
}
getFlat()

function resultToHtml(address) {
	const result = document.getElementById('result')
	result.innerHTML = `
		<div class="row my-3 text-center">
			<h5>Ваш адрес:<h5>
			<p>${address.country}</p>
			<p>${address.city}</p>
			<p>${address.address}</p>
			<p>${address.coords}</p>
			<div class="row mx-0 text-center">
				<button class="btn btn-success">Отправить</button>
			</div>
		</div>
	`
}

const selectSingle = document.querySelector('.select');
const selectSingle_title = document.querySelector('.select__title');
const selectSingle_labels = document.querySelectorAll('.select__label');
const label = document.querySelectorAll('label');
const cityTitle = document.querySelector('.city-title');
const c = document.querySelector('.celsius');
const f = document.querySelector('.fahrenheit');
let temp = document.querySelector('.first-line__temp');

							// Toggle menu городов

selectSingle_title.addEventListener('click', () => {
	if ('active' === selectSingle.getAttribute('data-state')) {
	selectSingle.setAttribute('data-state', '');
	}else{
		selectSingle.setAttribute('data-state', 'active');
	}
});

							// Открытие - закрытие меню городов

for (let i = 0; i < selectSingle_labels.length; i++) {
  selectSingle_labels[i].addEventListener('click', (evt) => {
    selectSingle_title.textContent = evt.target.textContent;
    selectSingle.setAttribute('data-state', '');
  });
}


							// Переключатель градусов

f.addEventListener('click', ()=>{
	f.classList.add('active');
	c.classList.remove('active');
	let num = +parseInt(temp.innerHTML) + 34;
	temp.innerHTML = num + '&deg';
});
c.addEventListener('click', ()=>{
	c.classList.add('active');
	f.classList.remove('active');
	let num = +parseInt(temp.innerHTML) - 34;
	temp.innerHTML = num + '&deg';
});

							//Слайдер для погоды на 7 дней вперед + адаптив

let offset = 0;
let tenDayContent = document.querySelector('.ten-day__content');
let left = document.querySelector('.offset-left');
let right = document.querySelector('.offset-right');
let offsetBgL = document.querySelector('.offset__bgl');
let offsetBgR = document.querySelector('.offset__bgr');
	
	left.addEventListener('click', ()=>{
		if(window.screen.width >= 1024){
			offset+=305;
			tenDayContent.style.left = -offset + 'px';
				if(offset == 305){
					left.style.display = 'none';
					offsetBgL.style.display = 'none';
					right.style.display = 'initial';
					offsetBgR.style.display = 'initial';
	}
}else if(window.screen.width < 1024 && window.screen.width >= 768){
				offset+=750;
				tenDayContent.style.left = -offset + 'px';
					if(offset == 750){
						left.style.display = 'none';
						offsetBgL.style.display = 'none';
						right.style.display = 'initial';
						offsetBgR.style.display = 'initial';
	}
}else{
	left.removeEventListener('click', ()=>{});
}

});
	right.addEventListener('click', ()=>{
	offset = 0;
	tenDayContent.style.left = offset + 'px';
	if(offset == 0){
		right.style.display = 'none';
		offsetBgR.style.display = 'none';
		left.style.display = 'initial';
		offsetBgL.style.display = 'initial';
	};

});




									// Погода, fetch запросы
const param ={
	url: "https://api.openweathermap.org/data/2.5/onecall",
	appid: "cfb0c20cebcd07571578ee730ca5a46b",
	units: "units=metric&exclude=minutely&appid"
}
const coord = {
	Bergen: 		"lat=60.392&lon=5.328",
	Ålesund:   		"lat=62.4723&lon=6.1549",
	Oslo:      		"lat=59.9127&lon=10.7461",
	Trondheim: 		"lat=63.4305&lon=10.3951",
	Stavanger: 		"lat=58.9701&lon=5.7333",
	Narvik: 		"lat=68.4384&lon=17.4272",
	Bodø: 			"lat=67.28&lon=14.405",
	Kristiansund: 	"lat=63.1115&lon=7.732",
	Kristiansand: 	"lat=58.1467&lon=7.9956",
	Tromsø: 		"lat=69.6496&lon=18.957",
	Alta: 			"lat=69.9689&lon=23.2717" 

}

for(let i = 0; i < label.length; i++) label[i].addEventListener('click', weather);

		function weather(){
			cityTitle.textContent = "Current weather in " + this.textContent;
				let url = `${param.url}${'?'}${coord[this.textContent]}${'&'}${param.units}${'='}${param.appid}`

			fetch(url)
				.then(function(resp) {return resp.json()})
				.then(function(data) {
					console.log(data);
					let temp = document.querySelector('.first-line__temp');
					let summary = document.querySelector('.summary__title');
					let summarySub = document.querySelector('.summary__subtitle');
					let mainIcon = document.querySelector('.first-line__icon');
					let meaning = document.querySelectorAll('.second-line__meaning');
					const body = document.querySelector('body');
					const sunDay = document.querySelector('.forecast-wrap');
					const alert = document.querySelector('.summary__alert');

							 temp.innerHTML = Math.round(data.current.temp) + '&deg';
							 summary.innerHTML = data.current.weather[0].main;
							 summarySub.innerHTML = data.current.weather[0].description;
							 // mainIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`; принцип понял, все работает, но иконки дурацкие предлагаются, странное решение подбора цвета. Снег например всегда черный, солнце ночью черное...ну такое. Дизайн тот еще.
							 // mainIcon.style.filter = 'invert(1)'; таким образом пробовал менять цвет с черного на белый.... в итоге закомментировал и просто заменил иконки на собственные
							 meaning[0].innerHTML = Math.round(data.current.feels_like) + '&deg';
							 meaning[1].innerHTML = data.current.wind_speed + ' m/s';
							 meaning[2].innerHTML = data.current.visibility / 1000 + ' km';
							 meaning[3].innerHTML = data.current.humidity + '%';
							 meaning[4].innerHTML = data.current.pressure + ' hpa';
							 meaning[5].innerHTML = data.current.dew_point + '&deg';

				// Уведомление в случае экстренных условий и различных предупреждений прогноза погоды
					
							if(data.alerts != undefined){
								alert.innerHTML = data.alerts[0].description;
							}else{
								alert.innerHTML = '';
							};

						/*Назначение фона в различных случаях погоды*/
								body.removeAttribute('class');
								body.setAttribute('class', `${summary.innerHTML}`);
								mainIcon.removeAttribute('class');
								mainIcon.setAttribute('class',`${'first-line__icon'} ${summary.innerHTML}${'-icon'}`)

						// Прогноз погоды на 7 дней вперед

							// Погодные условия

							const weatherPrediction = document.querySelectorAll('.day__weather-prediction');
							let count = 0;
							weatherPrediction.forEach(element=>{
								 element.innerHTML = data.daily[count].weather[0].description;
								 count++;
							})

							 //Дневная температура

							 const tempDay = document.querySelectorAll('.temperature__day');
							 count = 0;
							 	tempDay.forEach(element=>{
							 		tempDay[count].innerHTML = `${Math.round(data.daily[count].temp.day)}${'&deg'}`;
							 		count++;
							 	});

							 //Ночная температура

							 const tempNight = document.querySelectorAll('.temperature__night');
							 count = 0;
							 		tempNight.forEach(element=>{
							 		tempNight[count].innerHTML = `${Math.round(data.daily[count].temp.night)}${'&deg'}`;
							 		count++;
							 	});

							 // Иконки прогноза погоды на 7 дней

							 let icon = document.querySelectorAll('.daily__icon');
							 count = 0;
							 	icon.forEach(element=>{
							 	icon[count].setAttribute('src', `https://openweathermap.org/img/wn/${data.daily[count].weather[0].icon}.png`);
							 	count++;
							 	});

							 // Вероятность осадков

							 let pop = document.querySelectorAll('.day__pop');
							 count = 0;
							 	pop.forEach(element=>{
							 		pop[count].innerHTML = `${Math.round(data.daily[count].pop*100)}${'%'}`;
							 		count++;
							 	});

// конвертация времени из Timestamp into a human readable date

let d1 = function date(){
	let unixTimestamp = data.daily[count].dt;/*в этой строке есть ошибка*/
	const milliseconds = unixTimestamp * 1000
	const dateObject = new Date(milliseconds)
	const humanDateFormat = dateObject.toLocaleString('en-EU', {weekday: 'short', day: 'numeric'});
return humanDateFormat;

}
count = 1;
let day = document.querySelectorAll('.day__title');
	day.forEach(element =>{
		day[count].innerHTML = d1();count++;
		});
	});

}

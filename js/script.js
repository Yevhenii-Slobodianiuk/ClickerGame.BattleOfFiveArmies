'use strict';

/* Animaited Title*/
let tit = document.title;
let c = 0;
	function writeTitle() {
		document.title = tit.substring(0,c);
		if(c==tit.length) { 
			c = 0; 
			setTimeout("writeTitle()", 1000);
		} 
		else { 
			c++; 
			setTimeout("writeTitle()", 200);
		} 
	}
writeTitle();

document.addEventListener('DOMContentLoaded', () => {
	/* ----- Глобальні змінні ----- */
	const enemy = document.querySelector('.enemy'),
				score = document.getElementById('user-score'),
				registrationForm = document.getElementById('registration-form'),
				topBar = document.querySelector('.topBar');

	let Level = 0,
			CurentEnemyHpCount = 0;

	const enemies = [
		{
			name: 'Knight',
			tag: '<img src="img/enemy/knight.png" style="width: 300px; left: 43%;" alt="knight">',
			hpCount: 10,
			background: 'img/background/level1.jpg',
			level: 1,
		},
		{
		name: 'Goblin',
		tag: '<img src="img/enemy/goblin.png" alt="goblin">',
		hpCount: 12,
		background: 'img/background/level2.jpg',
		level: 2,
		},
		{
		name: 'Ork',
		tag: '<img src="img/enemy/ork.png" alt="ork">',
		hpCount: 14,
		background: 'img/background/level3.jpg',
		level: 3,
		},
		{
		name: 'Wizard',
		tag: '<img src="img/enemy/wizard.png" style="left: 36%;" alt="wizard">',
		hpCount: 16,
		background: 'img/background/level4.jpg',
		level: 4,
		},
		{
		name: 'Ghost',
		tag: '<img src="img/enemy/ghost.png" alt="ghost">',
		hpCount: 20,
		background: 'img/background/level5.jpg',
		level: 5,
		}
	];


	/* ----- Функція валідації форми ----- */
	function validation(form) { 
		const registrationInputs = form.querySelectorAll('input'),
					registrationName =  document.getElementById('registration-name'),
					userName = document.getElementById('user-name');

		let emptyInputs = Array.from(registrationInputs).filter(input => input.value === '');

		registrationInputs.forEach((input) => {
			if (input.value.trim() === '') {
				input.parentNode.classList.add('error');
				input.value = '';
				console.log('input not field');
			} else {
				input.parentNode.classList.remove('error');
			}
		});

		if (emptyInputs.length !== 0) {
			console.log('inputs not field');
			return false;
		} else {
			userName.innerHTML = `<img style="width: 23px; height: 23px" src="icons/topBar/user.png" alt="usericon">${registrationName.value}`
		}
		return true;
	}


	registrationForm.addEventListener('submit', (e) => {
		e.preventDefault();

		if (validation(registrationForm) == true) {
			registrationForm.classList.add('hide');
			enemy.classList.remove('hide');
			topBar.classList.remove('hide');
			updateLevel(Level++);
		}
	});

	/* ----- Функція звуку ----- */

	function sound () {
		const music = new Audio('audio/music.mp3');
		const audioBtn = document.querySelector('.volume');
		let start = false;
		music.loop = true;
		music.volume = 0.7;

		const punch = new Audio('audio/punch.mp3');
		punch.volume = 0.3;
		

		audioBtn.addEventListener('click', () => {
			if (start === false) {
				start = true;
				music.play();
				enemy.addEventListener('click', () => {
					punch.play();
				})
				audioBtn.innerHTML = `<img src="icons/sound/volume-on.png" alt="" class="volume"></img>`;
			} else {
				start = false;
				music.pause();
				enemy.addEventListener('click', () => {
					punch.pause();
				})
				audioBtn.innerHTML = `<img src="icons/sound/volume-off.png" alt="" class="volume"></img>`;
			}
		});
	}
	sound();
	
		/* ----- Функція збільшення рахунку ----- */
		function addScore(enemy, pointsCount) {
			enemy.addEventListener('click', () => {
				pointsCount++;
				score.innerHTML = `<img src="icons/topBar/point.svg" alt="score">
														${pointsCount} points
													`
			});
		}
	
		/* ----- Функція зменшення здоров'я ворога ----- */
		function createClickListener() {
			const enemyHp = document.querySelector('#enemy-hp'),
						enemyStrip = document.querySelector('.topBar__strip-hp');
	
			enemy.addEventListener('click', () => {
				CurentEnemyHpCount--;
				enemyHp.innerHTML = `${CurentEnemyHpCount} HP`;
				enemyStrip.style.width = `${enemyStrip.clientWidth - (enemyStrip.clientWidth / (CurentEnemyHpCount + 1))}px`;
				
				if (CurentEnemyHpCount === 0 && Level < enemies.length){
					createWindowNextLevel();
				}else if (CurentEnemyHpCount === 0 && Level === enemies.length) {
					createFinishWindow();
				}
			});
		}
	
		/* ----- Функція визначення ворога ----- */
		function defineEnemy(enemyConf) {
			const enemyHp = document.querySelector('#enemy-hp'),
						enemyName = document.querySelector('#enemy-name'),
						userLevel = document.querySelector('#user-level'),
						enemyStrip = document.querySelector('.topBar__strip-hp');
	
			enemyHp.innerHTML = `${enemyConf.hpCount} HP`;
			enemyName.innerHTML =`${enemyConf.name}`;
			userLevel.innerHTML = `<img src="icons/topBar/lvl.svg" alt="level"> ${enemyConf.level} Level`;
			enemyStrip.style.width = '535px';
			document.querySelector('.container').style.background = `no-repeat center / cover url("${enemyConf.background}")`;
			enemy.innerHTML = `${enemyConf.tag}`;
		}
	
		/* ----- Функція оновлення рівня ----- */
		function updateLevel(level) {
			defineEnemy(enemies[level]);
			CurentEnemyHpCount = enemies[level].hpCount;
		}

	/* ----- Функція створення вікна для переходу на наступний рівень ----- */
	function createWindowNextLevel() {
		const nextLevel = document.querySelector('.next-level');

		nextLevel.classList.remove('hide');

		nextLevel.querySelector('.next-level__btn').addEventListener('click', () => {
			nextLevel.classList.add('hide');
			updateLevel(Level++);
		}, {once: true})
	}

	/* ----- Функція створення вікна для завершення гри ----- */
	function createFinishWindow() {
		const finishWindow = document.querySelector('.finish'),
					finishWindowBtn = document.querySelector('.finish__btn');

		finishWindow.classList.remove('hide');

		finishWindowBtn.addEventListener('click', () => {
			window.location.reload();
		})
	}

	function gamePlay() {
		let pointsCount = 0;

		CurentEnemyHpCount = 10;

		addScore(enemy, pointsCount);
		createClickListener();
		
	}
	gamePlay()
});

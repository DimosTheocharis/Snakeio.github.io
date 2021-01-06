let lastRenderTime = 0;
let speed = 5;
let Experience_Limit = localStorage.getItem('Experience_Limit');
var bar = document.getElementsByClassName('results-window__experience-bar__underneath')[0];
var level_text = document.getElementsByClassName("results-window__level__underneath__level-text")[0];
var button_play_again = document.getElementsByClassName('results-window__buttons__play-again')[0];
var button_shop = document.getElementsByClassName("results-window__buttons__shop")[0];
var button_main_menu = document.getElementsByClassName('results_window_buttons__main-menu')[0];
var apple_eaten = document.getElementsByClassName('results-window__informations__apples-eaten')[0];
var golden_apple_eaten = document.getElementsByClassName('results-window__informations__golden-apples-eaten')[0];
var score = document.getElementsByClassName("results-window__informations__score")[0];
var load_first_time = true;


function main(currentTime) {
    window.requestAnimationFrame(main);
    let secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / 150 * speed) return;
    updateResults();
    lastRenderTime = currentTime;
}



/* Diorthwnw to level */
if (Number(localStorage.getItem('Level')) < 10) {
    level_text.innerHTML = localStorage.getItem('Level');
} else {
    level_text.style.fontSize = '18px';
    level_text.style.paddingLeft = '5px';
    level_text.style.paddingTop = '5px';
    level_text.innerHTML = localStorage.getItem('Level');
}

/* Topothetw tis times gia ta apple-eaten kai score */
apple_eaten.innerHTML += localStorage.getItem('Apples_eaten');
golden_apple_eaten.innerHTML += localStorage.getItem('Golden_Apples_eaten');
score.innerHTML += localStorage.getItem('Score');


window.requestAnimationFrame(main);

function updateResults() {
    if (localStorage.getItem('Experience_earned') > 0 ){
        if (Number(localStorage.getItem('Experience')) < Number(Experience_Limit)) {
            localStorage.setItem('Experience', `${Math.floor(localStorage.getItem('Experience')) + 1}`);
            localStorage.setItem('Experience_earned', `${Math.floor(localStorage.getItem('Experience_earned')) -1 }`);
        } else {
            localStorage.setItem('Experience','0');
            level_text.innerHTML = parseInt(level_text.innerHTML) + 1;
            localStorage.setItem('Level', `${Math.floor(localStorage.getItem('Level')) + 1}`);
            localStorage.setItem('Experience_Limit', `${Math.floor(localStorage.getItem('Experience_Limit')) + 100}`);
        }
    } else {
        
        /*Kathe button sto results tha pigainei sto antistoixo file*/
        button_play_again.addEventListener('click', ()=> {
            window.location = "https://dimostheocharis.github.io/Snake.io/index.html";
        })

        button_shop.addEventListener('click', ()=> {
            window.location = "https://dimostheocharis.github.io/Snake.io/shop.html";
        })

        button_main_menu.addEventListener('click', () => {
            window.location = "https://dimostheocharis.github.io/Snake.io/MainMenu.html";
        })
    };
    bar.style.width = `${Math.floor(localStorage.getItem('Experience') / Number(Experience_Limit) * 100)}` + '%';
    bar.innerHTML = `${Math.floor(localStorage.getItem('Experience') / Number(Experience_Limit) * 100)}` + '%';


}

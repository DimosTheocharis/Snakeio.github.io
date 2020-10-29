/* -------------------------------------------------------VARIABLES----------------------------------------------------------*/

let coins = document.getElementsByClassName('number-of-coins');
var buy = document.getElementsByClassName("Shop-container__items__item__buy");
var availability_text = document.getElementsByClassName('availability_button');
var back = document.getElementsByClassName("back-profile-coins__back-profile__back");
var items = document.getElementsByClassName("Shop-container__items__item");
var cost = document.getElementsByClassName("Cost");
var unlock = document.getElementsByClassName('Unlock');
var bar = document.getElementsByClassName('bpc__experience-bar__underneath')[0];
var text_level = document.getElementsByClassName('bpc__level__underneath__level-text')[0];
var model = document.getElementsByClassName('bpc__model-experience__model')[0];
var experience_text = document.getElementsByClassName('bpc__model-experience__experience')[0];
var level = localStorage.getItem('Level');
let Experience_Limit = localStorage.getItem('Experience_Limit');

var prices = {
    'Red Head Color': 50,
    'Blue Head Color': 50,
    'Yellow Head Color': 100,
    'Purple Head Color': 100,
    'Pink Head Color': 200,
    'Orange Head Color': 200,
    'Grey Head Color': 450,
    'Black Head Color': 750,
    'Red Body Color': 50,
    'Blue Body Color': 50,
    'Yellow Body Color': 100,
    'Purple Body Color': 100,
    'Pink Body Color': 200,
    'Orange Body Color': 200,
    'Grey Body Color': 450,
    'Black Body Color': 750
    
};

var unlock_status = {
    'Red Head Color': 1,
    'Blue Head Color': 1,
    'Yellow Head Color': 5,
    'Purple Head Color': 5,
    'Pink Head Color': 7,
    'Orange Head Color': 7,
    'Grey Head Color': 10,
    'Black Head Color': 15,
    'Red Body Color': 1,
    'Blue Body Color': 1,
    'Yellow Body Color': 5,
    'Purple Body Color': 5,
    'Pink Body Color': 7,
    'Orange Body Color': 7,
    'Grey Body Color': 10,
    'Black Body Color': 15
}

/* ----------------------------------------------------------FUNCTIONS-------------------------------------------------------------*/
/* Ta Coins pairnoun thn timh apo to Local Storage */ 
coins[0].innerHTML = localStorage.getItem('Coins');

/* koumpi gia na paei pisw sto game */ 
back[0].addEventListener('click', () => {
    var link = document.getElementById("link");
    link.href = "./MainMenu.html";
})

/* function gia na arxikopoiei ta availability status twn proiointwn tou shop sto local storage */
for (let i =0; i < items.length; i++) {
    let product_title = items[i].childNodes[1].innerHTML;
    if (localStorage.getItem(product_title) === null) {
        localStorage.setItem(product_title, 'unsold');
    }
}

for (let i =0;i <items.length; i++) {
    let product_title = items[i].childNodes[1].innerHTML;
    if (unlock_status[product_title] > Number(level)) {
        localStorage.setItem(product_title, 'locked');
    } else if (localStorage.getItem(product_title) === 'locked') {
        localStorage.setItem(product_title, 'unsold');
    }
}

/* function gia na topothetei to katallhlo xrwma sto item pou exei ginei eqquiped */
function get_eqquiped_items() {
    for (let d=0;d<items.length;d++) {
        let product_title = items[d].childNodes[1].innerHTML;
        if (localStorage.getItem(product_title) === 'locked') {
            availability_text[d].innerHTML = 'Locked';
            buy[d].style.backgroundColor = 'rgb(50,50,50)';
        }
        if (localStorage.getItem(product_title) === 'unsold') {
            availability_text[d].innerHTML = 'Buy';
            buy[d].onmouseover = () => {
                buy[d].style.backgroundColor = 'rgb(25,25,25)';
            }
            buy[d].onmouseout = () => {
                buy[d].style.backgroundColor = 'rgb(50,50,50)';
            } 
        } else if (localStorage.getItem(product_title) === 'bought') {
            availability_text[d].innerHTML = 'Equip';
            buy[d].style.backgroundColor = 'rgb(50,50,50)';
            buy[d].onmouseover = () => {
                buy[d].style.backgroundColor = 'rgb(25,25,25)';
            }
            buy[d].onmouseout = () => {
                buy[d].style.backgroundColor = 'rgb(50,50,50)';
            }
         
        } else if (localStorage.getItem(product_title) === 'equipped') {
            availability_text[d].innerHTML = 'Equipped';
            buy[d].style.backgroundColor = 'rgb(25,25,25)';
            buy[d].onmouseover = () => {
                buy[d].style.backgroundColor = 'rgb(25,25,25)';
            }
            buy[d].onmouseout = () => {
                buy[d].style.backgroundColor = 'rgb(25,25,25)';
            } 
        }
    }
}
get_eqquiped_items();

/* bazw to experience */
var maxXp = 0;
for (let d=1;d<=Number(level);d++) {
    maxXp += d * 100;
}
experience_text.innerHTML += localStorage.getItem('Total_Experience') + ' / ' + `${maxXp}`;

/* function gia na topothetei kai na allazei to xrwma tou snake model analoga me to ti kaneis equip */
function snakeModel() {
    var blocks = model.childNodes;
    blocks[1].style.backgroundColor = localStorage.getItem('Snake Head Color');
    blocks[3].style.backgroundColor = localStorage.getItem('Snake Body Color');
    blocks[5].style.backgroundColor = localStorage.getItem('Snake Body Color');
}
snakeModel();

/* Buy Function kai topothetisi timhs sto "It costs: " */
for (let i = 0; i < items.length; i++) {
    let product_title = items[i].childNodes[1].innerHTML;
    buy[i].addEventListener('click', () => {
        if (localStorage.getItem(product_title) === 'unsold') {
            if (localStorage.getItem("Coins") > prices[product_title]) {
                coins[0].innerHTML = Number(coins[0].innerHTML) - prices[product_title];
                localStorage.setItem('Coins', `${Math.floor(localStorage.getItem('Coins')) - prices[product_title]}`);
                localStorage.setItem(product_title, 'bought');
            }
        } else if (localStorage.getItem(product_title) === 'bought') {
            if (i <= 7) {
                for (let d=0; d<=7; d++) {
                    if (localStorage.getItem(items[d].childNodes[1].innerHTML) === 'equipped') {
                        localStorage.setItem(items[d].childNodes[1].innerHTML, 'bought');
                    }
                }
            } else if (i <= 15) {
                for (let d=8; d<=15; d++) {
                    if (localStorage.getItem(items[d].childNodes[1].innerHTML) === 'equipped') {
                        localStorage.setItem(items[d].childNodes[1].innerHTML, 'bought');
                    }
                }
            }
            localStorage.setItem(product_title, 'equipped');
            console.log('first');
            switch(i) {
                case 0:
                    localStorage.setItem('Snake Head Color', 'red');
                    break;
                case 1:
                    localStorage.setItem('Snake Head Color', 'blue');
                    break;
                case 2:
                    localStorage.setItem('Snake Head Color', 'yellow');
                    break;
                case 3:
                    localStorage.setItem('Snake Head Color', 'purple');
                    break;
                case 4:
                    localStorage.setItem('Snake Head Color', 'pink');
                    break;
                case 5:
                    localStorage.setItem('Snake Head Color', 'orange');
                    break;
                case 6:
                    localStorage.setItem('Snake Head Color', 'grey');
                    break;
                case 7:
                    localStorage.setItem('Snake Head Color', 'black');
                    break;
                case 8:
                    localStorage.setItem('Snake Body Color', 'red');
                    break;
                case 9:
                    localStorage.setItem('Snake Body Color', 'blue');
                    break;
                case 10:
                    localStorage.setItem('Snake Body Color', 'yellow');
                    break;
                case 11:
                    localStorage.setItem('Snake Body Color', 'purple');
                    break;
                case 12:
                    localStorage.setItem('Snake Body Color', 'pink');
                    break;
                case 13:
                    localStorage.setItem('Snake Body Color', 'orange');
                    break;
                case 14:
                    localStorage.setItem('Snake Body Color', 'grey');
                    break;
                case 15:
                    localStorage.setItem('Snake Body Color', 'black');
                    break;
            }
            snakeModel();
        }
        get_eqquiped_items();
    })
    cost[i].innerHTML += ` ${prices[product_title]} coins.`;
    unlock[i].innerHTML += ` ${unlock_status[product_title]}`;

}

/* Function gia to Experience bar */
bar.style.width = `${Math.floor(localStorage.getItem('Experience') / Number(Experience_Limit) * 100)}` + '%';
bar.innerHTML = `${Math.floor(localStorage.getItem('Experience') / Number(Experience_Limit) * 100)}` + '%';
if (Number(localStorage.getItem('Level')) < 10) {
    text_level.innerHTML = localStorage.getItem('Level');
} else {
    text_level.style.fontSize = '18px';
    text_level.style.paddingLeft = '5px';
    text_level.style.paddingTop = '5px';
    text_level.innerHTML = localStorage.getItem('Level');
}



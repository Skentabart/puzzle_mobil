const board = document.getElementById("board");
const levelText = document.getElementById("levelText");

let level = 1;
const maxLevel = 10;

const gridSize = 3; // 3x3 пазл
let tiles = [];

function loadLevel(){

    board.innerHTML = "";
    tiles = [];

    levelText.innerText = "Level " + level;

    const image = `images/level${level}.jpg`;

    let positions = [];

    for(let i=0;i<gridSize*gridSize;i++){
        positions.push(i);
    }

    // перемешиваем
    positions.sort(()=>Math.random()-0.5);

    positions.forEach((pos,index)=>{

        const tile = document.createElement("div");
        tile.className="tile blur";

        tile.dataset.correct = index;
        tile.dataset.current = pos;

        tile.style.backgroundImage = `url(${image})`;

        const x = pos % gridSize;
        const y = Math.floor(pos / gridSize);

        tile.style.backgroundPosition =
            `${(x/(gridSize-1))*100}% ${(y/(gridSize-1))*100}%`;

        enableDrag(tile);

        board.appendChild(tile);
        tiles.push(tile);
    });

}

let dragSrc = null;

function enableDrag(tile){

    tile.addEventListener("pointerdown",()=>{
        dragSrc = tile;
    });

    tile.addEventListener("pointerup",()=>{

        if(dragSrc && dragSrc !== tile){

            swapTiles(dragSrc,tile);
            checkWin();
        }

        dragSrc=null;
    });
}

function swapTiles(a,b){

    let temp = a.style.backgroundPosition;
    a.style.backgroundPosition = b.style.backgroundPosition;
    b.style.backgroundPosition = temp;

    let tempData = a.dataset.current;
    a.dataset.current = b.dataset.current;
    b.dataset.current = tempData;
}

function checkWin(){

    let win = true;

    tiles.forEach(tile=>{
        if(tile.dataset.correct !== tile.dataset.current){
            win=false;
        }
    });

    if(win){

        // убрать blur
        tiles.forEach(t=>t.classList.remove("blur"));

        setTimeout(()=>{

            level++;

            if(level<=maxLevel){
                loadLevel();
            }else{
                alert("Game Complete!");
            }

        },1500);
    }
}

loadLevel();

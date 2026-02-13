const board = document.getElementById("board");
const label = document.getElementById("levelLabel");

const GRID = 3;

let images = [];
let level = 0;
let tiles = [];
let dragTile = null;

async function init(){

    // загружаем список изображений
    const res = await fetch("images/list.json");
    images = await res.json();

    loadLevel();
}

function waitBoardReady(){

    return new Promise(resolve=>{

        function check(){
            if(board.offsetWidth>0) resolve();
            else requestAnimationFrame(check);
        }

        check();
    });
}

async function loadLevel(){

    await waitBoardReady();

    board.innerHTML="";
    tiles=[];

    label.textContent=`Level ${level+1}/${images.length}`;

    const img="images/"+images[level];

    let order=[...Array(GRID*GRID).keys()];
    order.sort(()=>Math.random()-0.5);

    const size = board.offsetWidth / GRID;

    for(let i=0;i<GRID*GRID;i++){

        const div=document.createElement("div");

        div.className="tile blur";

        div.dataset.correct=i;
        div.dataset.current=order[i];

        const cx=order[i]%GRID;
        const cy=Math.floor(order[i]/GRID);

        div.style.width=size+"px";
        div.style.height=size+"px";

        div.style.backgroundImage=`url(${img})`;
        div.style.backgroundSize=`${GRID*100}% ${GRID*100}%`;

        div.style.backgroundPosition=
            `${(cx/(GRID-1))*100}% ${(cy/(GRID-1))*100}%`;

        setPos(div,i,size);

        enableDrag(div);

        board.appendChild(div);
        tiles.push(div);
    }
}

function setPos(tile,index,size){

    const x=index%GRID;
    const y=Math.floor(index/GRID);

    tile.style.transform=`translate(${x*size}px,${y*size}px)`;
}

function enableDrag(tile){

    tile.onpointerdown=()=>{
        dragTile=tile;
    };

    tile.onpointerup=()=>{

        if(!dragTile || dragTile===tile) return;

        swap(dragTile,tile);
        dragTile=null;
        checkWin();
    };
}

function swap(a,b){

    let temp=a.dataset.current;
    a.dataset.current=b.dataset.current;
    b.dataset.current=temp;

    updatePositions();
}

function updatePositions(){

    const size = board.offsetWidth / GRID;

    tiles.forEach(t=>{
        setPos(t,Number(t.dataset.current),size);
    });
}

function checkWin(){

    let win=true;

    tiles.forEach(t=>{
        if(t.dataset.correct!==t.dataset.current) win=false;
    });

    if(win){

        tiles.forEach(t=>t.classList.remove("blur"));

        setTimeout(()=>{

            level++;

            if(level>=images.length){
                alert("Все уровни пройдены!");
                level=0;
            }

            loadLevel();

        },1000);
    }
}

window.addEventListener("resize",updatePositions);

init();

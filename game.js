const board = document.getElementById("board");
const label = document.getElementById("levelLabel");

const GRID = 3;
const MAX_LEVEL = 10;

let level = Number(localStorage.getItem("puzzleLevel")) || 1;

let tiles = [];
let dragTile = null;

function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
        let j=Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]]=[arr[j],arr[i]];
    }
}

function loadLevel(){

    board.innerHTML="";
    tiles=[];

    label.textContent="Level "+level;

    const img=`images/${level}.jpg`;

    let order=[...Array(GRID*GRID).keys()];
    shuffle(order);

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

        setPosition(div,i,size);

        enableTouch(div);

        board.appendChild(div);
        tiles.push(div);
    }
}

function setPosition(tile,index,size){

    const x=index%GRID;
    const y=Math.floor(index/GRID);

    tile.style.transform=`translate(${x*size}px,${y*size}px)`;
}

function enableTouch(tile){

    tile.addEventListener("pointerdown",e=>{
        dragTile=tile;
    });

    tile.addEventListener("pointerup",e=>{

        if(!dragTile || dragTile===tile) return;

        swap(dragTile,tile);
        dragTile=null;
        checkWin();
    });
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
        setPosition(t,Number(t.dataset.current),size);
    });
}

function checkWin(){

    let win=true;

    tiles.forEach(t=>{
        if(t.dataset.correct!==t.dataset.current){
            win=false;
        }
    });

    if(win){

        tiles.forEach(t=>t.classList.remove("blur"));

        setTimeout(()=>{

            level++;
            if(level>MAX_LEVEL){
                alert("Игра пройдена!");
                level=1;
            }

            localStorage.setItem("puzzleLevel",level);
            loadLevel();

        },1200);
    }
}

window.addEventListener("resize",()=>updatePositions());

loadLevel();

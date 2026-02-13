const board = document.getElementById("board");
const label = document.getElementById("levelLabel");

const GRID = 3;

// список файлов (PNG)
const images = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png"
];

let level = 0;
let tiles = [];
let dragTile = null;

function waitBoardReady(callback){

  function check(){
    if(board.offsetWidth > 0) callback();
    else requestAnimationFrame(check);
  }

  check();
}

function loadLevel(){

  waitBoardReady(()=>{

    board.innerHTML="";
    tiles=[];

    const imgSrc = "images/" + images[level];

    console.log("LOAD IMAGE:", imgSrc);

    label.textContent=`Level ${level+1}/${images.length}`;

    let order=[...Array(GRID*GRID).keys()];
    order.sort(()=>Math.random()-0.5);

    const size = board.offsetWidth / GRID;

    for(let i=0;i<GRID*GRID;i++){

      const tile=document.createElement("div");
      tile.className="tile blur";

      tile.dataset.correct=i;
      tile.dataset.current=order[i];

      tile.style.width=size+"px";
      tile.style.height=size+"px";

      // создаём IMG вместо background
      const img=document.createElement("img");

      img.src = imgSrc;
      img.draggable = false;

      img.style.width = (GRID*100)+"%";
      img.style.height = (GRID*100)+"%";
      img.style.position="absolute";

      const cx=order[i]%GRID;
      const cy=Math.floor(order[i]/GRID);

      img.style.left = -(cx*size)+"px";
      img.style.top = -(cy*size)+"px";

      tile.appendChild(img);

      setPosition(tile,i,size);

      enableDrag(tile);

      board.appendChild(tile);
      tiles.push(tile);
    }

  });
}

function setPosition(tile,index,size){

  const x=index%GRID;
  const y=Math.floor(index/GRID);

  tile.style.transform=`translate(${x*size}px,${y*size}px)`;
}

function enableDrag(tile){

  tile.onpointerdown=()=>dragTile=tile;

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
    setPosition(t,Number(t.dataset.current),size);
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
        alert("Игра завершена");
        level=0;
      }

      loadLevel();

    },1000);
  }
}

window.addEventListener("resize",updatePositions);

loadLevel();

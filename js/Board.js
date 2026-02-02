import { RAW_MAP } from './constants.js';

export default class Board {
    constructor() {
        this.gridMap = this.generateGrid();
        this.renderTiles();
        this.setupControls();
    }

    generateGrid() {
        let grid = [];
        grid.push({r:11,c:11}); // 0
        for(let c=10;c>=2;c--) grid.push({r:11,c:c}); 
        grid.push({r:11,c:1}); // 10
        for(let r=10;r>=2;r--) grid.push({r:r,c:1}); 
        grid.push({r:1,c:1}); // 20
        for(let c=2;c<=10;c++) grid.push({r:1,c:c}); 
        grid.push({r:1,c:11}); // 30
        for(let r=2;r<=10;r++) grid.push({r:r,c:11}); 
        return grid;
    }

    renderTiles() {
        const board = document.getElementById('board');
        RAW_MAP.forEach((d, i) => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `tile-${i}`;
            tile.style.gridRow = this.gridMap[i].r;
            tile.style.gridColumn = this.gridMap[i].c;

            if(d.type === 'city') {
                tile.innerHTML = `<div class="tile-header" style="background:${d.group}"></div><div class="tile-name">${d.name}</div><div class="tile-price">${d.cost}</div>`;
            } else {
                tile.classList.add('corner');
                if(d.type==='chance') tile.style.background='#ffeaa7';
                tile.innerHTML = `<div class="tile-name" style="margin:auto">${d.name}</div>`;
            }
            board.appendChild(tile);
        });
        // 초기 말 위치
        this.moveToken(0, 0, true);
        this.moveToken(1, 0, true);
    }

    moveToken(pid, pos, instant=false) {
        const tile = document.getElementById(`tile-${pos}`);
        const token = document.getElementById(`p${pid}-token`);
        const gap = pid===0 ? -6 : 6;
        
        const tLeft = tile.offsetLeft + tile.offsetWidth/2 - 20 + gap;
        const tTop = tile.offsetTop + tile.offsetHeight/2 - 20;

        if(instant) token.style.transition = 'none';
        else token.style.transition = 'all 0.3s ease-out';
        
        token.style.left = tLeft + 'px';
        token.style.top = tTop + 'px';
        
        if(instant) setTimeout(()=>token.style.transition='', 50);
    }

    build(pid, pos, level) {
        const tile = document.getElementById(`tile-${pos}`);
        // 기존 제거
        const old = tile.querySelector('.b-container');
        if(old) old.remove();

        // 3D 큐브 생성
        const bc = document.createElement('div');
        bc.className = 'b-container';
        const cube = document.createElement('div');
        cube.className = 'cube';
        
        if(level===1) cube.classList.add('villa');
        else if(level===2) cube.classList.add('building');
        else if(level===3) cube.classList.add('hotel');
        else if(level===4) cube.classList.add('landmark');

        if(level > 0) {
            for(let i=0; i<5; i++) {
                const f = document.createElement('div');
                f.className='face';
                cube.appendChild(f);
            }
            bc.appendChild(cube);
            tile.appendChild(bc);
        }
        tile.className = `tile owned-p${pid}`;
    }

    async animPlane(pid, dest) {
        const plane = document.getElementById('airplane');
        const token = document.getElementById(`p${pid}-token`);
        
        // 1. 토큰 탑승
        token.style.left = '50%'; token.style.top = '50%';
        token.style.transform = 'translate(-50%,-50%) translateZ(20px)';
        await new Promise(r=>setTimeout(r,800));
        
        // 2. 이륙
        plane.style.transform = 'translate(-50%,-50%) translateZ(150px) rotateZ(360deg)';
        await new Promise(r=>setTimeout(r,1000));
        
        // 3. 착륙
        plane.style.transform = 'translate(-50%,-50%) translateZ(10px)';
        this.moveToken(pid, dest, true); // 즉시 이동
        token.style.transform = ''; // 원래대로
    }

    setupControls() {
        let rotX=55, rotZ=0, scale=0.8;
        let isDrag=false, lastX, lastY;
        const scene = document.getElementById('scene');
        const cont = document.getElementById('board-container');
        
        const apply = () => cont.style.transform = `scale(${scale}) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`;
        
        scene.addEventListener('mousedown', e=>{isDrag=true; lastX=e.clientX; lastY=e.clientY});
        window.addEventListener('mousemove', e=>{
            if(!isDrag) return;
            rotZ += (e.clientX-lastX)*0.5;
            rotX -= (e.clientY-lastY)*0.5;
            rotX = Math.max(10, Math.min(80, rotX));
            lastX=e.clientX; lastY=e.clientY;
            apply();
        });
        window.addEventListener('mouseup', ()=>isDrag=false);
        
        document.getElementById('zoom-range').addEventListener('input', e=>{
            scale = e.target.value; apply();
        });
        apply();
    }
}

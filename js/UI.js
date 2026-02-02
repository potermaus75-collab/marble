export default class UI {
    static toast(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.style.opacity = 1;
        if(t.timer) clearTimeout(t.timer);
        t.timer = setTimeout(() => t.style.opacity = 0, 2000);
    }

    static updateMoney(p0, p1) {
        document.getElementById('p0-money').innerText = p0 + "만";
        document.getElementById('p1-money').innerText = p1 + "만";
    }

    static showPropertyModal(data, state, prices, tolls, actions) {
        return new Promise(resolve => {
            const modal = document.getElementById('property-modal');
            document.getElementById('pc-header').innerText = data.name;
            document.getElementById('pc-header').style.background = data.group;

            // 테이블 생성
            const table = document.getElementById('pc-table');
            const names = ["토지", "별장", "빌딩", "호텔", "랜드마크"];
            let html = `<tr><th>건물</th><th>비용</th><th>통행료</th></tr>`;
            for(let i=0; i<5; i++) {
                let cls = (state.level === i && state.owner !== -1) ? 'highlight' : '';
                html += `<tr class="${cls}"><td>${names[i]}</td><td>${prices[i]}</td><td>${tolls[i]}</td></tr>`;
            }
            table.innerHTML = html;

            // 버튼 생성
            const btnBox = document.getElementById('pc-actions');
            btnBox.innerHTML = '';

            // 구매/증축 버튼
            if(actions.canBuild) {
                const btn = document.createElement('button');
                btn.className = 'action-btn btn-buy';
                btn.innerText = actions.buildLabel;
                btn.onclick = () => { modal.style.display='none'; resolve('build'); };
                btnBox.appendChild(btn);
            }
            // 인수 버튼
            if(actions.canAcquire) {
                const btn = document.createElement('button');
                btn.className = 'action-btn btn-acquire';
                btn.innerText = `인수 (${actions.acquireCost})`;
                btn.onclick = () => { modal.style.display='none'; resolve('acquire'); };
                btnBox.appendChild(btn);
            }
            // 닫기 버튼
            const close = document.createElement('button');
            close.className = 'action-btn btn-pass';
            close.innerText = "닫기";
            close.onclick = () => { modal.style.display='none'; resolve('pass'); };
            btnBox.appendChild(close);

            modal.style.display = 'flex';
        });
    }

    static async animChanceCard(text) {
        const card = document.getElementById('anim-card');
        document.getElementById('card-result-text').innerText = text;
        card.style.display = 'block';
        card.style.transform = 'translateZ(0) rotateY(0)';
        
        // 확대
        setTimeout(() => card.style.transform = 'translateZ(150px) scale(2) rotateY(0)', 50);
        // 뒤집기
        await new Promise(r => setTimeout(r, 800));
        card.style.transform = 'translateZ(250px) scale(3) rotateY(180deg)';
        await new Promise(r => setTimeout(r, 2000));
        card.style.display = 'none';
    }
}

'use strict';
const $=s=>document.querySelector(s);
const LS={get:(k,d)=>{try{return JSON.parse(localStorage.getItem('hw_'+k))??d}catch(e){return d}},set:(k,v)=>localStorage.setItem('hw_'+k,JSON.stringify(v))};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const dkey=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fmtT=s=>`${Math.floor(s/60)}:${pad(Math.floor(s%60))}`;
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);

/* ---------- 스틱 피겨 포즈: head,neck,hip,kneeL,footL,kneeR,footR,elbowL,handL,elbowR,handR ---------- */
const P={
 stand:[50,15,50,25,50,55,47,75,46,94,53,75,54,94,44,40,43,55,56,40,57,55],
 armsUp:[50,15,50,25,50,55,47,75,46,94,53,75,54,94,42,14,40,4,58,14,60,4],
 squat:[42,33,45,43,60,66,44,70,48,94,46,71,50,94,34,46,22,46,36,47,24,47],
 lungeD:[50,30,50,40,50,68,32,72,32,94,58,88,74,94,44,54,44,66,56,54,56,66],
 hinge:[28,36,36,40,58,56,57,75,58,94,59,75,60,94,36,52,38,64,37,52,39,64],
 plank:[14,62,22,65,52,70,70,75,88,80,70,75,88,80,22,80,34,80,23,80,35,80],
 pushU:[14,48,22,53,52,64,70,72,88,80,70,72,88,80,22,66,22,80,23,66,23,80],
 pushD:[14,70,22,73,52,74,70,77,88,80,70,77,88,80,34,68,22,80,35,68,23,80],
 kneeU:[16,48,24,53,50,66,66,82,82,74,66,82,82,74,24,66,24,82,25,66,25,82],
 kneeD:[16,68,24,72,50,76,66,82,82,74,66,82,82,74,36,70,24,82,37,70,25,82],
 wallU:[42,18,44,28,56,56,57,75,58,94,59,75,60,94,32,32,22,30,33,34,22,32],
 wallD:[34,20,38,30,56,56,57,75,58,94,59,75,60,94,30,40,22,30,31,41,22,32],
 bridgeD:[12,84,22,84,48,86,64,70,76,90,64,70,76,90,30,90,40,90,31,90,41,90],
 bridgeU:[12,84,22,82,48,68,64,64,76,90,64,64,76,90,30,90,40,90,31,90,41,90],
 quad:[30,58,38,60,60,62,62,82,62,82,62,82,62,82,38,74,38,84,38,74,38,84],
 birdA:[28,50,36,56,62,58,62,82,62,82,64,82,64,82,36,72,36,84,36,72,36,84],
 birdB:[24,48,36,56,62,58,62,82,62,82,76,58,92,58,28,52,14,48,36,72,36,84],
 backD:[14,86,24,86,56,86,58,62,76,62,58,62,76,62,26,66,26,48,26,66,26,48],
 bugB:[14,86,24,86,56,86,58,62,76,62,72,80,90,80,18,72,8,66,26,66,26,48],
 calfD:[50,15,50,25,50,55,49,75,50,94,51,75,52,94,44,40,43,55,56,40,57,55],
 calfU:[50,10,50,20,50,50,49,70,50,89,51,70,52,89,44,35,43,50,56,35,57,50],
 wallsit:[66,20,66,30,66,58,46,58,46,94,47,58,47,94,62,44,56,56,63,44,57,56],
 belly:[14,80,22,84,52,86,70,88,88,88,70,88,88,88,12,84,4,84,13,84,5,84],
 superU:[12,72,22,78,52,86,70,84,88,78,70,84,88,78,10,74,2,70,11,74,3,70],
 sideP:[18,40,26,46,54,66,70,76,88,86,70,76,88,86,26,62,34,86,30,40,32,30],
 sidePD:[18,48,26,54,54,78,70,82,88,86,70,82,88,86,26,66,34,86,30,46,32,36],
 dipU:[44,22,46,32,48,58,66,62,74,94,67,62,75,94,40,46,38,58,41,46,39,58],
 dipD:[44,34,46,44,48,70,66,66,74,94,67,66,75,94,34,50,38,58,35,50,39,58],
 sideL:[52,16,50,26,50,56,47,75,46,94,53,75,54,94,40,16,44,4,58,40,58,54],
 sideR:[48,16,50,26,50,56,47,75,46,94,53,75,54,94,42,40,42,54,60,16,56,4],
 hamA:[24,52,32,58,58,70,74,78,90,82,74,78,90,82,40,70,52,74,41,70,53,74],
 hamB:[40,62,46,66,58,76,74,80,90,82,74,80,90,82,62,74,80,78,63,74,81,78],
 catA:[26,60,34,56,62,56,62,82,62,82,64,82,64,82,34,72,34,84,34,72,34,84],
 catB:[24,64,34,64,62,64,62,82,62,82,64,82,64,82,34,74,34,84,34,74,34,84],
 chestA:[50,15,50,25,50,55,47,75,46,94,53,75,54,94,38,36,28,36,62,36,72,36],
 chestB:[50,15,50,25,50,55,47,75,46,94,53,75,54,94,36,32,34,48,64,32,66,48],
 hipfA:[48,36,48,46,50,72,66,72,66,94,36,84,26,94,40,58,42,70,56,58,58,70],
 hipfB:[50,34,52,44,56,72,72,72,72,94,40,86,28,94,46,58,48,70,60,58,62,70]
};
function figSVG(poses,cls='fig',dur=2.4){
 const pts=poses.map(k=>P[k]);
 const seg=(pose,a,b)=>[pose[a],pose[a+1],pose[b],pose[b+1]];
 const lines=[[2,4],[4,6],[6,8],[4,10],[10,12],[2,14],[14,16],[2,18],[18,20]];
 const vals=(f)=>[...pts,pts[0]].map(f).join(';');
 const anim=(attr,f)=>pts.length>1?`<animate attributeName="${attr}" dur="${dur}s" repeatCount="indefinite" values="${vals(f)}"/>`:'';
 let s=`<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><line class="gnd" x1="0" y1="96" x2="100" y2="96"/>`;
 for(const [a,b] of lines){const p=pts[0];
  s+=`<line x1="${p[a]}" y1="${p[a+1]}" x2="${p[b]}" y2="${p[b+1]}">${anim('x1',q=>q[a])}${anim('y1',q=>q[a+1])}${anim('x2',q=>q[b])}${anim('y2',q=>q[b+1])}</line>`}
 const p=pts[0];s+=`<circle r="7" cx="${p[0]}" cy="${p[1]}">${anim('cx',q=>q[0])}${anim('cy',q=>q[1])}</circle></svg>`;return s;
}

/* ---------- 운동 라이브러리 ---------- */
const EX=[
 {id:'squat',n:'스쿼트',m:'허벅지 앞(대퇴사두), 엉덩이(둔근), 코어',met:5,pose:['stand','squat'],d:'하체 근력의 기본. 의자에 앉듯 엉덩이를 뒤로 빼며 앉았다 일어납니다.',st:['발을 어깨너비, 발끝은 살짝 바깥','가슴을 펴고 엉덩이를 뒤로 빼며 내려가기','허벅지가 바닥과 평행(또는 편한 깊이)까지','발뒤꿈치로 밀며 일어서기'],mi:['무릎이 안쪽으로 모임','발뒤꿈치가 들림','허리가 둥글게 말림']},
 {id:'chairsquat',n:'의자 스쿼트',m:'대퇴사두, 둔근',met:4,pose:['stand','squat'],d:'의자를 뒤에 두고 살짝 앉았다 일어나는 안전한 스쿼트. 초보·무릎이 불편한 분께 추천.',st:['의자 앞에 서서 팔을 앞으로','엉덩이가 의자에 살짝 닿을 때까지 앉기','체중을 싣지 않고 바로 일어서기'],mi:['의자에 털썩 주저앉기','반동으로 일어서기']},
 {id:'lunge',n:'리버스 런지',m:'대퇴사두, 둔근, 균형',met:5,pose:['stand','lungeD'],d:'한 발을 뒤로 빼며 내려가는 런지. 앞 런지보다 무릎 부담이 적습니다.',st:['바르게 서서 한 발을 크게 뒤로','양 무릎이 약 90도가 되도록 내려가기','앞발 뒤꿈치로 밀어 복귀','좌우 번갈아'],mi:['상체가 앞으로 쏠림','앞 무릎이 안으로 꺾임','보폭이 너무 좁음']},
 {id:'pushup',n:'푸시업',m:'가슴, 어깨, 삼두, 코어',met:6,pose:['pushU','pushD'],d:'상체 밀기 운동의 기본. 몸을 일직선으로 유지합니다.',st:['손은 어깨보다 약간 넓게','머리~발뒤꿈치 일직선','팔꿈치를 45도로 굽히며 내려가기','바닥을 밀어 올라오기'],mi:['허리가 처짐','엉덩이가 들림','팔꿈치가 옆으로 벌어짐']},
 {id:'kneepush',n:'무릎 푸시업',m:'가슴, 어깨, 삼두',met:4,pose:['kneeU','kneeD'],d:'무릎을 대고 하는 푸시업. 일반 푸시업이 어려울 때.',st:['무릎을 바닥에(수건 깔기)','머리~무릎 일직선','가슴이 바닥 가까이 내려갔다 밀기'],mi:['엉덩이를 뒤로 빼기','목만 내려가기']},
 {id:'wallpush',n:'벽 푸시업',m:'가슴, 어깨, 삼두',met:3,pose:['wallU','wallD'],d:'벽을 짚고 하는 가장 쉬운 푸시업. 어깨·손목 적응용.',st:['벽에서 한 걸음 반 떨어져 서기','손을 어깨 높이로 벽에','가슴을 벽으로 가져갔다 밀어내기'],mi:['허리가 꺾임','너무 가까이 서기']},
 {id:'plank',n:'플랭크',m:'복근, 코어 전체, 어깨',met:4,pose:['plank','plank'],d:'팔꿈치로 버티는 코어 안정화 운동.',st:['팔꿈치를 어깨 바로 아래','배꼽을 당기고 엉덩이에 힘','머리~발 일직선 유지','숨을 참지 말고 고르게'],mi:['허리 처짐','엉덩이 들림','호흡 참기']},
 {id:'sideplank',n:'사이드 플랭크',m:'옆구리(복사근), 둔근 중간',met:4,pose:['sideP','sidePD'],d:'옆으로 누워 팔꿈치로 버팁니다. 어려우면 무릎을 굽혀서.',st:['팔꿈치는 어깨 아래','골반을 들어 몸을 일직선','반대쪽도 동일하게'],mi:['골반이 처짐','몸이 앞뒤로 기울어짐']},
 {id:'bridge',n:'글루트 브릿지',m:'둔근, 햄스트링, 허리',met:3.5,pose:['bridgeD','bridgeU'],d:'누워서 엉덩이를 들어 올리는 운동. 오래 앉아있는 직장인에게 필수.',st:['누워서 무릎 세우고 발은 골반너비','엉덩이를 조이며 들어 올리기','어깨~무릎 일직선에서 1초 정지','천천히 내리기'],mi:['허리로 들어 올림(과신전)','무릎이 벌어짐']},
 {id:'birddog',n:'버드독',m:'코어, 척추기립근, 둔근',met:3,pose:['birdA','birdB'],d:'네발 자세에서 반대 팔·다리를 뻗는 허리 안정화 운동.',st:['손은 어깨 아래, 무릎은 골반 아래','오른팔·왼다리를 동시에 뻗기','2초 유지 후 복귀, 반대쪽'],mi:['허리가 꺾이거나 골반이 돌아감','너무 빠르게']},
 {id:'deadbug',n:'데드버그',m:'복근 깊은 층, 코어',met:3,pose:['backD','bugB'],d:'누워서 반대 팔·다리를 내리는 코어 운동. 허리를 바닥에 붙이는 게 핵심.',st:['누워서 팔은 천장, 무릎 90도','허리를 바닥에 밀착','반대 팔·다리를 천천히 뻗기','복귀 후 반대쪽'],mi:['허리가 뜸','숨 참기']},
 {id:'calf',n:'카프 레이즈',m:'종아리',met:3,pose:['calfD','calfU'],d:'발뒤꿈치 들기. 혈액순환·발목 안정에 좋습니다.',st:['벽이나 의자를 가볍게 잡기','발뒤꿈치를 최대한 들기','1초 정지 후 천천히 내리기'],mi:['반동 사용','너무 빠르게']},
 {id:'wallsit',n:'월 싯',m:'대퇴사두, 둔근',met:4,pose:['wallsit','wallsit'],d:'벽에 등을 대고 의자에 앉은 자세로 버티기.',st:['벽에 등을 대고 발은 앞으로','무릎 90도(어려우면 더 높게)','등 전체를 벽에 붙이고 유지'],mi:['무릎이 발끝보다 많이 나감','숨 참기']},
 {id:'superman',n:'슈퍼맨',m:'척추기립근, 둔근, 등',met:3,pose:['belly','superU'],d:'엎드려 팔다리를 들어 등 근육을 강화합니다.',st:['엎드려 팔을 앞으로 뻗기','팔·다리·가슴을 살짝 들기','2초 유지 후 내리기'],mi:['목을 과하게 젖힘','너무 높이 들기']},
 {id:'dip',n:'의자 딥스',m:'삼두, 어깨 앞',met:4,pose:['dipU','dipD'],d:'튼튼한 의자를 이용한 삼두 운동. 어깨가 불편하면 생략.',st:['의자 끝을 손으로 짚고 엉덩이를 앞으로','팔꿈치를 뒤로 굽히며 내려가기(90도까지)','손바닥으로 밀어 올라오기'],mi:['너무 깊이 내려감','어깨가 귀로 올라감','바퀴 달린 의자 사용']},
 {id:'hinge',n:'힙 힌지(굿모닝)',m:'햄스트링, 둔근, 허리',met:3.5,pose:['stand','hinge'],d:'엉덩이를 뒤로 접는 동작 연습. 물건 들 때 허리 보호의 기본.',st:['손을 엉덩이에, 무릎 살짝 굽히기','등을 편 채 엉덩이를 뒤로 밀며 상체 숙이기','햄스트링 당김을 느끼면 엉덩이를 조이며 일어서기'],mi:['등이 둥글게 말림','무릎을 너무 굽힘(스쿼트가 됨)']},
 {id:'catcow',n:'캣카우 스트레칭',m:'척추 가동성',met:2.3,pose:['catA','catB'],d:'네발 자세에서 등을 둥글게·오목하게. 굳은 허리를 풀어줍니다.',st:['네발 자세','숨 내쉬며 등을 둥글게','숨 들이쉬며 가슴을 내밀고 등 오목하게'],mi:['너무 빠르게','팔꿈치 잠그기']},
 {id:'hamstretch',n:'햄스트링 스트레칭',m:'허벅지 뒤',met:2.3,pose:['hamA','hamB'],d:'앉아서 다리를 뻗고 상체를 숙이는 스트레칭.',st:['앉아서 다리를 앞으로 뻗기','등을 편 채 엉덩이부터 숙이기','당김이 느껴지는 곳에서 20~30초'],mi:['등을 말아 억지로 숙이기','반동 주기']},
 {id:'hipflexor',n:'고관절 굴곡근 스트레칭',m:'장요근, 허벅지 앞',met:2.3,pose:['hipfA','hipfB'],d:'오래 앉아 짧아진 고관절 앞쪽을 늘립니다.',st:['한쪽 무릎을 꿇고 반대 발은 앞','엉덩이를 조이며 골반을 앞으로 밀기','20~30초 후 반대쪽'],mi:['허리를 꺾음','무릎 아래 쿠션 없음']},
 {id:'chest',n:'가슴·어깨 열기',m:'가슴, 어깨 앞',met:2.3,pose:['chestA','chestB'],d:'굽은 어깨와 거북목을 펴주는 스트레칭.',st:['팔을 옆으로 벌리고 손바닥 앞으로','견갑골을 모으며 가슴 펴기','천천히 반복 또는 유지'],mi:['허리 젖히기','어깨 으쓱']},
 {id:'sidebend',n:'옆구리 스트레칭',m:'옆구리, 광배근',met:2.3,pose:['sideL','sideR'],d:'서서 팔을 들어 옆으로 기울이기.',st:['발 골반너비로 서기','한 팔을 머리 위로 뻗어 반대쪽으로 기울이기','좌우 번갈아'],mi:['앞으로 숙여짐']},
 {id:'armcircle',n:'팔 돌리기',m:'어깨 관절',met:2.5,pose:['stand','armsUp','chestA'],d:'어깨 관절을 데우는 준비운동.',st:['팔을 옆으로 뻗기','작은 원에서 큰 원으로','앞·뒤 방향 각각'],mi:['어깨 으쓱']}
];
const EXM=Object.fromEntries(EX.map(e=>[e.id,e]));

/* ---------- 프리셋 루틴: [id, sets, type(t/r), value, rest] ---------- */
const it=(id,sets,t,v,rest=20)=>({id,sets,t,v,rest});
const PRESETS=[
 {id:'p1',name:'초급 전신 15분',desc:'처음 시작하는 분께. 전신 고르게.',items:[it('armcircle',1,'t',30,10),it('chairsquat',2,'r',12),it('wallpush',2,'r',12),it('bridge',2,'r',12),it('birddog',2,'r',8),it('calf',2,'r',15),it('plank',2,'t',20,30),it('catcow',1,'t',40,0)]},
 {id:'p2',name:'하체 강화',desc:'스쿼트·런지·브릿지로 하체 근력',items:[it('squat',3,'r',12,40),it('lunge',3,'r',10,40),it('bridge',3,'r',15,30),it('wallsit',2,'t',30,40),it('calf',3,'r',15,20),it('hamstretch',1,'t',30,0)]},
 {id:'p3',name:'코어',desc:'허리를 지키는 코어 안정화',items:[it('deadbug',3,'r',10,30),it('birddog',3,'r',10,30),it('plank',3,'t',30,30),it('sideplank',2,'t',20,20),it('superman',2,'r',10,20)]},
 {id:'p4',name:'상체',desc:'푸시업 계열과 딥스',items:[it('armcircle',1,'t',30,10),it('kneepush',3,'r',10,40),it('wallpush',2,'r',15,30),it('dip',3,'r',8,40),it('superman',2,'r',10,30),it('chest',1,'t',30,0)]},
 {id:'p5',name:'스트레칭/모빌리티',desc:'사무직 굳은 몸 풀기 10분',items:[it('armcircle',1,'t',40,5),it('chest',1,'t',40,5),it('sidebend',1,'t',40,5),it('catcow',1,'t',60,5),it('hipflexor',2,'t',30,5),it('hamstretch',2,'t',30,5),it('hinge',1,'r',10,0)]}
];
const allRoutines=()=>[...PRESETS,...LS.get('custom',[])];

/* ---------- 상태 ---------- */
let tab='workout';const sessions=()=>LS.get('sessions',[]);const vitals=()=>LS.get('vitals',[]);
const latestWeight=()=>{const v=vitals().filter(x=>x.w).sort((a,b)=>b.t.localeCompare(a.t));return v[0]?+v[0].w:72};
if(LS.get('theme',null)==='dark'||(LS.get('theme',null)===null&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');
$('#themeBtn').onclick=()=>{const d=document.documentElement.classList.toggle('dark');LS.set('theme',d?'dark':'light')};
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>show(b.dataset.tab));
function show(t){tab=t;document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===t));({workout:renderWorkout,log:renderLog,guide:renderGuide,health:renderHealth})[t]();scrollTo(0,0)}

/* ---------- 운동 탭 ---------- */
const itemTxt=i=>`${EXM[i.id].n} ${i.sets}세트 × ${i.t==='t'?i.v+'초':i.v+'회'}`;
const estMin=r=>Math.round(r.items.reduce((s,i)=>s+i.sets*((i.t==='t'?i.v:i.v*3)+i.rest),0)/60);
let draft=[];
function renderWorkout(){
 const cus=LS.get('custom',[]);
 $('#main').innerHTML=`<div class="card"><h2>오늘의 운동</h2><p class="mut">걷기 대신 맨몸 근력·코어·유연성 중심. 통증이 있으면 즉시 중단하세요.</p></div>`+
 allRoutines().map(r=>`<div class="card"><div class="row"><div class="grow"><h3>${esc(r.name)}</h3><div class="mut">${esc(r.desc||'나만의 루틴')} · 약 ${estMin(r)}분 · ${r.items.length}종목</div></div></div>
 <details><summary>구성 보기</summary><ul class="exlist">${r.items.map(i=>`<li>${itemTxt(i)} <span class="mut">(휴식 ${i.rest}초)</span></li>`).join('')}</ul></details>
 <div class="row"><button class="btn grow" data-start="${r.id}">▶ 시작</button>${r.custom?`<button class="btn warn sm" data-del="${r.id}">삭제</button>`:''}</div></div>`).join('')+
 `<div class="card"><h2>나만의 루틴 만들기</h2><label>루틴 이름</label><input id="cName" placeholder="예: 아침 10분">
 <label>운동</label><select id="cEx">${EX.map(e=>`<option value="${e.id}">${e.n}</option>`).join('')}</select>
 <div class="grid2"><div><label>방식</label><select id="cT"><option value="r">횟수</option><option value="t">시간(초)</option></select></div><div><label>횟수/초</label><input id="cV" type="number" inputmode="numeric" value="10"></div>
 <div><label>세트</label><input id="cS" type="number" inputmode="numeric" value="2"></div><div><label>휴식(초)</label><input id="cR" type="number" inputmode="numeric" value="30"></div></div>
 <p><button class="btn sec full" id="cAdd">+ 운동 추가</button></p><ol id="cList">${draft.map((i,k)=>`<li>${itemTxt(i)} <button class="btn sec sm" data-rm="${k}">✕</button></li>`).join('')}</ol>
 <button class="btn full" id="cSave">루틴 저장</button></div>`;
 $('#main').onclick=e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.start)startPlayer(allRoutines().find(r=>r.id===b.dataset.start));
  else if(b.dataset.del){if(confirm('삭제할까요?')){LS.set('custom',cus.filter(r=>r.id!==b.dataset.del));renderWorkout()}}
  else if(b.dataset.rm){draft.splice(+b.dataset.rm,1);keep()}
  else if(b.id==='cAdd'){draft.push({id:$('#cEx').value,t:$('#cT').value,v:Math.max(1,+$('#cV').value||10),sets:Math.max(1,+$('#cS').value||1),rest:Math.max(0,+$('#cR').value||0)});keep()}
  else if(b.id==='cSave'){const n=$('#cName').value.trim();if(!n||!draft.length)return alert('이름과 운동을 입력하세요');cus.push({id:'c'+uid(),name:n,custom:true,items:draft});LS.set('custom',cus);draft=[];renderWorkout()}};
 function keep(){const n=$('#cName').value;renderWorkout();$('#cName').value=n}
}

/* ---------- 플레이어 ---------- */
let AC=null,PL=null;
function beep(f=880,d=.15){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.frequency.value=f;o.connect(g);g.connect(AC.destination);g.gain.setValueAtTime(.3,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.start();o.stop(AC.currentTime+d)}catch(e){}}
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
function startPlayer(r){
 const steps=[{k:'ready',secs:5}];
 r.items.forEach((i,ix)=>{for(let s=1;s<=i.sets;s++){steps.push({k:'work',i,s,secs:i.t==='t'?i.v:null});const last=ix===r.items.length-1&&s===i.sets;if(i.rest>0&&!last)steps.push({k:'rest',secs:i.rest})}});
 PL={r,steps,ix:0,left:5,paused:false,start:Date.now(),done:[],last:Date.now(),tm:null};beep(660,.05);
 $('#player').classList.remove('hidden');runStep();PL.tm=setInterval(tick,200);
}
function nextWork(from){for(let k=from;k<PL.steps.length;k++)if(PL.steps[k].k==='work')return PL.steps[k];return null}
function runStep(){const st=PL.steps[PL.ix];PL.left=st.secs;PL.last=Date.now();vib(200);beep(st.k==='work'?1000:600,.25);drawPlayer()}
function tick(){if(!PL||PL.paused)return;const now=Date.now(),dt=(now-PL.last)/1000;PL.last=now;const st=PL.steps[PL.ix];if(st.secs==null)return;
 const before=Math.ceil(PL.left);PL.left-=dt;const after=Math.ceil(PL.left);if(after!==before&&after<=3&&after>0)beep(880,.1);
 if(PL.left<=0)advance();else{const el=$('#pT');if(el)el.textContent=fmtT(Math.ceil(PL.left))}}
function advance(){const st=PL.steps[PL.ix];if(st.k==='work')PL.done.push(st);PL.ix++;if(PL.ix>=PL.steps.length)return finish();runStep()}
function drawPlayer(){const st=PL.steps[PL.ix],nw=nextWork(PL.ix+1),pct=Math.round(PL.ix/PL.steps.length*100);
 const cur=st.k==='work'?st.i:nextWork(PL.ix)?.i;const ex=cur&&EXM[cur.id];
 const phase=st.k==='ready'?'준비하세요':st.k==='rest'?'휴식':`${st.s} / ${st.i.sets} 세트`;
 $('#player').innerHTML=`<div class="row"><b class="grow" style="text-align:left">${esc(PL.r.name)}</b><button class="btn sec sm" id="pX">✕ 종료</button></div>
 <div class="prog"><div style="width:${pct}%"></div></div><div class="phase">${phase}</div>
 <h2 style="font-size:26px">${st.k==='rest'?'다음: ':st.k==='ready'?'첫 운동: ':''}${ex?esc(ex.n):''}</h2>
 ${ex?figSVG(ex.pose,'fig pfig',st.k==='work'?2:3):''}
 ${st.secs!=null?`<div class="big" id="pT">${fmtT(Math.ceil(PL.left))}</div>`:`<div class="big">${st.i.v}회</div><p class="mut">편한 속도로 ${st.i.v}회 후 완료를 누르세요</p>`}
 ${ex&&st.k==='work'?`<p class="mut">${esc(ex.st[0])} · ${esc(ex.st[1]||'')}</p>`:''}
 <div class="row" style="justify-content:center;margin:10px 0">${st.secs!=null?`<button class="btn sec" id="pP" style="min-width:110px">${PL.paused?'▶ 계속':'⏸ 일시정지'}</button>`:`<button class="btn" id="pD" style="min-width:140px">✔ 완료</button>`}
 <button class="btn sec" id="pS">⏭ 건너뛰기</button>${st.k==='rest'?`<button class="btn sec" id="pA">+10초</button>`:''}</div>
 <div class="card" style="text-align:left"><span class="mut">다음 운동</span><br><b>${nw?esc(itemTxt({...nw.i,sets:nw.i.sets}))+` (${nw.s}세트째)`:'마지막입니다 🎉'}</b></div>`;
 $('#pX').onclick=()=>{if(confirm('운동을 종료할까요? 진행한 만큼 저장됩니다.'))finish()};
 $('#pS').onclick=()=>{if(st.k==='work'&&st.secs==null)PL.done.push(st);else if(st.k==='work')PL.done.push(st);PL.ix++;PL.ix>=PL.steps.length?finish():runStep()};
 if($('#pP'))$('#pP').onclick=()=>{PL.paused=!PL.paused;PL.last=Date.now();drawPlayer()};
 if($('#pD'))$('#pD').onclick=()=>advance();
 if($('#pA'))$('#pA').onclick=()=>{PL.left+=10};
}
function finish(){clearInterval(PL.tm);const dur=Math.round((Date.now()-PL.start)/1000);
 const ex={};PL.done.forEach(s=>{const n=EXM[s.i.id].n;ex[n]=(ex[n]||0)+1});
 const mets=PL.done.map(s=>EXM[s.i.id].met);const met=mets.length?mets.reduce((a,b)=>a+b)/mets.length:3;
 const kcal=Math.round(met*latestWeight()*dur/3600);
 if(PL.done.length){const all=sessions();all.push({id:uid(),t:new Date().toISOString(),routine:PL.r.name,dur,kcal,ex:Object.entries(ex).map(([n,c])=>`${n}×${c}`)});LS.set('sessions',all)}
 beep(1200,.4);vib([200,100,200]);
 $('#player').innerHTML=`<h2 style="margin-top:40px;font-size:28px">🎉 수고하셨습니다!</h2><div class="card"><div class="stats"><div><b>${fmtT(dur)}</b>시간</div><div><b>${PL.done.length}</b>세트</div><div><b>${kcal}</b>kcal(추정)</div></div></div>
 <p class="mut">${PL.done.length?'기록이 저장되었습니다.':'완료한 세트가 없어 저장하지 않았습니다.'}</p><button class="btn full" id="pClose">확인</button>`;
 $('#pClose').onclick=()=>{$('#player').classList.add('hidden');PL=null;show('log')};
}

/* ---------- 차트 (SVG) ---------- */
function barChart(labels,vals,unit=''){const W=320,H=150,mx=Math.max(1,...vals),bw=W/vals.length;
 return `<svg class="chart" viewBox="0 0 ${W} ${H+20}">${vals.map((v,i)=>{const h=v/mx*(H-20);return `<rect x="${i*bw+bw*.15}" y="${H-h}" width="${bw*.7}" height="${h}" rx="3" fill="var(--ac)"/>${v?`<text x="${i*bw+bw/2}" y="${H-h-3}" text-anchor="middle">${v}</text>`:''}<text x="${i*bw+bw/2}" y="${H+14}" text-anchor="middle">${labels[i]}</text>`}).join('')}</svg>`}
function lineChart(series,labels,bands=[]){const W=320,H=160,L=30,all=series.flatMap(s=>s.v).filter(v=>v!=null);if(!all.length)return '<p class="mut">데이터가 없습니다</p>';
 let mn=Math.min(...all,...bands.map(b=>b.y)),mx=Math.max(...all,...bands.map(b=>b.y));const pd=(mx-mn)*.1||5;mn-=pd;mx+=pd;
 const n=labels.length,X=i=>L+(n<2?(W-L)/2:i*(W-L-10)/(n-1)),Y=v=>10+(H-20)*(1-(v-mn)/(mx-mn));
 let s=`<svg class="chart" viewBox="0 0 ${W} ${H+16}">`;
 for(let k=0;k<=3;k++){const v=mn+(mx-mn)*k/3;s+=`<line x1="${L}" x2="${W}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--bd)"/><text x="2" y="${Y(v)+3}">${(mx-mn)<10?v.toFixed(1):Math.round(v)}</text>`}
 bands.forEach(b=>s+=`<line x1="${L}" x2="${W}" y1="${Y(b.y)}" y2="${Y(b.y)}" stroke="${b.c}" stroke-dasharray="4 3"/>`);
 series.forEach(se=>{const pts=se.v.map((v,i)=>v==null?null:`${X(i)},${Y(v)}`).filter(Boolean);s+=`<polyline fill="none" stroke="${se.c}" stroke-width="2.5" points="${pts.join(' ')}"/>`+se.v.map((v,i)=>v==null?'':`<circle cx="${X(i)}" cy="${Y(v)}" r="3.5" fill="${se.c}"/>`).join('')});
 const step=Math.ceil(n/5);labels.forEach((l,i)=>{if(i%step===0||i===n-1)s+=`<text x="${X(i)}" y="${H+12}" text-anchor="middle">${l}</text>`});
 return s+'</svg>'+`<div class="row mut">${series.map(se=>`<span style="color:${se.c}">● ${se.n}</span>`).join(' ')}</div>`}

/* ---------- 기록 탭 ---------- */
function streak(days){let c=0;const d=new Date();if(!days.has(dkey(d)))d.setDate(d.getDate()-1);while(days.has(dkey(d))){c++;d.setDate(d.getDate()-1)}return c}
function renderLog(){const ss=sessions().sort((a,b)=>b.t.localeCompare(a.t));const byDay={};ss.forEach(s=>{const k=dkey(new Date(s.t));byDay[k]=(byDay[k]||0)+s.dur/60});
 const days=new Set(Object.keys(byDay)),now=new Date();
 const wl=[],wv=[];for(let i=7;i>=0;i--){const st=new Date(now);st.setDate(st.getDate()-st.getDay()-7*i);let m=0;for(let k=0;k<7;k++){const d=new Date(st);d.setDate(st.getDate()+k);m+=byDay[dkey(d)]||0}wl.push(`${st.getMonth()+1}/${st.getDate()}`);wv.push(Math.round(m))}
 const ml=[],mv=[];for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);const pre=`${d.getFullYear()}-${pad(d.getMonth()+1)}`;ml.push(`${d.getMonth()+1}월`);mv.push(ss.filter(s=>dkey(new Date(s.t)).startsWith(pre)).length)}
 const start=new Date(now);start.setDate(now.getDate()-now.getDay()-7*11);let heat='';for(const w of['일','월','화','수','목','금','토'])heat+=`<div style="background:none">${w}</div>`;
 for(let d=new Date(start);d<=now;d.setDate(d.getDate()+1)){const m=byDay[dkey(d)]||0;heat+=`<div class="${m?m<15?'l1':m<30?'l2':'l3':''}" title="${dkey(d)}">${d.getDate()}</div>`}
 const tot=ss.reduce((a,s)=>a+s.kcal,0);
 $('#main').innerHTML=`<div class="card"><div class="stats"><div><b>${streak(days)}일</b>연속</div><div><b>${ss.length}</b>총 운동</div><div><b>${tot}</b>총 kcal</div></div></div>
 <div class="card"><h2>주간 운동 시간(분)</h2>${barChart(wl,wv)}</div><div class="card"><h2>월간 운동 횟수</h2>${barChart(ml,mv)}</div>
 <div class="card"><h2>운동 달력 (최근 12주)</h2><div class="heat">${heat}</div><p class="mut">진할수록 오래 운동한 날</p></div>
 <div class="card"><h2>최근 기록</h2>${ss.length?ss.slice(0,30).map(s=>`<details><summary>${new Date(s.t).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})} · ${esc(s.routine)} · ${fmtT(s.dur)} · ${s.kcal}kcal</summary><p class="mut">${s.ex.map(esc).join(', ')}</p><button class="btn warn sm" data-ds="${s.id}">삭제</button></details>`).join(''):'<p class="mut">아직 기록이 없습니다. 운동 탭에서 시작해 보세요!</p>'}</div>`;
 $('#main').onclick=e=>{const b=e.target.closest('[data-ds]');if(b&&confirm('삭제할까요?')){LS.set('sessions',sessions().filter(s=>s.id!==b.dataset.ds));renderLog()}};
}

/* ---------- 가이드 탭 ---------- */
function renderGuide(){$('#main').innerHTML=`<div class="card"><input id="gq" placeholder="🔍 운동 검색 (예: 코어, 허리)"></div><div id="glist"></div>`;
 const draw=q=>$('#glist').innerHTML=EX.filter(e=>!q||(e.n+e.m+e.d).includes(q)).map(e=>`<div class="card"><div class="row" style="align-items:flex-start">${figSVG(e.pose)}<div class="grow"><h3>${e.n}</h3><div class="mut">🎯 ${e.m}</div><p style="margin:6px 0">${e.d}</p></div></div>
 <details><summary>자세 & 주의사항</summary><b>올바른 자세</b><ol>${e.st.map(x=>`<li>${x}</li>`).join('')}</ol><b>흔한 실수</b><ul>${e.mi.map(x=>`<li>${x}</li>`).join('')}</ul></details></div>`).join('');
 draw('');$('#gq').oninput=e=>draw(e.target.value.trim());$('#main').onclick=null}

/* ---------- 건강 탭 ---------- */
function bpCat(s,d){if(!s||!d)return null;if(s>180||d>120)return[4,'고혈압 위기'];if(s>=140||d>=90)return[3,'고혈압 2단계'];if(s>=130||d>=80)return[2,'고혈압 1단계'];if(s>=120)return[1,'주의(상승)'];return[0,'정상']}
function renderHealth(){const vs=vitals().sort((a,b)=>a.t.localeCompare(b.t)),nowL=new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,16);
 const lab=vs.map(v=>{const d=new Date(v.t);return `${d.getMonth()+1}/${d.getDate()}`});const last=vs.slice(-30),ll=lab.slice(-30);
 const lb=[...vs].reverse().find(v=>v.s);const lc=lb&&bpCat(lb.s,lb.d);
 $('#main').innerHTML=`<div class="card"><h2>체중·혈압 입력</h2><label>날짜·시간</label><input id="hT" type="datetime-local" value="${nowL}">
 <div class="grid2"><div><label>체중(kg)</label><input id="hW" type="number" step="0.1" inputmode="decimal"></div><div><label>맥박(bpm)</label><input id="hP" type="number" inputmode="numeric"></div>
 <div><label>수축기(최고)</label><input id="hS" type="number" inputmode="numeric"></div><div><label>이완기(최저)</label><input id="hD" type="number" inputmode="numeric"></div></div>
 <p><button class="btn full" id="hSave">저장</button></p></div>
 ${lc?`<div class="card"><h3>최근 혈압: ${lb.s}/${lb.d} mmHg <span class="tag bp${lc[0]}">${lc[1]}</span></h3><p class="mut">분류: 정상 &lt;120/&lt;80 · 주의 120–129/&lt;80 · 1단계 130–139 또는 80–89 · 2단계 ≥140 또는 ≥90 · 위기 &gt;180 또는 &gt;120 (ACC/AHA 2017 기준). ⚠️ 이 앱은 의료 조언이 아닙니다. 국내 기준(대한고혈압학회)은 140/90 이상을 고혈압으로 봅니다. 수치가 높거나 증상이 있으면 의사와 상담하세요.</p></div>`:''}
 <div class="card"><h2>체중 추이</h2>${lineChart([{n:'체중(kg)',c:'var(--ac)',v:last.map(v=>v.w?+v.w:null)}],ll)}</div>
 <div class="card"><h2>혈압·맥박 추이</h2>${lineChart([{n:'수축기',c:'#c0392b',v:last.map(v=>v.s?+v.s:null)},{n:'이완기',c:'#2e7dd1',v:last.map(v=>v.d?+v.d:null)},{n:'맥박',c:'#999',v:last.map(v=>v.p?+v.p:null)}],ll,last.some(v=>v.s)?[{y:130,c:'#e07a2f'},{y:80,c:'#e07a2f'}]:[])}</div>
 <div class="card"><h2>기록</h2><table><tr><th>일시</th><th>체중</th><th>혈압</th><th>맥박</th><th></th></tr>${[...vs].reverse().slice(0,50).map(v=>{const c=bpCat(v.s,v.d);return `<tr><td>${v.t.slice(5,16).replace('T',' ')}</td><td>${v.w||'-'}</td><td>${v.s?`${v.s}/${v.d} <span class="tag bp${c[0]}">${c[1]}</span>`:'-'}</td><td>${v.p||'-'}</td><td><button class="btn sec sm" data-dv="${v.id}">✕</button></td></tr>`}).join('')}</table></div>
 <div class="card"><h2>데이터 백업</h2><p class="mut">운동 기록·건강 기록·나만의 루틴 전체를 CSV로 내보내거나 가져옵니다.</p><div class="row"><button class="btn grow" id="xOut">CSV 내보내기</button><label class="btn sec grow" style="display:flex;align-items:center;justify-content:center;margin:0;color:var(--tx)">CSV 가져오기<input id="xIn" type="file" accept=".csv,text/csv" hidden></label></div></div>`;
 $('#main').onclick=e=>{const b=e.target.closest('button');if(!b)return;
  if(b.id==='hSave'){const n=id=>{const v=parseFloat($(id).value);return isNaN(v)?null:v};const rec={id:uid(),t:$('#hT').value||nowL,w:n('#hW'),s:n('#hS'),d:n('#hD'),p:n('#hP')};
   if(!rec.w&&!rec.s&&!rec.p)return alert('값을 하나 이상 입력하세요');if((rec.s==null)!==(rec.d==null))return alert('혈압은 수축기·이완기를 모두 입력하세요');
   const a=vitals();a.push(rec);LS.set('vitals',a);renderHealth()}
  else if(b.dataset.dv&&confirm('삭제할까요?')){LS.set('vitals',vitals().filter(v=>v.id!==b.dataset.dv));renderHealth()}
  else if(b.id==='xOut')exportCSV()};
 $('#xIn').onchange=e=>{const f=e.target.files[0];if(f)f.text().then(t=>{const n=importCSV(t);alert(`${n}건 가져왔습니다`);renderHealth()})};
}
const csvq=v=>{v=v==null?'':String(v);return /[",\n]/.test(v)?`"${v.replace(/"/g,'""')}"`:v};
function toCSV(){const r=[['type','id','datetime','a','b','c','d','e']];
 sessions().forEach(s=>r.push(['session',s.id,s.t,s.routine,s.dur,s.kcal,s.ex.join('|'),'']));
 vitals().forEach(v=>r.push(['vital',v.id,v.t,v.w,v.s,v.d,v.p,'']));
 LS.get('custom',[]).forEach(c=>r.push(['routine',c.id,'',c.name,JSON.stringify(c.items),'','','']));
 return '\ufeff'+r.map(x=>x.map(csvq).join(',')).join('\n')}
function exportCSV(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([toCSV()],{type:'text/csv'}));a.download=`hometraining-${dkey(new Date())}.csv`;a.click()}
function parseCSV(t){const rows=[];let row=[],f='',q=false;t=t.replace(/^\ufeff/,'');for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=c}else if(c==='"')q=true;else if(c===','){row.push(f);f=''}else if(c==='\n'){row.push(f);rows.push(row);row=[];f=''}else if(c!=='\r')f+=c}if(f||row.length){row.push(f);rows.push(row)}return rows}
function importCSV(t){const S=sessions(),V=vitals(),C=LS.get('custom',[]);const has=(a,id)=>a.some(x=>x.id===id);let n=0;const num=x=>x===''?null:+x;
 for(const [ty,id,dt,a,b,c,d] of parseCSV(t).slice(1)){
  if(ty==='session'&&!has(S,id)){S.push({id,t:dt,routine:a,dur:+b,kcal:+c,ex:d?d.split('|'):[]});n++}
  else if(ty==='vital'&&!has(V,id)){V.push({id,t:dt,w:num(a),s:num(b),d:num(c),p:num(d)});n++}
  else if(ty==='routine'&&!has(C,id)){try{C.push({id,name:a,custom:true,items:JSON.parse(b)});n++}catch(e){}}}
 LS.set('sessions',S);LS.set('vitals',V);LS.set('custom',C);return n}

if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
show('workout');

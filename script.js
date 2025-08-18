// ---- Data ----
const DATA = {
  Mountain: {
    Kashmir: [
      { name: "Srinagar", distance: 0 },
      { name: "Dal Lake", distance: 10 },
      { name: "Mughal Gardens", distance: 15 },
      { name: "Gulmarg", distance: 50 },
      { name: "Pahalgam", distance: 95 },
      { name: "Sonamarg", distance: 80 },
      { name: "Yusmarg", distance: 50 },
      { name: "Dachigam National Park", distance: 22 },
      { name: "Wular Lake", distance: 50 },
      { name: "Manasbal Lake", distance: 30 },
      { name: "Doodhpathri", distance: 50 },
    ],
    Gangtok: [
      { name: "Tsomgo (Changu) Lake", distance: 40 },
      { name: "Nathula Pass", distance: 56 },
      { name: "Rumtek Monastery", distance: 24 },
      { name: "Tashi Viewpoint", distance: 8 },
      { name: "Hanuman Tok", distance: 15 },
      { name: "Ganesh Tok", distance: 7 },
      { name: "Enchey Monastery", distance: 3 },
      { name: "Do Drul Chorten Stupa", distance: 8 },
      { name: "Banjhakri Falls & Energy Park", distance: 10 },
      { name: "Namgyal Institute of Tibetology", distance: 11 },
      { name: "Ranka (Lingdum) Monastery", distance: 20 },
      { name: "Saramsa Garden", distance: 17 },
    ],
    Himachal: [
      { name: "Manali", distance: 258 },
      { name: "Dharamshala", distance: 250 },
      { name: "Kullu", distance: 250 },
      { name: "Kasauli", distance: 70 },
      { name: "Spiti Valley", distance: 480 },
      { name: "Dalhousie", distance: 350 },
      { name: "Narkanda", distance: 60 },
      { name: "Rohtang Pass", distance: 150 },
      { name: "Tirthan Valley", distance: 40 },
      { name: "Palampur", distance: 220 },
    ],
  },
  State: {
    Jaipur: [
      { name: "Amber Fort", distance: 7 },
      { name: "Hawa Mahal", distance: 1 },
      { name: "Jantar Mantar", distance: 1 },
      { name: "City Palace (Jaipur)", distance: 1 },
      { name: "Bhangarh Fort", distance: 83 },
      { name: "Sheesh Mahal (Jaipur)", distance: 10 },
      { name: "Mehrangarh Fort (Jodhpur)", distance: 335 },
      { name: "Bagore Ki Haveli (Udaipur)", distance: 395 },
      { name: "Kumbhalgarh Fort", distance: 365 },
      { name: "Chittorgarh Fort", distance: 310 },
    ],
    "Tamil Nadu": [
      { name: "Marina Beach (Chennai)", distance: 0 },
      { name: "Kapaleeshwarar Temple (Chennai)", distance: 5 },
      { name: "Brihadeeswarar Temple (Thanjavur)", distance: 350 },
      { name: "Meenakshi Amman Temple (Madurai)", distance: 460 },
      { name: "Ramanathaswamy Temple (Rameswaram)", distance: 570 },
      { name: "Kanchipuram", distance: 75 },
      { name: "Pondicherry", distance: 160 },
      { name: "Ooty", distance: 530 },
      { name: "Tiruvannamalai", distance: 200 },
      { name: "Vellore Fort", distance: 140 },
      { name: "Chidambaram", distance: 160 },
    ],
    Delhi: [
      { name: "India Gate", distance: 3 },
      { name: "Qutub Minar", distance: 15 },
      { name: "Lotus Temple", distance: 12 },
      { name: "Red Fort", distance: 10 },
      { name: "Humayun's Tomb", distance: 7 },
      { name: "Akshardham", distance: 15 },
      { name: "Jama Masjid", distance: 10 },
      { name: "Rashtrapati Bhavan", distance: 2 },
      { name: "Connaught Place", distance: 1 },
      { name: "Chandni Chowk", distance: 8 },
      { name: "Lodhi Garden", distance: 5 },
      { name: "National Zoological Park", distance: 8 },
    ],
  },
};
const COSTS = { costPerKm: 5, accommodationPerDay: 1000, foodPerDay: 500 };

// ---- State ----
const state = { category: '', place: '', arrival: '', days: 0, people: 0, selected: [] };

// ---- Elements ----
const el = (id) => document.getElementById(id);
const categoryChips = document.querySelectorAll('#categoryChips .chip');
const destinationChips = el('destinationChips');
const arrival = el('arrival');
const people = el('people');
const durationChips = document.querySelectorAll('[data-days]');
const maxScenesHelp = el('maxScenesHelp');
const maxSel = el('maxSel');
const selCount = el('selCount');
const placeLabel = el('placeLabel');
const sceneList = el('sceneList');
const sceneSummary = el('sceneSummary');
const sumCategory = el('sumCategory');
const sumPlace = el('sumPlace');
const sumArrival = el('sumArrival');
const sumDays = el('sumDays');
const sumPeople = el('sumPeople');
const costTravel = el('costTravel');
const costStay = el('costStay');
const costFood = el('costFood');
const costTotal = el('costTotal');
const clearBtn = el('clearBtn');
const printBtn = el('printBtn');
const resetBtn = el('resetBtn');
const inr = (x) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(x || 0);

// ---- Functions ----
function renderDestinations(){
    destinationChips.innerHTML = '';
    Object.keys(DATA[state.category]).forEach((p, idx) => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.textContent = p;
      b.setAttribute('aria-pressed', String(state.place === p));
      b.addEventListener('click', () => {
        state.place = p;
        state.selected = [];   // ✅ clear side scenes when switching destination
        update();
      });
      destinationChips.appendChild(b);

      // ✅ auto-assign first place if no valid selection
      if(idx===0 && !Object.keys(DATA[state.category]).includes(state.place)) {
        state.place = p;
      }
    });
    placeLabel.textContent = state.place || "—";
  }

  function renderScenes(){
    const scenes = (DATA[state.category][state.place]||[]);
    sceneList.innerHTML = '';

    // ✅ if no destination chosen → show placeholder
    if(!state.place){
      sceneList.innerHTML = `<div style="color:var(--muted);font-size:14px">Please select a destination first.</div>`;
      return;
    }

    scenes.forEach((scene) => {
      const selected = !!state.selected.find(s=>s.name===scene.name);
      const disabled = state.selected.length >= state.days && !selected;

      const item = document.createElement('button');
      item.className = 'scene';
      item.dataset.selected = String(selected);
      item.disabled = disabled;
      item.innerHTML = `
        <div class="left">
          <div class="dot"></div>
          <div>
            <div class="name">${scene.name}</div>
            <div class="km">${scene.distance} km</div>
          </div>
        </div>
        <div class="km">${selected ? 'Selected' : 'Tap to select'}</div>
      `;
      item.addEventListener('click', () => {
        const exists = state.selected.find(s=>s.name===scene.name);
        if(exists){
          state.selected = state.selected.filter(s=>s.name!==scene.name);
        }else{
          if(state.selected.length >= state.days) return; // limit
          state.selected = [...state.selected, scene];
        }
        update();
      });
      sceneList.appendChild(item);
    });
  }

function renderSummary(){
  sumCategory.textContent = state.category;
  sumPlace.textContent = state.place;
  sumArrival.textContent = state.arrival || '—';
  sumDays.textContent = state.days;
  sumPeople.textContent = state.people;
  placeLabel.textContent = state.place;
  selCount.textContent = state.selected.length;
  maxSel.textContent = state.days;
  maxScenesHelp.textContent = state.days;
  sceneSummary.innerHTML = '';
  state.selected.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'muted-row';
    row.innerHTML = `<span>Day ${i+1}: ${s.name}</span><span>${s.distance} km</span>`;
    sceneSummary.appendChild(row);
  });
}
function computeCosts(){
  const travel = state.selected.reduce((acc, s) => acc + (s.distance * COSTS.costPerKm), 0);
  const stay = state.days * state.people * COSTS.accommodationPerDay;
  const food = state.days * state.people * COSTS.foodPerDay;
  costTravel.textContent = inr(travel);
  costStay.textContent = inr(stay);
  costFood.textContent = inr(food);
  costTotal.textContent = inr(travel + stay + food);
}
function setPressed(list, predicate){
  list.forEach(el => el.setAttribute('aria-pressed', String(predicate(el))));
}
function update(){
  setPressed(categoryChips, (b)=>b.dataset.value===state.category);
  renderDestinations();
  setPressed([...destinationChips.querySelectorAll('.chip')], (b)=>b.textContent===state.place);
  renderScenes();
  renderSummary();
  computeCosts();
  localStorage.setItem('travelPlannerState', JSON.stringify(state));
}

// ---- Events ----
categoryChips.forEach(b=> b.addEventListener('click',()=>{
  state.category = b.dataset.value;
  state.place = Object.keys(DATA[state.category])[0];
  state.selected = [];
  update();
}));
durationChips.forEach(b=> b.addEventListener('click',()=>{
  const d = Number(b.dataset.days);
  state.days = d;
  if(state.selected.length > d) state.selected = state.selected.slice(0, d);
  setPressed(durationChips, x=>Number(x.dataset.days)===d);
  update();
}));
arrival.addEventListener('change', e=>{ state.arrival = e.target.value; update(); });
people.addEventListener('input', e=>{
  const v = Math.max(1, Number(e.target.value||1));
  state.people = v; e.target.value = v; update();
});
clearBtn.addEventListener('click', ()=>{ state.selected = []; update(); });
resetBtn.addEventListener('click', () => {
  // Clear saved data
  localStorage.removeItem('travelPlannerState');

  // Reset state
  Object.assign(state, { 
    category: '',      // ✅ clear category
    place: '',         // ✅ clear destination
    arrival: '',       // ✅ clear arrival date
    days: 0,           
    people: 0,         // ✅ clear people count
    selected: []       
  });

  // Clear summary fields
  sumCategory.textContent = '—';
  sumPlace.textContent = '—';
  sumArrival.textContent = '—';
  sumDays.textContent = '0';
  sumPeople.textContent = '0';
  selCount.textContent = '0';
  maxSel.textContent = '0';
  maxScenesHelp.textContent = '0';
  sceneSummary.innerHTML = '';
  placeLabel.textContent = '—';

  // ✅ Clear side scenes list UI
  sceneList.innerHTML = `<div style="color:var(--muted);font-size:14px">Please select a destination first.</div>`;

  // ✅ Clear number of people input field
  people.value = '';

  // ✅ Clear arrival date input field
  arrival.value = '';

  // ✅ Clear destination chips
  destinationChips.innerHTML = `<div style="color:var(--muted);font-size:14px">Please choose a destination</div>`;

  // ✅ Clear category chips (unselect all)
  categoryChips.forEach(chip => chip.setAttribute('aria-pressed', 'false'));

  // Clear costs
  costTravel.textContent = inr(0);
  costStay.textContent = inr(0);
  costFood.textContent = inr(0);
  costTotal.textContent = inr(0);
});

printBtn.addEventListener('click', () => {
  
  const summaryContent = `
    <h2>Trip Summary</h2>
    <p><strong>Category:</strong> ${sumCategory.textContent}</p>
    <p><strong>Place:</strong> ${sumPlace.textContent}</p>
    <p><strong>Arrival:</strong> ${sumArrival.textContent}</p>
    <p><strong>Days:</strong> ${sumDays.textContent}</p>
    <p><strong>People:</strong> ${sumPeople.textContent}</p>
    
    <h3>Itinerary</h3>
    ${sceneSummary.innerHTML || "<p>No scenes selected</p>"}

    <h3>Cost Breakdown</h3>
    <p><strong>Travel:</strong> ${costTravel.textContent}</p>
    <p><strong>Stay:</strong> ${costStay.textContent}</p>
    <p><strong>Food:</strong> ${costFood.textContent}</p>
    <hr>
    <p><strong>Total:</strong> ${costTotal.textContent}</p>
  `;


  const w = window.open('', '_blank', 'width=800,height=600');
  w.document.write(`
    <html>
      <head>
        <title>Trip Summary</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2, h3 { margin-top: 10px; }
          p { margin: 4px 0; }
          hr { margin: 10px 0; border: none; border-top: 1px solid #ccc; }
          .muted-row { display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        ${summaryContent}
      </body>
    </html>
  `);
  w.document.close();
  w.print();
});

  const data = {
    arrival: state.arrival,
    category: state.category,
    place: state.place,
    days: state.days,
    people: state.people,
    selected: state.selected,
    costs: {
      travel: state.selected.reduce((a,s)=>a+s.distance*COSTS.costPerKm,0),
      accommodation: state.days * state.people * COSTS.accommodationPerDay,
      food: state.days * state.people * COSTS.foodPerDay,
    }
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'itinerary.json'; a.click();
  URL.revokeObjectURL(url);

// ---- Boot ----
try{
  const saved = JSON.parse(localStorage.getItem('travelPlannerState')||'null');
  if(saved){ Object.assign(state, saved); }
}catch(e){}
update();

// Lightweight script for multi-unit BMI calculator
document.getElementById('year').textContent = new Date().getFullYear();

// Tabs
const tabs = document.querySelectorAll('.tab');
tabs.forEach(t=> t.addEventListener('click', ()=> {
  tabs.forEach(x=> { x.classList.remove('active'); x.setAttribute('aria-selected','false'); });
  t.classList.add('active'); t.setAttribute('aria-selected','true');
  const id = t.dataset.tab;
  document.querySelectorAll('.tab-panel').forEach(p=> p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}));

// Helpers
function round(n, d=1){ return Number(n).toFixed(d); }
function showDetail(items){
  const ul = document.getElementById('detailList');
  ul.innerHTML = items.map(i=> `<li>${i}</li>`).join('');
  ul.classList.remove('hidden');
}

// Gauge function: sets stroke-dasharray proportional to BMI (range 10-40 mapped to arc length)
function setGauge(bmi){
  const min = 10, max = 40;
  let pct = Math.max(0, Math.min(1, (bmi - min)/(max - min)));
  // SVG arc length approx (path length ~ 251 for half arc) - we use 251 as full arc length
  const arc = 251;
  const show = Math.round(arc * pct);
  const gauge = document.getElementById('gaugeFill');
  gauge.setAttribute('stroke-dasharray', `${show} ${arc}`);
  const text = document.getElementById('gaugeText');
  text.textContent = `BMI ${round(bmi,1)}`;
}

// Calculation logic
function calcFromMetric(wKg, hCm){
  const m = hCm/100;
  if(m<=0) return null;
  return wKg/(m*m);
}
function calcFromUS(ft, inch, lb){
  const totalIn = (Number(ft)||0)*12 + (Number(inch)||0);
  const m = totalIn * 0.0254;
  const kg = lb * 0.45359237;
  return kg/(m*m);
}
function calcFromOther(m, g){
  const kg = g/1000;
  return kg/(m*m);
}

function categoryFor(bmi){
  if(bmi < 18.5) return 'Underweight';
  if(bmi < 25) return 'Normal weight';
  if(bmi < 30) return 'Overweight';
  return 'Obesity';
}

document.getElementById('calculateBtn').addEventListener('click', ()=>{
  // Determine active tab
  const active = document.querySelector('.tab.active').dataset.tab;
  let bmi = null;
  try{
    if(active === 'metric'){
      const w = parseFloat(document.getElementById('weightKg').value);
      const h = parseFloat(document.getElementById('heightCm').value);
      if(!w || !h) return void(showError('Please enter weight and height in metric units.'));
      bmi = calcFromMetric(w,h);
    } else if(active === 'us'){
      const ft = parseFloat(document.getElementById('heightFt').value) || 0;
      const inch = parseFloat(document.getElementById('heightIn').value) || 0;
      const lb = parseFloat(document.getElementById('weightLb').value);
      if((ft===0 && inch===0) || !lb) return void(showError('Please enter height and weight in US units.'));
      bmi = calcFromUS(ft, inch, lb);
    } else {
      const m = parseFloat(document.getElementById('heightM').value);
      const g = parseFloat(document.getElementById('weightG').value);
      if(!m || !g) return void(showError('Please enter height (m) and weight (g).'));
      bmi = calcFromOther(m, g);
    }
  } catch(e){
    return void(showError('Invalid input'));
  }

  if(!bmi || !isFinite(bmi)) return void(showError('Invalid calculation'));
  const bmiV = Number(bmi);
  const cat = categoryFor(bmiV);
  document.getElementById('bmiValue').textContent = round(bmiV,1);
  document.getElementById('bmiCategory').textContent = cat;
  // details
  const age = document.getElementById('age').value || '—';
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const [minW, maxW] = healthyWeightRangeFromBMI(bmiV, active);
  const details = [
    `Age: ${age}`,
    `Gender: ${gender}`,
    `Healthy BMI range: 18.5 - 24.9`,
    `Estimated healthy weight for your height: ${round(minW,1)} kg – ${round(maxW,1)} kg`
  ];
  showDetail(details);
  setGauge(bmiV);
  clearError();
});

function showError(msg){
  const box = document.getElementById('bmiValue');
  box.textContent = '—';
  document.getElementById('bmiCategory').textContent = msg;
  document.getElementById('detailList').classList.add('hidden');
}

function clearError(){
  // no-op placeholder
}

document.getElementById('clearBtn').addEventListener('click', ()=>{
  document.querySelectorAll('input[type=number]').forEach(i=> i.value='');
  document.getElementById('bmiValue').textContent = '—';
  document.getElementById('bmiCategory').textContent = 'Enter values and click Calculate';
  document.getElementById('detailList').classList.add('hidden');
  document.getElementById('gaugeFill').setAttribute('stroke-dasharray','0 251');
  document.getElementById('gaugeText').textContent = 'BMI';
});

function healthyWeightRangeFromBMI(bmi, activeTab){
  // We calculate healthy weight range corresponding to BMI 18.5 and 24.9 for the current height inputs
  let heightMeters = 0;
  if(activeTab === 'metric'){
    const h = parseFloat(document.getElementById('heightCm').value);
    heightMeters = h/100;
  } else if(activeTab === 'us'){
    const ft = parseFloat(document.getElementById('heightFt').value) || 0;
    const inch = parseFloat(document.getElementById('heightIn').value) || 0;
    const totalIn = ft*12 + inch;
    heightMeters = totalIn * 0.0254;
  } else {
    heightMeters = parseFloat(document.getElementById('heightM').value) || 0;
  }
  const minKg = 18.5 * heightMeters * heightMeters;
  const maxKg = 24.9 * heightMeters * heightMeters;
  return [minKg, maxKg];
}

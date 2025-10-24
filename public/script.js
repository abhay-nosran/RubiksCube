// Rubik's Cube Input Interface with Real-time Validation
const colorData = [
  {name:'white', code:'0', hex:'#ffffff'},   // [0] Top
  {name:'red', code:'1', hex:'#ef4444'},     // [1] Front
  {name:'green', code:'2', hex:'#22c55e'},   // [2] Left
  {name:'blue', code:'3', hex:'#3b82f6'},    // [3] Right
  {name:'orange', code:'4', hex:'#fb923c'},  // [4] Back
  {name:'yellow', code:'5', hex:'#fef08a'}   // [5] Bottom
];

// Simple Rubik's Cube Input Interface
// Face layout: [0]Top [1]Front [2]Left [3]Right [4]Back [5]Bottom

const colorPicker = document.getElementById('color-picker');
const colorButtons = document.getElementById('color-buttons');
const colorCounts = document.getElementById('color-counts');
let selectedColor = null;
const colorCount = {0:1,1:1,2:1,3:1,4:1,5:1}; // centers already set

// Initialize color picker
colorData.forEach(c => {
  const btn = document.createElement('button');
  btn.className = `color-btn ${c.name}`;
  btn.dataset.code = c.code;
  btn.dataset.hex = c.hex;
  btn.onclick = () => { 
    selectedColor = c; 
    updateColorButtons();
    showToast(`Selected ${c.name}`, 'success'); 
  };
  colorButtons.appendChild(btn);
  
  // Create color count display
  const countDiv = document.createElement('div');
  countDiv.className = 'color-count';
  countDiv.dataset.code = c.code;
  countDiv.innerHTML = `${c.name}: <span class="count">1</span>/9`;
  colorCounts.appendChild(countDiv);
});

const faces = document.querySelectorAll('.face');
const toastContainer = document.getElementById('toast-container');

// Initialize cube faces with fixed centers
faces.forEach((face, fIndex) => {
  const faceIndex = parseInt(face.dataset.face); // Get the actual face index from data-face
  for(let i = 0; i < 9; i++){
    const cell = document.createElement('div');
    cell.dataset.face = faceIndex; // Use the actual face index
    cell.dataset.index = i;
    if(i === 4){ // center fixed
      cell.style.background = colorData[faceIndex].hex;
      cell.dataset.code = colorData[faceIndex].code;
      cell.classList.add('locked');
    } else {
      cell.dataset.code = '-';
      cell.addEventListener('click', () => applyColor(cell));
    }
    face.appendChild(cell);
  }
});

function updateColorButtons() {
  document.querySelectorAll('.color-btn').forEach(btn => {
    const code = btn.dataset.code;
    const count = colorCount[code] || 0;
    btn.style.opacity = count >= 9 ? '0.5' : '1';
    btn.disabled = count >= 9;
  });
  
  // Update color count displays
  document.querySelectorAll('.color-count').forEach(countDiv => {
    const code = countDiv.dataset.code;
    const count = colorCount[code] || 0;
    const countSpan = countDiv.querySelector('.count');
    countSpan.textContent = count;
    countDiv.style.color = count >= 9 ? '#dc3545' : '#28a745';
  });
}

function applyColor(cell) {
  if(!selectedColor) return showToast('Select a color first', 'error');
  
  const prev = cell.dataset.code;
  if(prev === selectedColor.code) return;

  // Check 9-sticker limit
  if(colorCount[selectedColor.code] >= 9) {
    return showToast(`Only 9 stickers allowed for ${selectedColor.name}`, 'error');
  }

  // Note: Corner/edge validation removed - will be implemented later

  // Update color count
  if(prev !== '-') colorCount[prev]--;
  cell.style.background = selectedColor.hex;
  cell.dataset.code = selectedColor.code;
  colorCount[selectedColor.code]++;
  
  updateColorButtons();
  showToast(`Applied ${selectedColor.name}`, 'success');
}

// Corner and edge validation functions removed
// Will be implemented later when needed

function showToast(msg, type) {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  toastContainer.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}

// Generate 54-character cube string
document.getElementById('generate').onclick = () => {
  const result = [];
  
  // Face order: Top(0), Front(1), Left(2), Right(3), Back(4), Bottom(5)
  const faceOrder = [0, 1, 2, 3, 4, 5];
  
  faceOrder.forEach(faceIndex => {
    // Find the face with the correct data-face attribute
    const face = document.querySelector(`[data-face="${faceIndex}"]`);
    if(face) {
      face.querySelectorAll('div').forEach(cell => {
        const code = cell.dataset.code;
        result.push(code === '-' ? '_' : code);
      });
    }
  });
  
  const cubeString = result.join('');
  document.getElementById('output').value = cubeString;
  showToast(`Generated cube string: ${cubeString.length} characters`, 'success');

  sendString(cubeString) ;

};

// Initialize color button states
updateColorButtons();

// Debug functions removed - corner/edge validation will be implemented later

// Test functions removed - keeping the interface simple

async function sendString(cubeString) {

  try{
    const response =  await fetch(`http://localhost:3100/steps?cubeString=${cubeString}`) ;
  }catch(err){
    console.log("Error :" , err) ;
  }
  
}
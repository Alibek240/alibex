// ---------- ТАПСЫРМА 1 ----------
const elementById = document.getElementById('myElement');
elementById.textContent = 'Сәлем, әлем!';

const newDiv = document.createElement('div');
newDiv.className = 'new-div';
newDiv.textContent = 'Мен жаңа элементпін';
document.body.appendChild(newDiv);

const oldElement = document.querySelector('.old-element');
if (oldElement) oldElement.remove();

const paragraph = document.getElementById('togglePara');
paragraph.addEventListener('click', () => {
  const isBig = paragraph.style.fontSize === '22px';
  paragraph.style.color = isBig ? '' : '#e17055';
  paragraph.style.fontSize = isBig ? '' : '22px';
});



// ---------- ТАПСЫРМА 2 ----------
const toggleTarget = document.getElementById('toggleTarget');

document.getElementById('toggleBtn').addEventListener('click', () => {
  toggleTarget.classList.toggle('active');
  toggleTarget.classList.toggle('not-active');
});

document.getElementById('logBtn').addEventListener('click', () => {
  document.querySelectorAll('*').forEach(el => {
    if (el.className && typeof el.className === 'string') {
      console.log(`${el.tagName}: ${el.className}`);
    }
  });
  const nearbyP = document.querySelector('p');
  if (nearbyP) {
    console.log('Жақын p тегі:', nearbyP.outerHTML);
  }
});
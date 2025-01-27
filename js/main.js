// Titan Script – unstoppable as always

document.querySelectorAll('.card-button').forEach(button => {
  button.addEventListener('click', () => {
    alert("Titan greift zu: Du möchtest mehr Infos? Let's go!");
  });
});

// CTA-Button auf Index
const cta = document.querySelector('.cta-button');
if(cta) {
  cta.addEventListener('click', () => {
    alert("Dominanz-Modus aktiviert!");
    // Hier könntest du auf 'leaks.html' umleiten, z.B.:
    // window.location.href = "leaks.html";
  });
}

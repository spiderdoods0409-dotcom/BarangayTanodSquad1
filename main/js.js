//Divs
const causesDiv = document.querySelector(".causes");
const waysDiv = document.querySelector(".ways");
const planDiv = document.querySelector(".plan");
const mangDiv = document.querySelector(".management");

//Clicks
causesDiv.addEventListener("click", () => {
  window.location.href = "causes.html"; 
});

waysDiv.addEventListener("click", () => {
  window.location.href = "ways.html"; 
});

planDiv.addEventListener("click", ()=> {
  window.location.href = "plan.html";
})
mangDiv.addEventListener("click", ()=> {
  window.location.href = "management.html";
})

document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active'); // remove when out of view
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
});


//huh 

const letters = document.querySelectorAll('.easter-egg');
const url = "https://youtu.be/IpFX2vq8HKw?si=p0xPTmVZ5g-ttWES&t=47"; // redirect URL
let clickedLetters = new Set();

letters.forEach((letter, index) => {
  letter.addEventListener('click', function() {
    clickedLetters.add(index);

    if (clickedLetters.size === letters.length) {
      letters.forEach(l => l.classList.add('all-clicked'));

      setTimeout(() => {
        window.location.href = url;
      }, 500);
    }
  });
});

// duplicate easter-egg behavior for elements with class "game-egg"
function createEasterEgg(selector, redirectUrl) {
  const items = document.querySelectorAll(selector);
  if (!items.length) return;

  const clickedSet = new Set();

  items.forEach((item, idx) => {
    item.addEventListener('click', () => {
      clickedSet.add(idx);

      if (clickedSet.size === items.length) {
        items.forEach(i => i.classList.add('all-clicked'));

        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 500);
      }
    });
  });
}

// use the same redirect URL as the original
createEasterEgg('.game-egg', "https://youtu.be/IpFX2vq8HKw?si=p0xPTmVZ5g-ttWES&t=47");



function myFunction() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

const switchEL = document.getElementById('switch');
const bulb = document.getElementById('bulb');
const mainImg = document.getElementById('main-img');
const switchImg = document.getElementById('switch-img');

let lightOn = false;

switchEL.addEventListener('click', () => {
    lightOn = !lightOn;

    if (lightOn) {
        bulb.classList.add('bg-yellow-300');
        mainImg.classList.remove('grayscale');
        switchImg.src = './picturesabout/switch.png';
    } else {
        bulb.classList.remove('bg-yellow-300');
        mainImg.classList.add('grayscale');
        switchImg.src = './picturesabout/switch.png';
    }
});

const slider = document.getElementById("slider");
document.getElementById("prev").addEventListener("click", () => {
    slider.scrollBy({ left: -320, behavior: "smooth" });
});
document.getElementById("next").addEventListener("click", () => {
    slider.scrollBy({ left: 320, behavior: "smooth" });
});

document.querySelectorAll('.toggle_btn').forEach(button => {
    button.addEventListener('click', () => {
        
        const historyText = button.previousElementSibling;
        
        historyText.classList.toggle('hidden');

        
        if (historyText.classList.contains('hidden')) {
            button.textContent = 'See More';
        } else {
            button.textContent = 'See Less';
        }
    
    });
});
       
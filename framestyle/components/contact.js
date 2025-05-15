


(function () {
  emailjs.init("sdHxXeGIziQnsj13s");
})();


const form = document.getElementById("myform");
const sendButton = document.getElementById("submit");


form.addEventListener("submit", function (event) {
  event.preventDefault();

  const from_name = document.getElementById("inputText").value.trim();
  const email = document.getElementById("inputt").value.trim();
  const message = form.querySelector("textarea").value.trim();

  let errors = [];
  let badWords = ["badword1", "badword2", "badword3"];

  if (from_name === "") {
    errors.push("Name is required!");
  }

  if (email === "") {
    errors.push("Email is required!");
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("Please enter a valid email address!");
  }

  if (message === "") {
    errors.push("Message cannot be empty.");
  } else {
    const messageWords = message.toLowerCase().split(/\s+/);
    for (const word of messageWords) {
      if (badWords.includes(word)) {
        errors.push("Your message contains inappropriate words. Please remove them!");
        break;
      }
    }
  }

  if (errors.length > 0) {
    alert(errors.join("\n"));
    return;
  }

  const templateParams = {
    to_name: "Sherapkitchenette",
    from_name,
    email,
    message,
  };

  emailjs.send("service_rmlxdh5", "template_vf0znwc", templateParams)
    .then(function (response) {
      console.log("SUCCESS!", response);
      alert("Message sent successfully!");
      form.reset();
    }, function (error) {
      console.error("Failed to send the message. Please try again.", error);
      alert("Something went wrong. Try again later.");
    });
});


document.getElementById('inputText').addEventListener('input', function () {
  let value = this.value;
  this.value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
});


const contactDetails = document.getElementById('contact-details');
let isDragging = false;
let offsetX, offsetY;

contactDetails.addEventListener('mousedown', (e) => {
  e.preventDefault();

  isDragging = true;
  offsetX = e.clientX - contactDetails.getBoundingClientRect().left;
  offsetY = e.clientY - contactDetails.getBoundingClientRect().top;
  contactDetails.style.cursor = 'grabbing';

  function onMouseMove(event) {
    if (!isDragging) return;

    requestAnimationFrame(() => {
      let newX = event.clientX - offsetX;
      let newY = event.clientY - offsetY;

      
      newX = Math.max(0, Math.min(window.innerWidth - contactDetails.offsetWidth, newX));
      newY = Math.max(0, Math.min(window.innerHeight - contactDetails.offsetHeight, newY));

      contactDetails.style.left = `${newX}px`;
      contactDetails.style.top = `${newY}px`;
    });
  }

  function onMouseUp() {
    isDragging = false;
    contactDetails.style.cursor = 'grab';
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});


document.addEventListener('click', (e) => {
  if (!contactDetails.contains(e.target)) {
    isDragging = false;
    contactDetails.style.cursor = 'grab';
  }
});


contactDetails.style.position = 'absolute';
contactDetails.style.cursor = 'grab';
function togglePopup() {
    var popup = document.getElementById('popup-container');
    var contact = document.getElementById('contact-details');

    if (popup.style.display === 'none' || popup.style.display === '') {
        popup.style.display = 'block';
        contact.style.display = 'none';
    } else {
        popup.style.display = 'none';
        contact.style.display = 'block';
    }
}

const SUPABASE_URL = 'https://ypnxvddfxubgbqogxmuy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwbnh2ZGRmeHViZ2Jxb2d4bXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTAzNDIsImV4cCI6MjA1OTY2NjM0Mn0.J-ggygd9rFO8mSEMmJ7o_EasckNGUAXhoffGQKuEZEg';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", function () {

    function isElementInView(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }


    window.addEventListener("scroll", () => {
        document.querySelectorAll(".recipey, .footeer, .containerrr").forEach(el => {
            if (isElementInView(el)) {
                el.classList.add("visible");
            }
        });
    });

    window.dispatchEvent(new Event('scroll')); 

 
    const viewMoreButton = document.querySelector(".view-more-btn");
    if (viewMoreButton) {
        viewMoreButton.addEventListener("click", () => {
            alert("Hello! You can see the Foodblogers Business");
            const container = document.querySelector('.containeaer');
            const aside = document.querySelector('.sidebar');
            if (container && aside) {
                container.style.display = "flex";
                aside.style.display = "block";
                viewMoreButton.style.display = "none";
            }
        });
    }


    const signupBtn = document.getElementById("signup-btn");
    const passwordInput = document.getElementById("password");
    const emailInput = document.getElementById("email");


    (async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            signupBtn.textContent = "SIGNOUT";
            signupBtn.style.display = "inline-block";
            emailInput.disabled = true;
            passwordInput.disabled = true;
            loadTawkTo(); 
        }
    })();

   
    signupBtn?.addEventListener("click", async (e) => {
        e.preventDefault();

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
           
            const { error } = await supabase.auth.signOut();
            if (error) return alert("Signout error: " + error.message);

            alert("You have been sign out.");
            removeTawkTo(); 
            signupBtn.textContent = "GO";
            signupBtn.style.display = "inline-block";
            emailInput.disabled = false;
            passwordInput.disabled = false;
            emailInput.value = "";
            passwordInput.value = "";
            return;
        }

        // SIGNUP
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email) || !password) {
            return alert("Please enter a valid email and password");
        }

        try {
            signupBtn.disabled = true;
            signupBtn.textContent = "Signing up...";
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin,
                    data: { email_confirmed: false }
                }
            });

            if (error) throw error;

            if (data.user) {
                alert("Please check your email to verify your account!");
                await supabase.from('users').insert([{
                    id: data.user.id,
                    email: email,
                    created_at: new Date()
                }]);
            }
        } catch (error) {
            alert("Signup error: " + error.message);
        } finally {
            signupBtn.disabled = false;
            signupBtn.textContent = "GO";
        }
    });

  
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            signupBtn.textContent = "SIGNOUT";
            signupBtn.style.display = "inline-block";
            emailInput.disabled = true;
            passwordInput.disabled = true;
            loadTawkTo(); 
        } else if (event === 'SIGNED_OUT') {
            signupBtn.textContent = "GO";
            signupBtn.style.display = "inline-block";
            emailInput.disabled = false;
            passwordInput.disabled = false;
            removeTawkTo(); 
        }
    });


    
    
    

    function loadTawkTo() {
        if (window.Tawk_API) return;
        const s1 = document.createElement("script");
        s1.async = true;
        s1.src = 'https://embed.tawk.to/67fbb41f337fb2190cfd307c/1ionjf74p';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        document.head.appendChild(s1);
    }

   
    function removeTawkTo() {
        const tawkScript = document.querySelector('script[src*="tawk.to"]');
        if (tawkScript) tawkScript.remove();

        const tawkIframe = document.querySelector('iframe[src*="tawk.to"]');
        if (tawkIframe) tawkIframe.remove();

        delete window.Tawk_API;
        delete window.Tawk_LoadStart;
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const commentForm = document.querySelector(".form-comment");
    const commentPopup = document.getElementById("commentPopup");
    const closePopupBtn = document.getElementById("closePopupBtn");

    // Show the popup
    function showPopup() {
      commentPopup.style.display = "flex";
      setTimeout(() => {
        commentPopup.style.opacity = 1;
      }, 50);
    }


    closePopupBtn.addEventListener("click", function () {
      commentPopup.style.opacity = 0;
      setTimeout(() => {
        commentPopup.style.display = "none";
      }, 300);
    });

    commentForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const message = document.querySelector(".textarea").value.trim();
      const name = document.querySelector(".nme").value.trim();
      const email = document.querySelector(".emil").value.trim();

      if (!name || !email || !message) {
        alert("Please fill out all fields before submitting.");
        return;
      }

      const comment = {
        message,
        name,
        email,
        date: new Date().toLocaleString()
      };

    
      let comments = JSON.parse(localStorage.getItem("comments")) || [];
      comments.push(comment);
      localStorage.setItem("comments", JSON.stringify(comments));

      try {
        const { error } = await supabase.from("comments").insert([{
          user_name: name,
          user_email: email,
          comment_text: message
        }]);

        if (error) {
          alert("Error posting comment: " + error.message);
          return;
        }

        showPopup();
        commentForm.reset();

      } catch (err) {
        console.error("Unexpected error:", err);
        alert("An unexpected error occurred. Please try again.");
      }
    });


    window.addEventListener('storage', (event) => {
      if (event.key === 'supabase.auth.token') {
        location.reload();
      }
    });
    
  });
  document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('recipeModal');
  const modalContent = document.querySelector('.custom-card');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');
  const slider = document.getElementById('slider');


  window.openRecipeModal = function () {
    modal.style.display = 'block';
  };


  function closeRecipeModal() {
    modal.style.display = 'none';
  }


  document.querySelectorAll('.toggle_btn').forEach(button => {
    button.addEventListener('click', function () {
      const details = this.nextElementSibling;
      details.classList.toggle('hidden');
      this.textContent = details.classList.contains('hidden') ? 'See More' : 'See Less';
    });
  });


  if (prevButton && nextButton && slider) {
    prevButton.addEventListener('click', () => {
      slider.scrollBy({ left: -400, behavior: 'smooth' });
    });

    nextButton.addEventListener('click', () => {
      slider.scrollBy({ left: 400, behavior: 'smooth' });
    });
  }

 
  const closeModalButton = document.createElement('button');
  closeModalButton.innerText = 'Close';
  closeModalButton.className = 'modal-close-btn';
  closeModalButton.addEventListener('click', closeRecipeModal);
  modal.appendChild(closeModalButton); 


  if (modalContent) {
    modalContent.addEventListener('click', (event) => {
      event.stopPropagation();  
    });
  }

});

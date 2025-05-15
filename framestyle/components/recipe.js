
 const SUPABASE_URL = 'https://ypnxvddfxubgbqogxmuy.supabase.co';
 const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwbnh2ZGRmeHViZ2Jxb2d4bXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTAzNDIsImV4cCI6MjA1OTY2NjM0Mn0.J-ggygd9rFO8mSEMmJ7o_EasckNGUAXhoffGQKuEZEg';


 const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

 document.addEventListener("DOMContentLoaded", () => {

   document.querySelectorAll('.toggle_btn').forEach(button => {
     button.addEventListener('click', () => {
       const content = button.nextElementSibling;
       if (!content) return;
       content.classList.toggle('hidden');
       button.textContent = content.classList.contains('hidden') ? 'See More' : 'See Less';
     });
   });

  
   const slider = document.getElementById("slider");
   if (slider) {
     const prevBtn = document.getElementById("prev");
     const nextBtn = document.getElementById("next");

     if (prevBtn) {
       prevBtn.addEventListener("click", () => {
         slider.scrollBy({ left: -320, behavior: "smooth" });
       });
     }

     if (nextBtn) {
       nextBtn.addEventListener("click", () => {
         slider.scrollBy({ left: 320, behavior: "smooth" });
       });
     }
   }


   const viewAllBtn = document.getElementById("view-all-btn");

   if (viewAllBtn) {
     viewAllBtn.addEventListener("click", async () => {
       try {
         const { data: { session }, error: sessionError } = await supabase.auth.getSession();

         if (sessionError) throw sessionError;

         if (session && session.user) {
           window.location.href = "indexallrecipes.html";
         } else {
           const { error: signInError } = await supabase.auth.signInWithOAuth({
             provider: "google",
             options: {
               redirectTo: `${window.location.origin}/indexallrecipe.html`
             }
           });

           if (signInError) throw signInError;
         }
       } catch (error) {
         console.error("Google login failed:", error.message);
         alert("Login error: " + error.message);
       }
     });
   }
 });
 window.addEventListener('storage', (event) => {
  if (event.key === 'supabase.auth.token') {

    supabase.auth.setAuth(event.newValue);
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
 
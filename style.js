document.getElementById("theme-toggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
  });
  
  function greet() {
    alert("Welcome to my portfolio!");
  }
  
  document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
  
    if (name && email && message) {
      alert("Thanks for your message!");
      this.reset();
    } else {
      alert("Please fill out all fields.");
    }
  });
  
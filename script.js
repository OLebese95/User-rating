document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a, .mobile-menu a');

    const observerOptions = {
      root: null, 
      rootMargin: '0px',
      threshold: 0.2 
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
          console.log(entry.target.id);
        if (entry.isIntersecting) {
          const sectionID = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionID) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });

    document.getElementById('toggleBotButton').addEventListener('click', function() {
      const botElement = document.querySelector('df-messenger');
      if (botElement.style.display === 'none') {
          botElement.style.display = 'block';
          this.textContent = 'Bot';
      } else {
          botElement.style.display = 'none';
          this.textContent = 'Bot';
      }
    });

    const menuIcon = document.getElementById('menu-icon');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuIcon.addEventListener('click', function() {

        mobileMenu.classList.toggle('show');
    });
});


// import { auth } from '../frontend/firebaseAPI.js';
// import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// try {
//   const logoutBtn = document.getElementById('logout');

//   logoutBtn.addEventListener("click", () => {
//     localStorage['loggedInUserId'] = '';
  
//     signOut(auth)
//     .then(() => {
//       window.location.href = "../frontend/login.html"
//     })
//     .catch((error) => {
//       console.error("Error signing out", error)
//     })
//   })
// } catch {
//   console.log("Failed to log out.")
// }

// try {
//   const logout2 = document.getElementById("logout2");

//   logout2.addEventListener("click", () => {
//     signOut(auth)
//     .then(() => {
//       window.location.href = "../frontend/login.html"
//     })
//     .catch((error) => {
//       console.error("Error signing out", error)
//     })
//   })
// } catch {
//   console.log("Failed to log out.")
// }

// Get the modal
var modal = document.getElementById("myModal");

var btn = document.getElementById("myBtn");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.getElementById('contactLink').addEventListener('click', function() {
  modal.style.display = "none";

  document.querySelector("#contact").scrollIntoView({
      behavior: "smooth"
  });
});

// FAQ Collapser
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active1");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

// Import necessary Firebase modules
import { db } from './frontend/firebaseAPI.js';
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Reference to the testimonials collection in Firestore
const testimonialsRef = collection(db, "testimonials");

// Fetch and display testimonials
async function fetchTestimonials() {
    try {
        const querySnapshot = await getDocs(testimonialsRef);
        const testimonialsWrapper = document.getElementById('testimonials-wrapper');
        testimonialsWrapper.innerHTML = querySnapshot.docs.map(doc => {
            const t = doc.data();
            return `
                <div class="testimonials-item">
                    <img src="${t.imageUrl || 'images/default-image.jpg'}" alt="${t.name}'s testimonial">
                    <h2>${t.name}</h2>
                    <div class="rating">
                        ${'★'.repeat(t.rating).padEnd(5, '☆')}
                    </div>
                    <p>${t.comment}</p>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error("Error fetching testimonials: ", error);
    }
}

let ratingValue;

// Add event listener for each star
document.querySelectorAll('.fa-star').forEach(star => {
    star.addEventListener('click', function() {
        ratingValue = this.getAttribute('data-value'); // Get clicked star's value
        document.getElementById('rating-value').value = ratingValue; // Update the hidden input with the rating

        // Clear all previous stars
        clearStars();

        // Highlight all stars up to the clicked one
        highlightStars(ratingValue);
    });
});

// Function to highlight the stars up to the selected rating
function highlightStars(value) {
    document.querySelectorAll('.fa-star').forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= value) {
            star.classList.add('selected'); // Add 'selected' class to highlight star
            star.style.color = 'gold'; // Change the color to gold
        }
    });
}

// Function to clear all star highlights
function clearStars() {
    document.querySelectorAll('.fa-star').forEach(star => {
        star.classList.remove('selected'); // Remove the 'selected' class
        star.style.color = ''; // Reset the star color
    });
}

// Add event listener to the form
document.getElementById('testimonial-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
    const rating = ratingValue;

    if (!rating) {
      alert("Please select a star rating.");
      return;
    }

    // Add a new testimonial to Firestore
    try {
        await addDoc(testimonialsRef, { name, comment, rating });
        fetchTestimonials(); // Update testimonials after submission
        // Clear the form
        document.getElementById('testimonial-form').reset();
        clearStars(); // Clear stars after submission
    } catch (error) {
        console.error("Error adding testimonial: ", error);
    }
});

// Load testimonials on page load
fetchTestimonials();


document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  const rememberMe = document.getElementById('remember-me');
  
  // Check for remembered email
  if (localStorage.getItem('rememberedEmail')) {
      document.getElementById('email').value = localStorage.getItem('rememberedEmail');
      rememberMe.checked = true;
  }

  loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      const rememberMeChecked = rememberMe.checked;
      
      // Reset error message
      errorMessage.textContent = '';
      
      // Validation checks
      if (!email || !password) {
          showError('Please fill in all fields');
          return;
      }
      
      if (!validateEmail(email)) {
          showError('Please enter a valid email address');
          return;
      }
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email);
      
      // Check if user exists
      if (!user) {
          showError('No account found with this email');
          return;
      }
      
      // Check password (basic base64 decode for demo)
      if (btoa(password) !== user.password) {
          showError('Incorrect password');
          return;
      }
      
      // Handle "Remember Me" functionality
      if (rememberMeChecked) {
          localStorage.setItem('rememberedEmail', email);
      } else {
          localStorage.removeItem('rememberedEmail');
      }
      
      // Create user session (in real app, use proper session management)
      sessionStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          email: user.email,
          fullName: user.fullName
      }));
      
      // Show success and redirect
      showSuccess('Login successful! Redirecting...');
      setTimeout(() => {
          window.location.href = 'dashboard.html'; // Change to your dashboard page
      }, 1500);
  });

  // Email validation function
  function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
  }

  function showError(message) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
  }

  function showSuccess(message) {
      const successDiv = document.createElement('div');
      successDiv.className = 'success-message';
      successDiv.textContent = message;
      loginForm.insertBefore(successDiv, loginForm.firstChild);
      
      // Style the success message
      successDiv.style.backgroundColor = 'rgba(46, 204, 113, 0.2)';
      successDiv.style.color = '#2ecc71';
      successDiv.style.padding = '0.75rem';
      successDiv.style.borderRadius = '8px';
      successDiv.style.marginBottom = '1rem';
      successDiv.style.textAlign = 'center';
  }
});
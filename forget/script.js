document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const emailForm = document.getElementById('emailForm');
  const passwordForm = document.getElementById('passwordForm');
  const emailStep = document.getElementById('emailStep');
  const passwordStep = document.getElementById('passwordStep');
  const resetEmail = document.getElementById('resetEmail');
  const newPassword = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const successMessage = document.getElementById('successMessage');
  
  // Track current user email for password reset
  let userEmail = '';

  // Email verification step
  emailForm.addEventListener('submit', function(e) {
      e.preventDefault();
      emailError.textContent = '';
      
      const email = resetEmail.value.trim().toLowerCase();
      
      if (!validateEmail(email)) {
          emailError.textContent = 'Please enter a valid email address';
          return;
      }
      
      // Check if email exists in stored users
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = users.some(user => user.email === email);
      
      if (!userExists) {
          emailError.textContent = 'No account found with this email';
          return;
      }
      
      // Store email for password reset and show next step
      userEmail = email;
      emailStep.style.display = 'none';
      passwordStep.style.display = 'block';
  });

  // Password reset step
  passwordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      passwordError.textContent = '';
      successMessage.style.display = 'none';
      
      const password = newPassword.value;
      const confirmPass = confirmPassword.value;
      
      // Validation
      if (password.length < 8) {
          passwordError.textContent = 'Password must be at least 8 characters';
          return;
      }
      
      if (password !== confirmPass) {
          passwordError.textContent = 'Passwords do not match';
          return;
      }
      
      // Update password in localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = users.map(user => {
          if (user.email === userEmail) {
              return {
                  ...user,
                  password: btoa(password) // Basic obfuscation
              };
          }
          return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Show success message
      successMessage.textContent = 'Password updated successfully!';
      successMessage.style.display = 'block';
      
      // Clear form and reset after delay
      setTimeout(() => {
          passwordForm.reset();
          passwordStep.style.display = 'none';
          emailStep.style.display = 'block';
          successMessage.style.display = 'none';
          userEmail = '';
      }, 2000);
  });

  // Password strength indicator
  newPassword.addEventListener('input', function() {
      const strength = calculatePasswordStrength(this.value);
      updateStrengthIndicator(strength);
  });

  // Helper functions
  function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
  }

  function calculatePasswordStrength(password) {
      let strength = 0;
      
      // Length check
      if (password.length >= 8) strength += 1;
      if (password.length >= 12) strength += 1;
      
      // Complexity checks
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      
      return Math.min(strength, 3); // Max 3 for our 3-bar indicator
  }

  function updateStrengthIndicator(strength) {
      const bars = document.querySelectorAll('.strength-bar');
      bars.forEach((bar, index) => {
          if (index < strength) {
              // Change color based on strength
              if (strength === 1) {
                  bar.style.background = '#ff6b6b'; // Weak
              } else if (strength === 2) {
                  bar.style.background = '#feca57'; // Medium
              } else {
                  bar.style.background = '#1dd1a1'; // Strong
              }
          } else {
              bar.style.background = 'rgba(255, 255, 255, 0.2)';
          }
      });
  }
});
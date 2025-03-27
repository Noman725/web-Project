document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');
    const passwordInput = document.getElementById('password');
    
    // Initialize users array in localStorage if it doesn't exist
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    // Password strength indicator
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsChecked = document.getElementById('terms').checked;
        
        // Reset error message
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
        
        // Validation checks
        if (!fullName || !email || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }
        
        if (!validateEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        if (password.length < 8) {
            showError('Password must be at least 8 characters');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        if (!termsChecked) {
            showError('You must agree to the terms and conditions');
            return;
        }
        
        // Check if email already exists
        const users = JSON.parse(localStorage.getItem('users'));
        const emailExists = users.some(user => user.email === email);
        
        if (emailExists) {
            showError('An account with this email already exists');
            return;
        }
        
        // Create new user object
        const newUser = {
            id: Date.now().toString(),
            fullName,
            email,
            password: btoa(password), // Basic obfuscation (not secure for production)
            createdAt: new Date().toISOString()
        };
        
        // Save to localStorage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message
        showSuccess('Account created successfully! Redirecting to login...');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = 'login/login.html';
        }, 2000);
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
        signupForm.insertBefore(successDiv, signupForm.firstChild);
        
        // Style the success message
        successDiv.style.backgroundColor = 'rgba(46, 204, 113, 0.2)';
        successDiv.style.color = '#2ecc71';
        successDiv.style.padding = '0.75rem';
        successDiv.style.borderRadius = '8px';
        successDiv.style.marginBottom = '1rem';
        successDiv.style.textAlign = 'center';
    }

    function checkPasswordStrength(password) {
        const strengthBars = document.querySelectorAll('.strength-bar');
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        // Complexity checks
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Update visual indicator
        strengthBars.forEach((bar, index) => {
            bar.style.backgroundColor = index < strength ? 
                (strength < 2 ? '#ff6b6b' : strength < 4 ? '#feca57' : '#1dd1a1') : 
                'rgba(255, 255, 255, 0.2)';
        });
    }
});
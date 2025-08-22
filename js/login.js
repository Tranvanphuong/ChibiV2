document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    
    function showLoginForm() {
        if (loginForm && registerForm && loginTab && registerTab) {
            loginForm.classList.remove('hidden');
            loginForm.classList.add('visible');
            registerForm.classList.remove('visible');
            registerForm.classList.add('hidden');
            
            loginTab.classList.add('border-orange-500', 'text-orange-500', 'bg-orange-50');
            loginTab.classList.remove('text-gray-500');
            registerTab.classList.remove('border-orange-500', 'text-orange-500', 'bg-orange-50');
            registerTab.classList.add('text-gray-500');
        }
    }
    
    function showRegisterForm() {
        if (loginForm && registerForm && loginTab && registerTab) {
            registerForm.classList.remove('hidden');
            registerForm.classList.add('visible');
            loginForm.classList.remove('visible');
            loginForm.classList.add('hidden');
            
            registerTab.classList.add('border-orange-500', 'text-orange-500', 'bg-orange-50');
            registerTab.classList.remove('text-gray-500');
            loginTab.classList.remove('border-orange-500', 'text-orange-500', 'bg-orange-50');
            loginTab.classList.add('text-gray-500');
        }
    }
    
    // Event listeners for tab switching
    if (loginTab) loginTab.addEventListener('click', showLoginForm);
    if (registerTab) registerTab.addEventListener('click', showRegisterForm);
    if (showRegister) showRegister.addEventListener('click', showRegisterForm);
    if (showLogin) showLogin.addEventListener('click', showLoginForm);
    
    // Form validation and submission
    const loginFormElement = document.getElementById('login');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Here you would typically send this data to your server
            console.log('Login attempt with:', { email, password });
            alert('Đăng nhập thành công! (This is a demo)');
        });
    }
    
    const registerFormElement = document.getElementById('register');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;
            
            if (password !== confirm) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }
            
            // Here you would typically send this data to your server
            console.log('Registration attempt with:', { name, email, password });
            alert('Đăng ký thành công! (This is a demo)');
            showLoginForm();
        });
    }
});

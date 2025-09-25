console.log('contact.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing contact form');
    const contactForm = document.getElementById('contact-form');
    console.log('Contact form found:', contactForm);
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submit triggered');
            
            const formData = new FormData(e.target);
            const formObj = {};
            for (let [key, value] of formData.entries()) {
                formObj[key] = value;
                console.log(key + ': "' + value + '"');
            }
            
            console.log('Form data:', formObj);
            
            if (validateForm(formObj)) {
                submitToAPI(formObj);
            }
        });
    } else {
        console.log('Contact form not found');
    }
    
    function validateForm(data) {
        console.log('Validating form data:', data);
        const errors = [];
        
        if (!data.name || data.name.trim() === '') {
            errors.push('名前は必須です');
        }
        
        if (!data.email || data.email.trim() === '') {
            errors.push('メールアドレスは必須です');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('メールアドレスの形式が正しくありません');
        }
        
        if (!data.message || data.message.trim() === '') {
            errors.push('メッセージは必須です');
        }
        
        if (errors.length > 0) {
            console.log('Validation errors:', errors);
            showErrors(errors);
            return false;
        }
        
        return true;
    }
    
    function showErrors(errors) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-messages';
        errorDiv.innerHTML = '<h4>エラー:</h4><ul>' + 
            errors.map(function(error) { return '<li>' + error + '</li>'; }).join('') + '</ul>';
        
        const existingError = contactForm.querySelector('.error-messages');
        if (existingError) {
            existingError.remove();
        }
        
        contactForm.insertBefore(errorDiv, contactForm.firstChild);
        
        setTimeout(function() {
            errorDiv.remove();
        }, 5000);
    }
    
    function showSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = '<h4>送信完了!</h4><p>お問い合わせありがとうございます。</p>';
        
        contactForm.insertBefore(successDiv, contactForm.firstChild);
        contactForm.reset();
        
        setTimeout(function() {
            successDiv.remove();
        }, 10000);
    }
    
    function submitToAPI(formData) {
        console.log('Submitting to API:', formData);
        
        fetch('/api/contact/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(function(response) {
            console.log('API response status:', response.status);
            return response.json();
        })
        .then(function(data) {
            console.log('API response data:', data);
            if (data.success) {
                showSuccess();
            } else {
                showErrors([data.error || '送信に失敗しました']);
            }
        })
        .catch(function(error) {
            console.error('Network error:', error);
            showErrors(['ネットワークエラーが発生しました']);
        });
    }
});

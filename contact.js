console.log('contact.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing contact form');
    const contactForm = document.getElementById('contact-form');
    console.log('Contact form found:', contactForm);
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            console.log('=== FORM SUBMIT EVENT START ===');
            console.log('Event object:', e);
            console.log('Event target:', e.target);
            
            // preventDefault前に値を確認
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            console.log('BEFORE preventDefault - Values:');
            console.log('name value:', nameInput.value);
            console.log('email value:', emailInput.value);
            console.log('subject value:', subjectInput.value);
            console.log('message value:', messageInput.value);
            
            e.preventDefault();
            console.log('Form submit triggered (after preventDefault)');
            
            // preventDefault後に再度値を確認
            console.log('AFTER preventDefault - Values:');
            console.log('name value:', nameInput.value);
            console.log('email value:', emailInput.value);
            console.log('subject value:', subjectInput.value);
            console.log('message value:', messageInput.value);
            
            console.log('Name input element:', nameInput);
            console.log('Email input element:', emailInput);
            console.log('Subject input element:', subjectInput);
            console.log('Message input element:', messageInput);
            
            // フォーム全体のFormDataも確認
            const formData = new FormData(e.target);
            console.log('FormData entries:');
            for (let [key, value] of formData.entries()) {
                console.log('FormData ' + key + ': "' + value + '"');
            }
            
            // 値を直接取得
            const formObj = {
                name: nameInput ? nameInput.value : '',
                email: emailInput ? emailInput.value : '',
                subject: subjectInput ? subjectInput.value : '',
                message: messageInput ? messageInput.value : ''
            };
            
            console.log('Direct values:');
            console.log('name: "' + formObj.name + '"');
            console.log('email: "' + formObj.email + '"');
            console.log('subject: "' + formObj.subject + '"');
            console.log('message: "' + formObj.message + '"');
            
            console.log('Form data:', formObj);
            console.log('=== FORM SUBMIT EVENT END ===');
            
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

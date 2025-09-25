// お問い合わせフォームの機能
console.log('🔧 contact.js が読み込まれました');

document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM読み込み完了 - contact.js初期化開始');
    const contactForm = document.getElementById('contact-form');
    console.log('🔍 フォーム要素検索結果:', contactForm);
    
    if (contactForm) {
        console.log('✅ お問い合わせフォームが見つかりました');
        // フォーム送信のイベントリスナー
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 フォーム送信イベント発生');
            
            // まず要素を取得
            const nameElement = document.getElementById('name');
            const emailElement = document.getElementById('email');
            const subjectElement = document.getElementById('subject');
            const messageElement = document.getElementById('message');
            
            console.log('� 要素取得結果:');
            console.log('  - name element:', nameElement);
            console.log('  - email element:', emailElement);
            console.log('  - subject element:', subjectElement);
            console.log('  - message element:', messageElement);
            
            // フォームデータを取得 - 直接input要素から取得する方法に変更
            const formObj = {
                name: nameElement ? nameElement.value : '',
                email: emailElement ? emailElement.value : '',
                subject: subjectElement ? subjectElement.value : '',
                message: messageElement ? messageElement.value : ''
            };
            
            console.log('📊 フォームデータ:', formObj);
            console.log('📊 各値の詳細:');
            console.log('  - name:', `"${formObj.name}" (length: ${formObj.name.length})`);
            console.log('  - email:', `"${formObj.email}" (length: ${formObj.email.length})`);
            console.log('  - subject:', `"${formObj.subject}" (length: ${formObj.subject.length})`);
            console.log('  - message:', `"${formObj.message}" (length: ${formObj.message.length})`);
            
            // バリデーション
            if (validateForm(formObj)) {
                console.log('✅ バリデーション成功 - 送信処理開始');
                // 模擬的な送信処理
                simulateFormSubmission(formObj);
            } else {
                console.log('❌ バリデーションエラー');
            }
        });
    } else {
        console.log('❌ お問い合わせフォームが見つかりません');
        console.log('📝 現在のDOM内の全フォーム:', document.querySelectorAll('form'));
        console.log('📝 contact-form IDを持つ要素:', document.querySelector('#contact-form'));
        console.log('📝 全体のHTML:', document.body.innerHTML.length, '文字');
    }
    
    // フォームバリデーション
    function validateForm(data) {
        console.log('🔍 バリデーション開始');
        console.log('📋 受信データ詳細:', JSON.stringify(data, null, 2));
        let isValid = true;
        const errors = [];
        
        // 必須項目のチェック
        console.log('👤 お名前チェック:', data.name, '(length:', data.name?.length, ')');
        if (!data.name || data.name.trim() === '') {
            console.log('❌ お名前エラー');
            errors.push('お名前は必須項目です。');
            isValid = false;
        } else {
            console.log('✅ お名前OK');
        }
        
        console.log('📧 メールアドレスチェック:', data.email, '(length:', data.email?.length, ')');
        if (!data.email || data.email.trim() === '') {
            console.log('❌ メールアドレス未入力エラー');
            errors.push('メールアドレスは必須項目です。');
            isValid = false;
        } else if (!isValidEmail(data.email)) {
            console.log('❌ メールアドレス形式エラー');
            errors.push('メールアドレスの形式が正しくありません。');
            isValid = false;
        } else {
            console.log('✅ メールアドレスOK');
        }
        
        console.log('💬 メッセージチェック:', data.message, '(length:', data.message?.length, ')');
        if (!data.message || data.message.trim() === '') {
            console.log('❌ メッセージエラー');
            errors.push('メッセージは必須項目です。');
            isValid = false;
        } else {
            console.log('✅ メッセージOK');
        }
        
        // エラーメッセージを表示
        if (!isValid) {
            console.log('❌ バリデーション失敗 - エラー内容:', errors);
            showErrors(errors);
        } else {
            console.log('✅ バリデーション全項目成功');
        }
        
        console.log('📊 バリデーション結果:', isValid);
        return isValid;
    }
    
    // メールアドレスの形式チェック
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // エラーメッセージの表示
    function showErrors(errors) {
        removeExistingErrors();
        
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-messages';
        errorContainer.innerHTML = `
            <div class="error-list">
                <h4><i class="fas fa-exclamation-circle"></i> 入力エラー</h4>
                <ul>
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;
        
        contactForm.insertBefore(errorContainer, contactForm.firstChild);
        
        // エラーメッセージにスクロール
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 5秒後に自動で消去
        setTimeout(() => {
            errorContainer.remove();
        }, 5000);
    }
    
    // 既存のエラーメッセージを削除
    function removeExistingErrors() {
        const existingErrors = contactForm.querySelectorAll('.error-messages');
        existingErrors.forEach(error => error.remove());
    }
    
    // 成功メッセージの表示
    function showSuccessMessage() {
        removeExistingErrors();
        
        const successContainer = document.createElement('div');
        successContainer.className = 'success-message';
        successContainer.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h4>送信完了！</h4>
                <p>お問い合わせありがとうございます。<br>
                   内容を確認次第、担当者よりご連絡いたします。</p>
                <p class="response-time">※通常1-2営業日以内にご返信いたします</p>
            </div>
        `;
        
        contactForm.insertBefore(successContainer, contactForm.firstChild);
        
        // 成功メッセージにスクロール
        successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // フォームをリセット
        contactForm.reset();
        
        // 10秒後に成功メッセージを削除
        setTimeout(() => {
            successContainer.remove();
        }, 10000);
    }
    
    // 模擬的な送信処理
    function simulateFormSubmission(formData) {
        console.log('🚀 送信処理開始:', formData);
        // ローディング表示
        showLoadingState();
        
        // 実際のバックエンドAPIに送信
        console.log('📡 APIにデータ送信中...');
        fetch('/api/contact/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            console.log('📨 API Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('📊 API Response data:', data);
            hideLoadingState();
            
            if (data.success) {
                console.log('✅ 送信成功 - contactId:', data.contactId);
                // 成功メッセージを表示
                showSuccessMessage();
                
                // 管理者向けの通知（模擬）
                showAdminNotification(formData);
                
                console.log('お問い合わせ送信成功:', data);
            } else {
                console.log('❌ 送信失敗:', data.error);
                // エラーメッセージを表示
                showErrors([data.error || 'お問い合わせの送信に失敗しました']);
            }
        })
        .catch(error => {
            console.log('💥 ネットワークエラー:', error);
            hideLoadingState();
            console.error('送信エラー:', error);
            showErrors(['ネットワークエラーが発生しました。時間をおいて再試行してください。']);
        });
    }
    
    // ローディング状態の表示
    function showLoadingState() {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
        submitButton.setAttribute('data-original-text', originalText);
    }
    
    // ローディング状態の解除
    function hideLoadingState() {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.getAttribute('data-original-text');
        
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        submitButton.removeAttribute('data-original-text');
    }
    
    // ローカルストレージへの保存
    function saveToLocalStorage(formData) {
        const timestamp = new Date().toISOString();
        const contactData = {
            ...formData,
            timestamp: timestamp,
            id: Date.now()
        };
        
        // 既存のデータを取得
        const existingData = JSON.parse(localStorage.getItem('tennisClubContacts') || '[]');
        existingData.push(contactData);
        
        // 最新10件のみ保持
        const latestData = existingData.slice(-10);
        localStorage.setItem('tennisClubContacts', JSON.stringify(latestData));
    }
    
    // 管理者向け通知（模擬）
    function showAdminNotification(formData) {
        // 実際のアプリケーションでは、管理者にメール通知等を送信
        console.log('管理者通知:', `新しいお問い合わせがあります - ${formData.name}様より`);
        
        // ページ右上に小さな通知を表示
        const notification = document.createElement('div');
        notification.className = 'admin-notification';
        notification.innerHTML = `
            <i class="fas fa-bell"></i>
            <span>管理者に通知しました</span>
        `;
        
        document.body.appendChild(notification);
        
        // 3秒後に通知を削除
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // ページ読み込み時に過去の問い合わせ数を表示（管理者向け）
    function displayContactStats() {
        const contacts = JSON.parse(localStorage.getItem('tennisClubContacts') || '[]');
        if (contacts.length > 0) {
            console.log(`過去のお問い合わせ件数: ${contacts.length}件`);
            console.log('最新のお問い合わせ:', contacts[contacts.length - 1]);
        }
    }
    
    // 統計表示
    displayContactStats();
});

// フォーム入力の改善機能
document.addEventListener('DOMContentLoaded', function() {
    // リアルタイムバリデーション
    const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea, #contact-form select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateSingleField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // 個別フィールドのバリデーション
    function validateSingleField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let errorMessage = '';
        
        clearFieldError(field);
        
        switch(fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'お名前を入力してください';
                } else if (value.length < 2) {
                    errorMessage = 'お名前は2文字以上で入力してください';
                }
                break;
                
            case 'email':
                if (!value) {
                    errorMessage = 'メールアドレスを入力してください';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errorMessage = 'メールアドレスの形式が正しくありません';
                }
                break;
                
            case 'phone':
                if (value && !/^[\d\-\(\)\+\s]+$/.test(value)) {
                    errorMessage = '電話番号の形式が正しくありません';
                }
                break;
                
            case 'message':
                if (!value) {
                    errorMessage = 'メッセージを入力してください';
                } else if (value.length < 10) {
                    errorMessage = 'メッセージは10文字以上で入力してください';
                }
                break;
        }
        
        if (errorMessage) {
            showFieldError(field, errorMessage);
        }
    }
    
    // フィールドエラーの表示
    function showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    // フィールドエラーの削除
    function clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
});
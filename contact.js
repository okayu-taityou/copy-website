console.log('contact.js loaded');// お問い合わせフォームの機能// お問い合わせフォームの機能



document.addEventListener('DOMContentLoaded', function() {console.log('🔧 contact.js が読み込まれました');console.log('🔧 contact.js が読み込まれました');

    console.log('DOM loaded - initializing contact form');

    const contactForm = document.getElementById('contact-form');

    console.log('Contact form found:', contactForm);

    document.addEventListener('DOMContentLoaded', function() {document.addEventListener('DOMContentLoaded', function() {

    if (contactForm) {

        contactForm.addEventListener('submit', handleFormSubmit);    console.log('📋 DOM読み込み完了 - contact.js初期化開始');    console.log('📋 DOM読み込み完了 - contact.js初期化開始');

    }

        const contactForm = document.getElementById('contact-form');    const contactForm = document.getElementById('contact-form');

    function handleFormSubmit(e) {

        e.preventDefault();    console.log('🔍 フォーム要素検索結果:', contactForm);    console.log('🔍 フォーム要素検索結果:', contactForm);

        console.log('Form submit triggered');

                

        const formData = new FormData(e.target);

        const formObj = {};    if (contactForm) {    if (contactForm) {

        for (let [key, value] of formData.entries()) {

            formObj[key] = value;        console.log('✅ お問い合わせフォームが見つかりました');        console.log('✅ お問い合わせフォームが見つかりました');

            console.log(`${key}: "${value}"`);

        }        contactForm.addEventListener('submit', handleFormSubmit);        // フォーム送信のイベントリスナー - 新しいハンドラーを使用

        

        console.log('Form data:', formObj);    } else {        contactForm.addEventListener('submit', handleFormSubmit);

        

        if (validateForm(formObj)) {        console.log('❌ お問い合わせフォームが見つかりません');            e.preventDefault();

            submitToAPI(formObj);

        }        console.log('📝 現在のDOM内の全フォーム:', document.querySelectorAll('form'));            console.log('📝 フォーム送信イベント発生');

    }

            console.log('📝 contact-form IDを持つ要素:', document.querySelector('#contact-form'));            

    function validateForm(data) {

        console.log('Validating form data:', data);        console.log('📝 全体のHTML:', document.body.innerHTML.length, '文字');            // まず要素を取得

        const errors = [];

            }            const nameElement = document.getElementById('name');

        if (!data.name || data.name.trim() === '') {

            errors.push('名前は必須です');                const emailElement = document.getElementById('email');

        }

            // フォーム送信ハンドラー            const subjectElement = document.getElementById('subject');

        if (!data.email || data.email.trim() === '') {

            errors.push('メールアドレスは必須です');    function handleFormSubmit(e) {            const messageElement = document.getElementById('message');

        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {

            errors.push('メールアドレスの形式が正しくありません');        e.preventDefault();            

        }

                console.log('📝 フォーム送信イベント発生');            console.log('� 要素取得結果:');

        if (!data.message || data.message.trim() === '') {

            errors.push('メッセージは必須です');                    console.log('  - name element:', nameElement);

        }

                // FormDataを使用してデータを取得            console.log('  - email element:', emailElement);

        if (errors.length > 0) {

            console.log('Validation errors:', errors);        const formData = new FormData(e.target);            console.log('  - subject element:', subjectElement);

            showErrors(errors);

            return false;        console.log('📊 FormData entries:');            console.log('  - message element:', messageElement);

        }

                for (let [key, value] of formData.entries()) {            

        return true;

    }            console.log(`  ${key}: "${value}" (length: ${value.length})`);            // フォームデータを取得 - 直接input要素から取得する方法に変更

    

    function showErrors(errors) {        }            const formObj = {

        const errorDiv = document.createElement('div');

        errorDiv.className = 'error-messages';                        name: nameElement ? nameElement.value : '',

        errorDiv.innerHTML = '<h4>エラー:</h4><ul>' + 

            errors.map(error => `<li>${error}</li>`).join('') + '</ul>';        // オブジェクトに変換                email: emailElement ? emailElement.value : '',

        

        const existingError = contactForm.querySelector('.error-messages');        const formObj = {};                subject: subjectElement ? subjectElement.value : '',

        if (existingError) {

            existingError.remove();        for (let [key, value] of formData.entries()) {                message: messageElement ? messageElement.value : ''

        }

                    formObj[key] = value;            };

        contactForm.insertBefore(errorDiv, contactForm.firstChild);

                }            

        setTimeout(() => {

            errorDiv.remove();                    console.log('📊 フォームデータ:', formObj);

        }, 5000);

    }        console.log('📊 変換されたフォームオブジェクト:', formObj);            console.log('📊 各値の詳細:');

    

    function showSuccess() {                    console.log('  - name:', `"${formObj.name}" (length: ${formObj.name.length})`);

        const successDiv = document.createElement('div');

        successDiv.className = 'success-message';        // バリデーション            console.log('  - email:', `"${formObj.email}" (length: ${formObj.email.length})`);

        successDiv.innerHTML = '<h4>送信完了!</h4><p>お問い合わせありがとうございます。</p>';

                if (validateForm(formObj)) {            console.log('  - subject:', `"${formObj.subject}" (length: ${formObj.subject.length})`);

        contactForm.insertBefore(successDiv, contactForm.firstChild);

        contactForm.reset();            console.log('✅ バリデーション成功 - 送信処理開始');            console.log('  - message:', `"${formObj.message}" (length: ${formObj.message.length})`);

        

        setTimeout(() => {            simulateFormSubmission(formObj);            

            successDiv.remove();

        }, 10000);        } else {            // バリデーション

    }

                console.log('❌ バリデーションエラー');            if (validateForm(formObj)) {

    function submitToAPI(formData) {

        console.log('Submitting to API:', formData);        }                console.log('✅ バリデーション成功 - 送信処理開始');

        

        fetch('/api/contact/send', {    }                // 模擬的な送信処理

            method: 'POST',

            headers: {                    simulateFormSubmission(formObj);

                'Content-Type': 'application/json',

            },    // フォームバリデーション            } else {

            body: JSON.stringify(formData)

        })    function validateForm(data) {                console.log('❌ バリデーションエラー');

        .then(response => {

            console.log('API response status:', response.status);        console.log('🔍 バリデーション開始');            }

            return response.json();

        })        console.log('📋 受信データ詳細:', JSON.stringify(data, null, 2));        });

        .then(data => {

            console.log('API response data:', data);        let isValid = true;    } else {

            if (data.success) {

                showSuccess();        const errors = [];        console.log('❌ お問い合わせフォームが見つかりません');

            } else {

                showErrors([data.error || '送信に失敗しました']);                console.log('📝 現在のDOM内の全フォーム:', document.querySelectorAll('form'));

            }

        })        // 必須項目のチェック        console.log('📝 contact-form IDを持つ要素:', document.querySelector('#contact-form'));

        .catch(error => {

            console.error('Network error:', error);        console.log('👤 お名前チェック:', data.name, '(length:', data.name?.length, ')');        console.log('📝 全体のHTML:', document.body.innerHTML.length, '文字');

            showErrors(['ネットワークエラーが発生しました']);

        });        if (!data.name || data.name.trim() === '') {    }

    }

});            console.log('❌ お名前エラー');    

            errors.push('お名前は必須項目です。');    // フォームバリデーション

            isValid = false;    function validateForm(data) {

        } else {        console.log('🔍 バリデーション開始');

            console.log('✅ お名前OK');        console.log('📋 受信データ詳細:', JSON.stringify(data, null, 2));

        }        let isValid = true;

                const errors = [];

        console.log('📧 メールアドレスチェック:', data.email, '(length:', data.email?.length, ')');        

        if (!data.email || data.email.trim() === '') {        // 必須項目のチェック

            console.log('❌ メールアドレス未入力エラー');        console.log('👤 お名前チェック:', data.name, '(length:', data.name?.length, ')');

            errors.push('メールアドレスは必須項目です。');        if (!data.name || data.name.trim() === '') {

            isValid = false;            console.log('❌ お名前エラー');

        } else if (!isValidEmail(data.email)) {            errors.push('お名前は必須項目です。');

            console.log('❌ メールアドレス形式エラー');            isValid = false;

            errors.push('メールアドレスの形式が正しくありません。');        } else {

            isValid = false;            console.log('✅ お名前OK');

        } else {        }

            console.log('✅ メールアドレスOK');        

        }        console.log('📧 メールアドレスチェック:', data.email, '(length:', data.email?.length, ')');

                if (!data.email || data.email.trim() === '') {

        console.log('💬 メッセージチェック:', data.message, '(length:', data.message?.length, ')');            console.log('❌ メールアドレス未入力エラー');

        if (!data.message || data.message.trim() === '') {            errors.push('メールアドレスは必須項目です。');

            console.log('❌ メッセージエラー');            isValid = false;

            errors.push('メッセージは必須項目です。');        } else if (!isValidEmail(data.email)) {

            isValid = false;            console.log('❌ メールアドレス形式エラー');

        } else {            errors.push('メールアドレスの形式が正しくありません。');

            console.log('✅ メッセージOK');            isValid = false;

        }        } else {

                    console.log('✅ メールアドレスOK');

        // エラーメッセージを表示        }

        if (!isValid) {        

            console.log('❌ バリデーション失敗 - エラー内容:', errors);        console.log('💬 メッセージチェック:', data.message, '(length:', data.message?.length, ')');

            showErrors(errors);        if (!data.message || data.message.trim() === '') {

        } else {            console.log('❌ メッセージエラー');

            console.log('✅ バリデーション全項目成功');            errors.push('メッセージは必須項目です。');

        }            isValid = false;

                } else {

        console.log('📊 バリデーション結果:', isValid);            console.log('✅ メッセージOK');

        return isValid;        }

    }        

            // エラーメッセージを表示

    // メールアドレスの形式チェック        if (!isValid) {

    function isValidEmail(email) {            console.log('❌ バリデーション失敗 - エラー内容:', errors);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;            showErrors(errors);

        return emailRegex.test(email);        } else {

    }            console.log('✅ バリデーション全項目成功');

            }

    // エラーメッセージの表示        

    function showErrors(errors) {        console.log('📊 バリデーション結果:', isValid);

        removeExistingErrors();        return isValid;

            }

        const errorContainer = document.createElement('div');    

        errorContainer.className = 'error-messages';    // メールアドレスの形式チェック

        errorContainer.innerHTML = `    function isValidEmail(email) {

            <div class="error-list">        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                <h4><i class="fas fa-exclamation-circle"></i> 入力エラー</h4>        return emailRegex.test(email);

                <ul>    }

                    ${errors.map(error => `<li>${error}</li>`).join('')}    

                </ul>    // エラーメッセージの表示

            </div>    function showErrors(errors) {

        `;        removeExistingErrors();

                

        contactForm.insertBefore(errorContainer, contactForm.firstChild);        const errorContainer = document.createElement('div');

                errorContainer.className = 'error-messages';

        // エラーメッセージにスクロール        errorContainer.innerHTML = `

        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });            <div class="error-list">

                        <h4><i class="fas fa-exclamation-circle"></i> 入力エラー</h4>

        // 5秒後に自動で消去                <ul>

        setTimeout(() => {                    ${errors.map(error => `<li>${error}</li>`).join('')}

            errorContainer.remove();                </ul>

        }, 5000);            </div>

    }        `;

            

    // 既存のエラーメッセージを削除        contactForm.insertBefore(errorContainer, contactForm.firstChild);

    function removeExistingErrors() {        

        const existingErrors = contactForm.querySelectorAll('.error-messages');        // エラーメッセージにスクロール

        existingErrors.forEach(error => error.remove());        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

    }        

            // 5秒後に自動で消去

    // 成功メッセージの表示        setTimeout(() => {

    function showSuccessMessage() {            errorContainer.remove();

        removeExistingErrors();        }, 5000);

            }

        const successContainer = document.createElement('div');    

        successContainer.className = 'success-message';    // 既存のエラーメッセージを削除

        successContainer.innerHTML = `    function removeExistingErrors() {

            <div class="success-content">        const existingErrors = contactForm.querySelectorAll('.error-messages');

                <i class="fas fa-check-circle"></i>        existingErrors.forEach(error => error.remove());

                <h4>送信完了！</h4>    }

                <p>お問い合わせありがとうございます。<br>    

                   内容を確認次第、担当者よりご連絡いたします。</p>    // 成功メッセージの表示

                <p class="response-time">※通常1-2営業日以内にご返信いたします</p>    function showSuccessMessage() {

            </div>        removeExistingErrors();

        `;        

                const successContainer = document.createElement('div');

        contactForm.insertBefore(successContainer, contactForm.firstChild);        successContainer.className = 'success-message';

                successContainer.innerHTML = `

        // 成功メッセージにスクロール            <div class="success-content">

        successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });                <i class="fas fa-check-circle"></i>

                        <h4>送信完了！</h4>

        // フォームをリセット                <p>お問い合わせありがとうございます。<br>

        contactForm.reset();                   内容を確認次第、担当者よりご連絡いたします。</p>

                        <p class="response-time">※通常1-2営業日以内にご返信いたします</p>

        // 10秒後に成功メッセージを削除            </div>

        setTimeout(() => {        `;

            successContainer.remove();        

        }, 10000);        contactForm.insertBefore(successContainer, contactForm.firstChild);

    }        

            // 成功メッセージにスクロール

    // 送信処理        successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

    function simulateFormSubmission(formData) {        

        console.log('🚀 送信処理開始:', formData);        // フォームをリセット

        // ローディング表示        contactForm.reset();

        showLoadingState();        

                // 10秒後に成功メッセージを削除

        // 実際のバックエンドAPIに送信        setTimeout(() => {

        console.log('📡 APIにデータ送信中...');            successContainer.remove();

        fetch('/api/contact/send', {        }, 10000);

            method: 'POST',    }

            headers: {    

                'Content-Type': 'application/json',    // 模擬的な送信処理

            },    function simulateFormSubmission(formData) {

            body: JSON.stringify(formData)        console.log('🚀 送信処理開始:', formData);

        })        // ローディング表示

        .then(response => {        showLoadingState();

            console.log('📨 API Response status:', response.status);        

            return response.json();        // 実際のバックエンドAPIに送信

        })        console.log('📡 APIにデータ送信中...');

        .then(data => {        fetch('/api/contact/send', {

            console.log('📊 API Response data:', data);            method: 'POST',

            hideLoadingState();            headers: {

                            'Content-Type': 'application/json',

            if (data.success) {            },

                console.log('✅ 送信成功 - contactId:', data.contactId);            body: JSON.stringify(formData)

                // 成功メッセージを表示        })

                showSuccessMessage();        .then(response => {

                            console.log('📨 API Response status:', response.status);

                // 管理者向けの通知（模擬）            return response.json();

                showAdminNotification(formData);        })

                        .then(data => {

                console.log('お問い合わせ送信成功:', data);            console.log('📊 API Response data:', data);

            } else {            hideLoadingState();

                console.log('❌ 送信失敗:', data.error);            

                // エラーメッセージを表示            if (data.success) {

                showErrors([data.error || 'お問い合わせの送信に失敗しました']);                console.log('✅ 送信成功 - contactId:', data.contactId);

            }                // 成功メッセージを表示

        })                showSuccessMessage();

        .catch(error => {                

            console.log('💥 ネットワークエラー:', error);                // 管理者向けの通知（模擬）

            hideLoadingState();                showAdminNotification(formData);

            console.error('送信エラー:', error);                

            showErrors(['ネットワークエラーが発生しました。時間をおいて再試行してください。']);                console.log('お問い合わせ送信成功:', data);

        });            } else {

    }                console.log('❌ 送信失敗:', data.error);

                    // エラーメッセージを表示

    // ローディング状態の表示                showErrors([data.error || 'お問い合わせの送信に失敗しました']);

    function showLoadingState() {            }

        const submitButton = contactForm.querySelector('button[type="submit"]');        })

        const originalText = submitButton.textContent;        .catch(error => {

                    console.log('💥 ネットワークエラー:', error);

        submitButton.disabled = true;            hideLoadingState();

        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';            console.error('送信エラー:', error);

        submitButton.setAttribute('data-original-text', originalText);            showErrors(['ネットワークエラーが発生しました。時間をおいて再試行してください。']);

    }        });

        }

    // ローディング状態の解除    

    function hideLoadingState() {    // ローディング状態の表示

        const submitButton = contactForm.querySelector('button[type="submit"]');    function showLoadingState() {

        const originalText = submitButton.getAttribute('data-original-text');        const submitButton = contactForm.querySelector('button[type="submit"]');

                const originalText = submitButton.textContent;

        submitButton.disabled = false;        

        submitButton.textContent = originalText;        submitButton.disabled = true;

        submitButton.removeAttribute('data-original-text');        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';

    }        submitButton.setAttribute('data-original-text', originalText);

        }

    // 管理者向け通知（模擬）    

    function showAdminNotification(formData) {    // ローディング状態の解除

        // 実際のアプリケーションでは、管理者にメール通知等を送信    function hideLoadingState() {

        console.log('管理者通知:', `新しいお問い合わせがあります - ${formData.name}様より`);        const submitButton = contactForm.querySelector('button[type="submit"]');

                const originalText = submitButton.getAttribute('data-original-text');

        // ページ右上に小さな通知を表示        

        const notification = document.createElement('div');        submitButton.disabled = false;

        notification.className = 'admin-notification';        submitButton.textContent = originalText;

        notification.innerHTML = `        submitButton.removeAttribute('data-original-text');

            <i class="fas fa-bell"></i>    }

            <span>管理者に通知しました</span>    

        `;    // ローカルストレージへの保存

            function saveToLocalStorage(formData) {

        document.body.appendChild(notification);        const timestamp = new Date().toISOString();

                const contactData = {

        // 3秒後に通知を削除            ...formData,

        setTimeout(() => {            timestamp: timestamp,

            notification.remove();            id: Date.now()

        }, 3000);        };

    }        

});        // 既存のデータを取得
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

// 新しいフォーム送信ハンドラー
function handleFormSubmit(e) {
    e.preventDefault();
    console.log('📝 フォーム送信イベント発生 (新しいハンドラー)');
    
    // 直接FormDataを使用してみる
    const formData = new FormData(e.target);
    console.log('📊 FormData entries:');
    for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: "${value}" (length: ${value.length})`);
    }
    
    // オブジェクトに変換
    const formObj = {};
    for (let [key, value] of formData.entries()) {
        formObj[key] = value;
    }
    
    console.log('📊 変換されたフォームオブジェクト:', formObj);
    
    // バリデーション
    if (validateForm(formObj)) {
        console.log('✅ バリデーション成功 - 送信処理開始');
        simulateFormSubmission(formObj);
    } else {
        console.log('❌ バリデーションエラー');
    }
}
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const database = require('../database/init');
const router = express.Router();

// デフォルト管理者アカウント自動作成
router.get('/create-default-admin', async (req, res) => {
    try {
        const db = database.getDb();
        
        // 既存の管理者をチェック
        const existingAdmin = await new Promise((resolve, reject) => {
            db.get('SELECT COUNT(*) as count FROM admins', [], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });
        
        if (existingAdmin > 0) {
            return res.json({
                success: false,
                error: '管理者アカウントは既に存在します'
            });
        }
        
        // デフォルト管理者アカウントを作成
        const defaultAdmin = {
            username: 'admin',
            password: 'tennis123',
            email: 'admin@tennis-club.com',
            role: 'admin'
        };
        
        const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);
        
        await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO admins (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
                [defaultAdmin.username, hashedPassword, defaultAdmin.email, defaultAdmin.role],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
        
        res.json({
            success: true,
            message: 'デフォルト管理者アカウントを作成しました',
            credentials: {
                username: defaultAdmin.username,
                password: defaultAdmin.password,
                email: defaultAdmin.email
            }
        });
    } catch (error) {
        console.error('デフォルト管理者作成エラー:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// デバッグ用：管理者テーブルの状態確認
router.get('/debug', async (req, res) => {
    try {
        const db = database.getDb();
        
        // 管理者の数を確認
        const adminCount = await new Promise((resolve, reject) => {
            db.get('SELECT COUNT(*) as count FROM admins', [], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });
        
        // 管理者一覧を確認（パスワードハッシュは除外）
        const adminList = await new Promise((resolve, reject) => {
            db.all('SELECT id, username, email, role, created_at FROM admins', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        
        res.json({
            success: true,
            data: {
                adminCount,
                adminList,
                jwtSecret: process.env.JWT_SECRET ? '設定済み' : '未設定',
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const JWT_SECRET = process.env.JWT_SECRET || 'tennis-club-secret-key-2023';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// 認証ミドルウェア
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'アクセストークンが必要です'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                error: 'トークンが無効です'
            });
        }
        req.user = user;
        next();
    });
};

// ダッシュボード統計情報
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const db = database.getDb();
        
        // お問い合わせ統計
        const contactStats = await new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'unread' THEN 1 ELSE 0 END) as unread,
                    SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read,
                    SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied,
                    COUNT(CASE WHEN DATE(created_at) = DATE('now') THEN 1 END) as today,
                    COUNT(CASE WHEN DATE(created_at) >= DATE('now', '-7 days') THEN 1 END) as this_week
                FROM contacts
            `;
            
            db.get(sql, [], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        // SNS統計
        const snsStats = await new Promise((resolve, reject) => {
            const sql = `
                SELECT 
                    COUNT(*) as total_posts,
                    SUM(likes_count) as total_likes,
                    SUM(comments_count) as total_comments,
                    SUM(shares_count) as total_shares,
                    COUNT(CASE WHEN DATE(created_at) = DATE('now') THEN 1 END) as today_posts,
                    COUNT(CASE WHEN DATE(created_at) >= DATE('now', '-7 days') THEN 1 END) as week_posts
                FROM sns_posts 
                WHERE is_active = 1
            `;
            
            db.get(sql, [], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        // 最新のお問い合わせ
        const recentContacts = await new Promise((resolve, reject) => {
            const sql = `
                SELECT id, name, email, subject, message, status, 
                       datetime(created_at, '+9 hours') as created_at
                FROM contacts 
                ORDER BY created_at DESC 
                LIMIT 5
            `;
            
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        // 最新のSNS投稿
        const recentPosts = await new Promise((resolve, reject) => {
            const sql = `
                SELECT id, platform, content, likes_count, comments_count, shares_count, created_at
                FROM sns_posts 
                WHERE is_active = 1
                ORDER BY created_at DESC 
                LIMIT 5
            `;
            
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        res.json({
            success: true,
            data: {
                contacts: contactStats,
                sns: snsStats,
                recent_contacts: recentContacts,
                recent_posts: recentPosts,
                server_info: {
                    uptime: process.uptime(),
                    memory_usage: process.memoryUsage(),
                    timestamp: new Date().toISOString()
                }
            }
        });

    } catch (error) {
        console.error('ダッシュボード統計取得エラー:', error);
        res.status(500).json({
            success: false,
            error: '統計情報の取得に失敗しました'
        });
    }
});

// ログイン
const loginValidation = [
    body('username')
        .isLength({ min: 1 })
        .withMessage('ユーザー名は必須です')
        .trim()
        .escape(),
    body('password')
        .isLength({ min: 1 })
        .withMessage('パスワードは必須です')
];

router.post('/login', loginValidation, async (req, res) => {
    console.log('🔐 ログイン試行開始:', new Date().toISOString());
    console.log('受信データ:', { username: req.body.username, hasPassword: !!req.body.password });
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('❌ バリデーションエラー:', errors.array());
            return res.status(400).json({
                success: false,
                error: 'バリデーションエラー',
                details: errors.array()
            });
        }

        const { username, password } = req.body;
        const db = database.getDb();
        console.log('📋 データベース接続確認済み');
        
        // ユーザー検索
        const admin = await new Promise((resolve, reject) => {
            console.log('🔍 管理者検索中:', username);
            const sql = 'SELECT * FROM admins WHERE username = ?';
            db.get(sql, [username], (err, row) => {
                if (err) {
                    console.error('❌ データベースエラー:', err);
                    reject(err);
                } else {
                    console.log('🔍 検索結果:', row ? '管理者が見つかりました' : '管理者が見つかりません');
                    resolve(row);
                }
            });
        });

        if (!admin) {
            console.log('❌ 管理者が見つかりません:', username);
            return res.status(401).json({
                success: false,
                error: 'ユーザー名またはパスワードが正しくありません'
            });
        }

        console.log('🔑 パスワード検証中...');
        // パスワード確認
        const isValidPassword = await bcrypt.compare(password, admin.password_hash);
        if (!isValidPassword) {
            console.log('❌ パスワードが正しくありません');
            return res.status(401).json({
                success: false,
                error: 'ユーザー名またはパスワードが正しくありません'
            });
        }

        console.log('✅ パスワード検証成功');
        console.log('📝 ログイン時刻更新中...');

        console.log('✅ パスワード検証成功');
        console.log('📝 ログイン時刻更新中...');

        // ログイン時刻更新
        await new Promise((resolve, reject) => {
            const sql = 'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
            db.run(sql, [admin.id], (err) => {
                if (err) {
                    console.error('❌ ログイン時刻更新エラー:', err);
                    reject(err);
                } else {
                    console.log('✅ ログイン時刻更新完了');
                    resolve();
                }
            });
        });

        console.log('🎟️ JWTトークン生成中...');
        // JWTトークン生成
        const token = jwt.sign(
            { 
                id: admin.id, 
                username: admin.username, 
                email: admin.email,
                role: admin.role 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        console.log('✅ JWTトークン生成完了');
        console.log('🚀 ログイン成功レスポンス送信');

        res.json({
            success: true,
            message: 'ログインしました',
            token: token,  // フロントエンドが期待する形式に修正
            data: {
                token,
                user: {
                    id: admin.id,
                    username: admin.username,
                    email: admin.email,
                    role: admin.role,
                    last_login: admin.last_login
                }
            }
        });

    } catch (error) {
        console.error('💥 ログインエラー:', error);
        res.status(500).json({
            success: false,
            error: 'ログイン処理に失敗しました'
        });
    }
});

// トークン検証
router.get('/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'トークンは有効です',
        data: {
            user: req.user
        }
    });
});

// お問い合わせステータス更新
router.put('/contacts/:id/status', authenticateToken, async (req, res) => {
    try {
        const contactId = parseInt(req.params.id);
        const { status } = req.body;
        
        if (!['unread', 'read', 'replied', 'closed'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: '無効なステータスです'
            });
        }

        const db = database.getDb();
        const sql = `
            UPDATE contacts 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        
        const result = await new Promise((resolve, reject) => {
            db.run(sql, [status, contactId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });

        if (result === 0) {
            return res.status(404).json({
                success: false,
                error: 'お問い合わせが見つかりません'
            });
        }

        res.json({
            success: true,
            message: 'ステータスを更新しました'
        });

    } catch (error) {
        console.error('ステータス更新エラー:', error);
        res.status(500).json({
            success: false,
            error: 'ステータスの更新に失敗しました'
        });
    }
});

// 初期管理者作成（初回セットアップ用）
router.post('/setup', async (req, res) => {
    try {
        const db = database.getDb();
        
        // 既に管理者が存在するかチェック
        const existingAdmin = await new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM admins';
            db.get(sql, [], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });

        if (existingAdmin > 0) {
            return res.status(400).json({
                success: false,
                error: '管理者は既に作成されています'
            });
        }

        const { username, password, email } = req.body;
        
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                error: 'ユーザー名、パスワード、メールアドレスは必須です'
            });
        }

        // パスワードハッシュ化
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 管理者作成
        const adminId = await new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO admins (username, password_hash, email, role)
                VALUES (?, ?, ?, 'admin')
            `;
            
            db.run(sql, [username, passwordHash, email], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });

        res.json({
            success: true,
            message: '初期管理者を作成しました',
            data: {
                id: adminId,
                username,
                email
            }
        });

    } catch (error) {
        console.error('管理者作成エラー:', error);
        res.status(500).json({
            success: false,
            error: '管理者の作成に失敗しました'
        });
    }
});

// 強制管理者作成（デバッグ用）
router.post('/force-create', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                error: 'ユーザー名、パスワード、メールアドレスは必須です'
            });
        }

        const db = database.getDb();
        
        // パスワードハッシュ化
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 管理者作成（重複チェックなし）
        const adminId = await new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO admins (username, password_hash, email, role)
                VALUES (?, ?, ?, 'admin')
            `;
            db.run(sql, [username, passwordHash, email], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });

        res.json({
            success: true,
            message: '管理者が作成されました',
            adminId: adminId
        });

    } catch (error) {
        console.error('強制管理者作成エラー:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 簡単な管理者作成（GETリクエスト）
router.get('/create-admin/:username/:password/:email', async (req, res) => {
    try {
        const { username, password, email } = req.params;
        
        const db = database.getDb();
        
        // パスワードハッシュ化
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 管理者作成
        const adminId = await new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO admins (username, password_hash, email, role)
                VALUES (?, ?, ?, 'admin')
            `;
            db.run(sql, [username, passwordHash, email], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });

        res.json({
            success: true,
            message: `管理者 '${username}' が作成されました`,
            adminId: adminId,
            loginUrl: '/admin/login'
        });

    } catch (error) {
        console.error('管理者作成エラー:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 管理者テーブルをリセット（開発用）
router.get('/reset-admins', async (req, res) => {
    try {
        const db = database.getDb();
        
        // すべての管理者を削除
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM admins', [], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });

        res.json({
            success: true,
            message: 'すべての管理者アカウントが削除されました',
            resetUrl: '/admin/setup'
        });

    } catch (error) {
        console.error('管理者リセットエラー:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// テストデータを作成（開発用）
router.get('/create-test-data', async (req, res) => {
    try {
        const db = database.getDb();
        
        // お問い合わせテストデータ
        const contactsData = [
            {
                name: '田中太郎',
                email: 'tanaka@example.com',
                subject: '見学希望',
                message: 'テニス部の見学をしたいです。初心者でも大丈夫でしょうか？',
                status: 'unread'
            },
            {
                name: '佐藤花子',
                email: 'sato@example.com',
                subject: '体験入部希望',
                message: '体験入部をしてみたいです。いつ頃がよろしいでしょうか？',
                status: 'read'
            },
            {
                name: '山田次郎',
                email: 'yamada@example.com',
                subject: '質問',
                message: '練習時間や頻度について教えてください。',
                status: 'replied'
            }
        ];
        
        // お問い合わせデータを挿入
        let contactsInserted = 0;
        for (const contact of contactsData) {
            try {
                await new Promise((resolve, reject) => {
                    const sql = `
                        INSERT INTO contacts (name, email, subject, message, status, ip_address, user_agent)
                        VALUES (?, ?, ?, ?, ?, '127.0.0.1', 'TestData')
                    `;
                    db.run(sql, [contact.name, contact.email, contact.subject, contact.message, contact.status], function(err) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    });
                });
                contactsInserted++;
            } catch (err) {
                console.log('お問い合わせデータ挿入エラー:', err.message);
            }
        }
        
        // SNS投稿テストデータ
        const snsData = [
            {
                platform: 'instagram',
                author: '○○大学テニス部',
                content: '今日は新入生歓迎会でした！🎾 たくさんの方に参加していただき、ありがとうございました！',
                likes_count: 45,
                comments_count: 12,
                shares_count: 3
            },
            {
                platform: 'twitter',
                author: '○○大学テニス部',
                content: '明日は練習試合です！頑張ります💪 #テニス #大学テニス',
                likes_count: 28,
                comments_count: 7,
                shares_count: 15
            }
        ];
        
        // SNS投稿データを挿入
        let snsInserted = 0;
        for (const post of snsData) {
            try {
                await new Promise((resolve, reject) => {
                    const sql = `
                        INSERT INTO sns_posts (platform, author, content, likes_count, comments_count, shares_count)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `;
                    db.run(sql, [post.platform, post.author, post.content, post.likes_count, post.comments_count, post.shares_count], function(err) {
                        if (err) reject(err);
                        else resolve(this.lastID);
                    });
                });
                snsInserted++;
            } catch (err) {
                console.log('SNS投稿データ挿入エラー:', err.message);
            }
        }

        res.json({
            success: true,
            message: 'テストデータが作成されました',
            data: {
                contactsInserted,
                snsInserted,
                dashboardUrl: '/admin/dashboard'
            }
        });

    } catch (error) {
        console.error('テストデータ作成エラー:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// お問い合わせを既読にマーク
router.post('/mark-contact-read', authenticateToken, async (req, res) => {
    console.log('📖 お問い合わせ既読マーク要求:', req.body);
    
    try {
        const { contactId } = req.body;
        
        if (!contactId) {
            return res.status(400).json({
                success: false,
                error: 'お問い合わせIDが必要です'
            });
        }
        
        const db = database.getDb();
        
        // お問い合わせのステータスを既読に更新
        const updateResult = await new Promise((resolve, reject) => {
            const sql = `
                UPDATE contacts 
                SET status = 'read', 
                    read_at = datetime('now', '+9 hours')
                WHERE id = ? AND status = 'unread'
            `;
            
            db.run(sql, [contactId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`📖 UPDATE実行結果: changes=${this.changes}, lastID=${this.lastID}`);
                    resolve({ changes: this.changes });
                }
            });
        });
        
        if (updateResult.changes > 0) {
            console.log(`✅ お問い合わせ ${contactId} を既読にマークしました`);
            res.json({
                success: true,
                message: 'お問い合わせを既読にマークしました'
            });
        } else {
            res.json({
                success: false,
                error: 'お問い合わせが見つからないか、既に既読です'
            });
        }
        
    } catch (error) {
        console.error('既読マークエラー:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
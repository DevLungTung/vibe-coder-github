# 📝 TODO App - GitHub for Vibe Coders

> Repository demo dành cho video "GitHub for Vibe Coders" của kênh **Quân IT**

Đây là một TODO app đơn giản được xây dựng để dạy Git và GitHub cho những người làm việc với AI coding tools (Cursor, Copilot, Claude) nhưng chưa học Git bài bản.

## 🎯 Mục đích

Repository này được thiết kế để demo trực tiếp trong video 1 giờ, bao gồm:
- ✅ Git cơ bản (commits, history, diff, revert)
- ✅ GitHub (push/pull/clone, .gitignore, secrets)
- ✅ Branches, Pull Requests, và Merge Conflicts
- ✅ CI với GitHub Actions
- ✅ Docker và docker-compose
- ✅ CD (build image, deploy, rollback)

## 🚀 Quick Start

### Chạy với Node.js (in-memory)
```bash
npm install
npm start
```
Mở http://localhost:3000

### Chạy với Docker Compose (+ PostgreSQL)
```bash
docker-compose up -d
```
Mở http://localhost:3000

### Chạy tests
```bash
npm test          # Chạy test một lần
npm run lint      # Kiểm tra code style
```

## 📁 Cấu trúc project

```
.
├── src/
│   ├── server.js           # Express server
│   ├── routes/
│   │   └── todos.js        # API routes
│   └── storage/
│       ├── index.js        # Storage selector
│       ├── memory.js       # In-memory storage
│       └── postgres.js     # PostgreSQL storage
├── public/
│   └── index.html          # Frontend đơn giản
├── tests/
│   └── api.test.js         # Vitest tests
├── .github/workflows/
│   ├── ci.yml              # CI workflow
│   └── deploy.yml          # CD workflow
├── docs/
│   └── git-cheat-sheet.md  # Tài liệu tra cứu Git
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # App + PostgreSQL
├── init.sql                # Database schema
├── .gitignore              # Files Git bỏ qua
└── .env.example            # Environment variables mẫu
```

## 🎬 Hướng dẫn Demo (cho Presenter)

### Phần 1: Git Cơ Bản (10 phút)

#### Clone repository
```bash
git clone https://github.com/YOUR_USERNAME/vibe-coder-github.git
cd vibe-coder-github
```

#### Xem lịch sử commit
```bash
git log --oneline --graph
git log --stat
```
👉 **Demo point**: Giải thích các commit được tổ chức tốt, mỗi commit làm 1 việc rõ ràng

#### Xem thay đổi trong commit
```bash
git show HEAD
git show 06c81e0  # Commit của Git cheat sheet
```

#### Xem diff giữa commits
```bash
git diff HEAD~3 HEAD
git diff HEAD~1 HEAD -- src/server.js
```

#### Thực hành: Sửa file và commit
```bash
# Mở src/storage/memory.js và thêm 1 TODO mới
git status
git diff
git add src/storage/memory.js
git commit -m "feat: add new sample TODO"
```

#### Hoàn tác commit (revert)
```bash
git log --oneline -5
git revert HEAD
git log --oneline -5
```
👉 **Demo point**: Revert tạo commit mới, không xóa lịch sử

### Phần 2: GitHub & Secrets (10 phút)

#### Push code lên GitHub
```bash
git push origin main
```
👉 **Show trên GitHub**: Commits, file structure, README

#### Làm việc với .gitignore
```bash
cat .gitignore
```
👉 **Demo point**: Giải thích tại sao KHÔNG commit:
- `node_modules/` - Dependencies (cài lại được bằng npm install)
- `.env` - Secrets và config local
- `*.log` - Files log không cần thiết

#### Environment Variables & Secrets
```bash
cat .env.example
```
👉 **Demo point**:
1. Copy `.env.example` thành `.env`
2. Thêm giá trị thật vào `.env`
3. KHÔNG BAO GIỜ commit file `.env`
4. Nếu commit nhầm secret:
   - Xóa file khỏi Git: `git rm --cached .env`
   - Đổi secret ngay lập tức
   - Commit: `git commit -m "Remove sensitive file"`

#### Clone và Pull
```bash
# Mở terminal khác, clone vào folder khác
cd /tmp
git clone https://github.com/YOUR_USERNAME/vibe-coder-github.git test-clone
cd test-clone

# Sau khi có thay đổi trên GitHub
git pull origin main
```

### Phần 3: Branches, Pull Requests & Conflicts (20 phút)

#### Xem các demo branches
```bash
git branch -a
```
👉 **Có sẵn**: `demo/conflict-a`, `demo/conflict-b`, `demo/failing-test`, `demo/new-feature`

#### Demo 1: Branch workflow cơ bản
```bash
git checkout demo/new-feature
git log --oneline
git diff main
```
👉 **Show trên GitHub**:
1. Branch `demo/new-feature` đã tồn tại
2. Tạo Pull Request từ branch này
3. Xem diff trên GitHub UI
4. Review code
5. Merge Pull Request
6. Xóa branch sau khi merge

#### Demo 2: Merge Conflict
```bash
# Checkout branch conflict-a
git checkout demo/conflict-a
cat src/storage/memory.js  # Xem thay đổi

# Checkout branch conflict-b
git checkout demo/conflict-b
cat src/storage/memory.js  # Xem thay đổi (khác conflict-a)

# Thử merge -> sẽ conflict
git checkout demo/conflict-a
git merge demo/conflict-b
```
👉 **Demo point**: Xử lý conflict:
1. `git status` - Xem files conflict
2. Mở file có conflict
3. Tìm các dòng `<<<<<<<`, `=======`, `>>>>>>>`
4. Chọn code đúng, xóa các dấu conflict
5. `git add .`
6. `git commit -m "Resolve merge conflict"`

```bash
# Hủy merge nếu cần
git merge --abort
```

#### Demo 3: AI Agent tạo Pull Request
👉 **Show workflow với Cursor/Copilot**:
1. Yêu cầu AI: "Add a filter to show only completed todos"
2. AI tạo code trong branch mới
3. AI commit và push
4. AI tạo Pull Request tự động
5. Review và merge

### Phần 4: CI với GitHub Actions (10 phút)

#### Xem CI workflow
```bash
cat .github/workflows/ci.yml
```

#### Demo: CI pass ✅
👉 **Show trên GitHub**:
1. Vào tab "Actions"
2. Xem CI runs trên main branch (màu xanh ✅)
3. Click vào 1 run, xem logs chi tiết
4. Giải thích các bước: install → lint → test

#### Demo: CI fail ❌
```bash
git checkout demo/failing-test
```
👉 **Show trên GitHub**:
1. Tạo PR từ `demo/failing-test`
2. CI sẽ chạy tự động
3. CI fail (màu đỏ ❌)
4. Xem logs để tìm lỗi
5. Fix lỗi, push lại
6. CI chạy lại và pass

#### Giải thích lợi ích CI
- Tự động test mỗi khi push
- Phát hiện bug sớm
- Đảm bảo code quality
- Prevent merge code lỗi vào main

### Phần 5: Docker & Docker Compose (10 phút)

#### Xem Dockerfile
```bash
cat Dockerfile
```
👉 **Demo point**: Giải thích:
- Multi-stage build (tối ưu size)
- Non-root user (security)
- Healthcheck

#### Build Docker image
```bash
docker build -t todo-app .
docker images | grep todo-app
```

#### Chạy container
```bash
docker run -p 3000:3000 todo-app
```
👉 Mở http://localhost:3000

#### Docker Compose
```bash
cat docker-compose.yml
```
👉 **Demo point**: 
- 2 services: app + database
- Healthcheck cho database
- Volume để lưu data
- Network tự động

```bash
docker-compose up -d
docker-compose ps
docker-compose logs app
docker-compose logs db

# Test với PostgreSQL
curl http://localhost:3000/api/todos

# Stop
docker-compose down
```

### Phần 6: CD - Deployment & Rollback (15 phút)

#### Xem Deploy workflow
```bash
cat .github/workflows/deploy.yml
```

#### Demo: Build & Push Image
👉 **Show trên GitHub**:
1. Vào tab "Actions"
2. Xem deploy workflow (chạy khi push vào main)
3. Workflow build Docker image
4. Push lên GitHub Container Registry (ghcr.io)

#### Xem image trên ghcr.io
👉 **Show trên GitHub**:
1. Vào tab "Packages"
2. Xem image vừa build
3. Xem các tags: `main`, `main-abc1234`, `latest`

#### Giải thích CD concept
👉 **Workflow**:
1. Developer push code
2. CI chạy tests ✅
3. CI pass → CD tự động deploy
4. Build Docker image
5. Push lên registry
6. Deploy lên server (VPS/Cloud)

#### Deploy options (show code trong workflow)
```yaml
# Option 1: Deploy to VPS via SSH
# Option 2: Deploy to Render/Railway
# Option 3: Deploy to Kubernetes
```

#### Demo: Rollback
```bash
# Xem các images/tags có sẵn
# Trên server:
docker-compose pull
docker-compose up -d

# Rollback về version cũ:
# 1. Đổi tag trong docker-compose.yml
# 2. Hoặc: docker pull ghcr.io/username/repo:old-sha
# 3. docker-compose up -d
```

#### GitHub Secrets cho deployment
👉 **Show trên GitHub Settings**:
1. Settings → Secrets and variables → Actions
2. Thêm secrets: `SSH_PRIVATE_KEY`, `SSH_HOST`, `DEPLOY_HOOK_URL`
3. Secrets KHÔNG hiển thị trong logs
4. Dùng trong workflow: `${{ secrets.SSH_HOST }}`

#### GitHub Environments
👉 **Optional**: Settings → Environments
- Tạo environment: `production`, `staging`
- Thêm protection rules
- Required reviewers
- Secrets per environment

### Phần 7: Checklist & Best Practices (5 phút)

#### ✅ Git Best Practices
- [ ] Commit thường xuyên với message rõ ràng
- [ ] Viết commit message theo convention (feat:, fix:, docs:)
- [ ] Pull trước khi push
- [ ] Dùng branch cho mỗi feature
- [ ] KHÔNG commit secrets
- [ ] Review code trước khi merge
- [ ] Squash commits nếu cần

#### ✅ GitHub Best Practices
- [ ] Viết README tốt
- [ ] Thêm .gitignore ngay từ đầu
- [ ] Dùng Pull Requests thay vì push thẳng vào main
- [ ] Enable branch protection cho main
- [ ] Require PR reviews
- [ ] Require CI pass trước khi merge
- [ ] Dùng GitHub Issues để track bugs/features

#### ✅ CI/CD Best Practices
- [ ] Test tự động trên mọi PR
- [ ] Lint code style
- [ ] Build trước khi deploy
- [ ] Deploy tự động vào staging
- [ ] Deploy manual vào production (với approval)
- [ ] Monitor deployment status
- [ ] Có kế hoạch rollback

## 🔧 Setup Instructions cho Presenter

### 1. Chuẩn bị trước video

#### Fork/Clone repository
```bash
git clone https://github.com/YOUR_USERNAME/vibe-coder-github.git
cd vibe-coder-github
npm install
```

#### Test tất cả
```bash
npm test
npm run lint
npm start  # Test http://localhost:3000
docker-compose up -d  # Test Docker
docker-compose down
```

#### Verify GitHub Actions
- Push code lên GitHub
- Kiểm tra CI/CD đều chạy và pass ✅

### 2. Configure GitHub Package (ghcr.io)

#### Enable package visibility
1. Sau khi deploy workflow chạy lần đầu
2. Vào Packages → chọn package vừa tạo
3. Package settings → Change visibility → Public (để demo dễ)

#### Không cần thêm secrets
- `GITHUB_TOKEN` được provide tự động bởi GitHub Actions
- Có quyền `packages: write` trong workflow

### 3. Optional: Branch Protection (Demo cuối video)

Settings → Branches → Add rule for `main`:
- ✅ Require pull request before merging
- ✅ Require status checks (CI)
- ✅ Require conversation resolution
- ✅ Do not allow bypassing the above settings

### 4. Optional: Setup thật cho Deploy step

#### Nếu deploy lên VPS via SSH:
1. Generate SSH key: `ssh-keygen -t ed25519`
2. Add public key vào server: `~/.ssh/authorized_keys`
3. Add secrets vào GitHub:
   - `SSH_PRIVATE_KEY`: private key content
   - `SSH_HOST`: server IP
   - `SSH_USER`: username
4. Uncomment SSH deploy step trong `.github/workflows/deploy.yml`
5. Đổi `if: false` thành `if: true`

#### Nếu deploy lên Render/Railway:
1. Lấy deploy hook URL từ platform
2. Add secret `RENDER_DEPLOY_HOOK`
3. Uncomment webhook deploy step

## 📚 Tài liệu tham khảo

- [Git Cheat Sheet](./docs/git-cheat-sheet.md) - Tài liệu tra cứu nhanh
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Express.js Guide](https://expressjs.com/)

## 🎓 Học thêm

### Git & GitHub
- [Learn Git Branching](https://learngitbranching.js.org/) - Interactive tutorial
- [GitHub Skills](https://skills.github.com/) - Hands-on courses
- [Oh Shit, Git!?!](https://ohshitgit.com/) - Fix Git mistakes

### CI/CD
- [GitHub Actions Quickstart](https://docs.github.com/en/actions/quickstart)
- [Docker Curriculum](https://docker-curriculum.com/)

## 🤝 Contributing

Nếu bạn muốn improve repository này:
1. Fork repository
2. Tạo branch: `git checkout -b feature/improvement`
3. Commit: `git commit -m "feat: add something"`
4. Push: `git push origin feature/improvement`
5. Tạo Pull Request

## 📝 License

MIT License - Tự do sử dụng cho mục đích học tập

---

**Made with ❤️ by Quân IT**

📺 Xem video đầy đủ tại: [Link YouTube]

💬 Có câu hỏi? Comment trong video hoặc tạo GitHub Issue!

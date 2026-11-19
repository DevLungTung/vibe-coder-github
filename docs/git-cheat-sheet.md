# Git Cheat Sheet - Tài liệu tra cứu nhanh

## 📚 Các lệnh Git cơ bản

### Cấu hình ban đầu
```bash
# Thiết lập tên và email
git config --global user.name "Tên của bạn"
git config --global user.email "email@example.com"

# Kiểm tra cấu hình
git config --list
```

### Khởi tạo repository
```bash
# Tạo repo mới
git init

# Clone repo có sẵn
git clone https://github.com/username/repo.git
```

### Làm việc với commits
```bash
# Kiểm tra trạng thái
git status

# Thêm file vào staging
git add file.js              # Thêm 1 file
git add .                    # Thêm tất cả file
git add *.js                 # Thêm tất cả file .js

# Commit thay đổi
git commit -m "Mô tả ngắn gọn"
git commit -am "Add và commit cùng lúc"  # Chỉ với file đã tracked

# Xem lịch sử commit
git log
git log --oneline            # Hiển thị gọn
git log --graph --oneline    # Hiển thị dạng graph
git log -3                   # 3 commit gần nhất

# Xem chi tiết 1 commit
git show abc1234
```

### Xem thay đổi
```bash
# Xem thay đổi chưa stage
git diff

# Xem thay đổi đã stage
git diff --staged

# Xem thay đổi của 1 file
git diff file.js

# So sánh 2 commit
git diff commit1 commit2
```

### Hoàn tác thay đổi
```bash
# Bỏ file ra khỏi staging
git restore --staged file.js
# hoặc (cách cũ)
git reset HEAD file.js

# Hủy thay đổi trong working directory
git restore file.js
# hoặc (cách cũ)
git checkout -- file.js

# Revert 1 commit (tạo commit mới đảo ngược)
git revert abc1234

# Reset về commit cũ (NGUY HIỂM - mất code!)
git reset --hard abc1234
```

## 🌿 Làm việc với branches

### Quản lý branch
```bash
# Xem danh sách branch
git branch                   # Local branches
git branch -a                # Tất cả branches (local + remote)

# Tạo branch mới
git branch feature-name

# Chuyển branch
git checkout feature-name
# hoặc (cách mới)
git switch feature-name

# Tạo và chuyển branch (shortcut)
git checkout -b feature-name
# hoặc
git switch -c feature-name

# Xóa branch
git branch -d feature-name   # Xóa nếu đã merge
git branch -D feature-name   # Xóa cưỡng chế
```

### Merge và rebase
```bash
# Merge branch khác vào branch hiện tại
git merge feature-name

# Rebase branch hiện tại lên branch khác
git rebase main

# Hủy merge/rebase đang xung đột
git merge --abort
git rebase --abort
```

## 🌐 Làm việc với GitHub (remote)

### Remote repository
```bash
# Xem remote
git remote -v

# Thêm remote
git remote add origin https://github.com/username/repo.git

# Đổi URL remote
git remote set-url origin https://github.com/username/new-repo.git
```

### Push và Pull
```bash
# Push lên GitHub
git push origin main         # Push branch main
git push origin feature      # Push branch feature
git push -u origin main      # Push và set upstream

# Pull từ GitHub
git pull origin main         # Pull branch main
git pull                     # Pull branch hiện tại

# Fetch (download không merge)
git fetch origin
```

### Tags
```bash
# Tạo tag
git tag v1.0.0
git tag -a v1.0.0 -m "Version 1.0.0"

# Push tags
git push origin v1.0.0       # Push 1 tag
git push origin --tags       # Push tất cả tags

# Xem tags
git tag
git tag -l "v1.*"
```

## 🔥 Xử lý xung đột (Merge Conflicts)

```bash
# Khi có conflict:
# 1. Mở file có conflict
# 2. Tìm các dòng:
#    <<<<<<< HEAD
#    Code của bạn
#    =======
#    Code từ branch khác
#    >>>>>>> branch-name

# 3. Chỉnh sửa, giữ code đúng
# 4. Xóa các dòng <<<, ===, >>>
# 5. Add và commit
git add .
git commit -m "Resolve merge conflict"
```

## 🗑️ Xử lý .gitignore

```bash
# Nếu đã commit file nhầm:
git rm --cached file.txt     # Xóa khỏi Git, giữ file local
git rm -r --cached folder/   # Xóa folder
git commit -m "Remove ignored files"
```

## 🚨 Các tình huống thường gặp

### Sửa commit message vừa tạo
```bash
git commit --amend -m "Message mới"
```

### Thêm file vào commit vừa tạo
```bash
git add forgotten-file.js
git commit --amend --no-edit
```

### Làm sạch working directory
```bash
git stash                    # Cất thay đổi tạm
git stash pop                # Lấy lại thay đổi
git stash list               # Xem danh sách stash
git stash drop               # Xóa stash
```

### Xem ai sửa dòng code nào
```bash
git blame file.js
git blame -L 10,20 file.js   # Chỉ từ dòng 10-20
```

## 🎯 Best Practices

1. **Commit thường xuyên** với message rõ ràng
2. **Pull trước khi push** để tránh conflict
3. **Dùng branch** cho mỗi feature/bugfix
4. **Không commit secrets** (.env, API keys, passwords)
5. **Viết .gitignore** ngay từ đầu
6. **Review code** trước khi merge
7. **Dùng Pull Requests** thay vì push trực tiếp vào main
8. **Test kỹ** trước khi merge vào main

## 📖 Tài liệu tham khảo

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Interactive Git Tutorial](https://learngitbranching.js.org/)
- [Oh Shit, Git!?!](https://ohshitgit.com/) - Giải quyết lỗi Git

---

**Lưu ý**: Một số lệnh có nhiều cách viết (cũ và mới). Chọn cách nào bạn thích!

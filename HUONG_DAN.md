# Hướng Dẫn Sử Dụng Nhanh 🚀

## Cách 1: Mở Trực Tiếp (Đơn giản nhất)

1. Tải toàn bộ dự án về máy
2. Mở file `index.html` bằng trình duyệt web (Chrome, Firefox, Edge, Safari)
3. Bắt đầu sử dụng ngay!

## Cách 2: Chạy Với Web Server (Khuyến nghị)

### Sử dụng Python (Đã cài sẵn trên hầu hết máy)

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Sau đó mở trình duyệt và truy cập: `http://localhost:8000`

### Sử dụng Node.js

```bash
# Cài http-server (một lần duy nhất)
npm install -g http-server

# Chạy server
http-server
```

### Sử dụng PHP

```bash
php -S localhost:8000
```

## Triển Khai Lên Web

### GitHub Pages (Miễn phí)

1. Đẩy code lên GitHub repository
2. Vào Settings → Pages
3. Chọn branch để deploy
4. Website sẽ có địa chỉ: `https://username.github.io/repository-name`

### Netlify (Miễn phí)

1. Tạo tài khoản tại netlify.com
2. Kéo thả thư mục dự án vào Netlify
3. Website sẽ được deploy tự động

### Vercel (Miễn phí)

1. Tạo tài khoản tại vercel.com
2. Import repository từ GitHub
3. Deploy tự động

## Tùy Chỉnh

### Thay đổi màu sắc

Mở file `css/style.css`, tìm phần `:root` và thay đổi các giá trị màu:

```css
:root {
    --primary-color: #FF6B6B;    /* Màu chính */
    --secondary-color: #4ECDC4;  /* Màu phụ */
    --accent-color: #FFE66D;     /* Màu nhấn */
    /* ... */
}
```

### Thêm bài học mới

1. **Toán học**: Mở `js/math.js`, thêm câu hỏi vào hàm `generate...Question()`
2. **Tiếng Việt**: Mở `js/vietnamese.js`, thêm từ vào mảng `vocabularyWords`
3. **Trò chơi**: Mở `js/games.js`, tạo hàm game mới

## Yêu Cầu Hệ Thống

- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Không cần cài đặt gì thêm
- Hoạt động offline sau khi tải lần đầu

## Khắc Phục Sự Cố

**Vấn đề**: Trang web không hiển thị đúng
- **Giải pháp**: Xóa cache trình duyệt (Ctrl+Shift+Delete)

**Vấn đề**: Tiến độ không được lưu
- **Giải pháp**: Kiểm tra LocalStorage không bị chặn trong cài đặt trình duyệt

**Vấn đề**: Hiệu ứng không hoạt động
- **Giải pháp**: Sử dụng trình duyệt mới hơn hoặc bật JavaScript

## Hỗ Trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra console trong Developer Tools (F12)
2. Đảm bảo tất cả file đều có trong thư mục đúng
3. Thử trình duyệt khác

## Tính Năng Sắp Có

- 🎨 Module vẽ tranh
- 🔊 Phát âm cho từ vựng
- 📊 Bảng xếp hạng
- 👥 Chế độ nhiều người chơi
- 🏅 Hệ thống huy hiệu

---

Chúc các bé học tập vui vẻ! 🌈

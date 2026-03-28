# 🛒 E-Commerce Backend (NestJS)

A full-featured **E-commerce backend** built with **NestJS**, supporting authentication, product management, cart, orders, and coupon system.

---

## 🚀 Features

- 🔐 JWT Authentication & Authorization
- 👥 Role-based Access Control (Admin / User)
- 🛍️ Products & Variants (color, size, stock)
- 🛒 Shopping Cart system
- 📦 Orders & Order Items (snapshot-based)
- 🎟️ Coupon system (percentage & free delivery)
- 📊 Scalable & clean architecture

---

## 🧱 Tech Stack

- **Backend:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Auth:** JWT
- **Validation:** class-validator
- **File Upload:** Cloudinary

---

## 📁 Project Structure

```
src/
│
├── auth/
├── user/
├── config/
├── category/
├── cloudinary/
├── dashboard/
├── products/
├── cart/
├── order/
├── coupons/
│
├── utils/
│   ├── pagination/
│
│── app.module.ts
└── main.ts
```

---

## 🔐 Authentication & Authorization

- All routes are **protected by default**
- Public routes using `@Public()`
- Role-based access using `@Roles('admin')`
- JWT used for authentication

---

## 🛒 Cart Flow

1. Add product variant to cart
2. Update quantity
3. Remove item
4. Get user cart

---

## 📦 Checkout Flow

1. Get user cart
2. Validate stock availability
3. Create Order
4. Create OrderItems (snapshot)
5. Apply coupon (if provided)
6. Update stock
7. Clear cart

---

## 🎟️ Coupon System

Supports:

- Percentage discount
- Free delivery

Tracks:

- Usage count
- Total used amount
- Total discount given

---

## 🧪 Environment Variables

Create a `.env` file in the root directory:

---

### 🗄️ Database

```env
DATABASE_PORT=
DATABASE_TYPE=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_HOST=
DATABASE_NAME=
DATABASE_AUTO_LOAD_ENTITIES=
DATABASE_SYNCHRONIZE=
```

---

### ☁️ Cloudinary

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_URL=
```

---

### 🔐 JWT

```env
JWT_SECRET=
JWT_TOKEN_AUDIENCE=
JWT_TOKEN_ISSUER=
JWT_ACCESS_TOKEN_TTL=
```

---

### ⚙️ App Config

```env
SHIPPING_PRICE=
BEST_SELLER_NUMBER=
NEW_ARRIVALS_DAYS=
NEW_ARRIVALS_LIMIT=
```

# Email configuration for sending verification and notification emails

```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

---

### ✅ Example `.env`

```env
DATABASE_TYPE=postgres
DATABASE_PORT=5432
DATABASE_HOST=localhost
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=123456
DATABASE_NAME=ecommerce

JWT_SECRET=supersecret
JWT_ACCESS_TOKEN_TTL=1d

SHIPPING_PRICE=50
BEST_SELLER_NUMBER=10
NEW_ARRIVALS_DAYS=7
NEW_ARRIVALS_LIMIT=8


EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/project-name.git
cd project-name
npm install
```

---

## ▶️ Running the App

```bash
npm run start:dev
```

---

## 🧠 Important Concepts

- Orders store **snapshot data** (price, size, color)
- Never trust client-side price
- Always validate stock before checkout
- Use transactions in checkout process

---

## 🔮 Future Improvements

- 📦 Order tracking system
- 🖥️ Admin dashboard
- ⭐ Product reviews & ratings

---

## 👨‍💻 Author

**Osama Shaker**

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

---

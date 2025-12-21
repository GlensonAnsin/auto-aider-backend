# AutoAIDER Backend Documentation

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Running the Server](#running-the-server)
- [Socket.io Events](#socketio-events)
- [Utilities](#utilities)

---

## 🚀 Project Overview

**AutoAIDER** is a comprehensive backend system that facilitates communication and service requests between car owners and auto repair shops. The platform enables:

- **Car Owners** to register vehicles, perform diagnostics, request repairs, chat with repair shops, and rate services
- **Repair Shops** to manage service requests, communicate with car owners, and track availability
- **Admins** to manage users, repair shops, and system metrics
- **Real-time notifications** for service updates, messages, and PMS reminders

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Node.js & Express.js** | Web framework |
| **PostgreSQL (Neon)** | Database |
| **Sequelize** | ORM for database operations |
| **Socket.io** | Real-time communication |
| **JWT (JSON Web Tokens)** | Authentication & Authorization |
| **Cloudinary** | Image/file storage and management |
| **Expo** | Push notifications |
| **Nodemailer** | Email services (via Zoho SMTP) |
| **Semaphore** | SMS/OTP delivery |
| **Day.js** | Date/time manipulation |
| **Node-cron** | Job scheduling (PMS reminders) |
| **CORS** | Cross-origin resource sharing |

---

## 📁 Project Structure

```
auto-aider-backend/
├── src/
│   ├── config/
│   │   └── postgresDB.js           # PostgreSQL connection configuration
│   │
│   ├── controllers/
│   │   ├── autoRepairShopController.js      # Repair shop business logic
│   │   ├── chatMessageController.js         # Chat/messaging logic
│   │   ├── cloudinaryController.js          # Image upload/deletion
│   │   ├── generateOtpController.js         # OTP generation (SMS/Email)
│   │   ├── mechanicRequestController.js     # Service request handling
│   │   ├── notificationController.js        # Notification management
│   │   ├── savePushTokenController.js       # Push token storage
│   │   ├── userController.js                # Car owner & admin logic
│   │   └── vehicleController.js             # Vehicle management
│   │   └── vehicleDiagnosticController.js   # Diagnostic scans
│   │
│   ├── models/
│   │   ├── autoRepairShopModel.js      # AutoRepairShop schema
│   │   ├── chatMessageModel.js         # ChatMessage schema
│   │   ├── mechanicRequestModel.js     # MechanicRequest schema
│   │   ├── notificationModel.js        # Notification schema
│   │   ├── savePushTokenModel.js       # SavePushToken schema
│   │   ├── userModel.js                # User schema
│   │   ├── vehicleModel.js             # Vehicle schema
│   │   ├── vehicleDiagnosticModel.js   # VehicleDiagnostic schema
│   │   └── index.js                    # Model associations & relationships
│   │
│   ├── routes/
│   │   ├── autoRepairShopRoutes.js     # /api/auto_repair_shop/*
│   │   ├── chatMessageRoutes.js        # /api/messages/*
│   │   ├── cloudinaryRoutes.js         # /api/cloudinary/*
│   │   ├── generateOtpRoutes.js        # /api/authentication/*
│   │   ├── mechanicRequestRoutes.js    # /api/mechanic_request/*
│   │   ├── notificationRoutes.js       # /api/notifications/*
│   │   ├── savePushTokenRoutes.js      # /api/notifications/save-push-token
│   │   ├── userRoutes.js               # /api/user/*
│   │   ├── vehicleRoutes.js            # /api/vehicle/*
│   │   └── vehicleDiagnosticRoutes.js  # /api/vehicle_diagnostic/*
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js           # JWT token verification
│   │
│   └── utils/
│       ├── onlineUsers.js             # Track online users & shops
│       ├── pms.js                     # PMS scheduler (preventive maintenance)
│       └── pushNotif.js               # Expo push notification service
│
├── public/                            # Static files
├── views/                             # View templates
├── server.js                          # Main server entry point
├── package.json                       # Dependencies & scripts
└── .env                              # Environment variables
```

---

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (Neon or self-hosted)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auto-aider-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env` file and update with your credentials (see [Environment Variables](#environment-variables))

4. **Start the server**
   ```bash
   npm start
   ```
   Server will run on `http://localhost:3000` (or configured PORT)

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000

# PostgreSQL Database (Neon)
PGHOST='your-neon-host'
PGDATABASE='your-database-name'
PGUSER='your-database-user'
PGPASSWORD='your-database-password'

# JWT Authentication Tokens
ACCESS_TOKEN='your-secret-access-token-key'
REFRESH_TOKEN='your-secret-refresh-token-key'

# Cloudinary Image Management
CLOUDINARY_CLOUD_NAME='your-cloud-name'
CLOUDINARY_API_KEY='your-api-key'
CLOUDINARY_API_SECRET='your-api-secret'

# Email Service (Zoho SMTP)
ZOHO_APP_PASS='your-zoho-app-specific-password'

# SMS Service (Semaphore)
SEMAPHORE_API_KEY='your-semaphore-api-key'
```

**Security Note:** Never commit `.env` file with real credentials to version control.

---

## 🗄️ Database Schema

### Models and Relationships

#### **User** (Car Owner)
- Primary fields: `user_id`, `firstname`, `lastname`, `email`, `mobile_num`, `password`
- Settings: `settings_map_type`, `settings_push_notif`
- Relationships: One-to-Many with Vehicle, ChatMessage, SavePushToken, Notification

#### **AutoRepairShop** (Repair Shop Owner)
- Primary fields: `repair_shop_id`, `owner_firstname`, `owner_lastname`, `shop_name`, `email`, `mobile_num`, `password`
- Services: `services_offered` (array), `longitude`, `latitude`
- Ratings: `average_rating`, `total_score`, `number_of_ratings`
- Status: `approval_status`, `availability`
- Relationships: One-to-Many with MechanicRequest, ChatMessage

#### **Vehicle**
- Primary fields: `vehicle_id`, `user_id`, `make`, `model`, `year`
- Maintenance: `last_pms_trigger`
- Relationships: One-to-Many with VehicleDiagnostic; Many-to-One with User

#### **VehicleDiagnostic**
- Captures OBD-II scan data
- Fields: `dtc`, `technical_description`, `meaning`, `possible_causes`, `recommended_repair`
- Relationships: One-to-Many with MechanicRequest; Many-to-One with Vehicle

#### **MechanicRequest**
- Links car owners to repair shops for specific issues
- Fields: `status`, `repair_procedure`, `completed_on`, `reason_rejected`
- Location: `longitude`, `latitude`
- Rating: `is_rated`, `score`
- Relationships: Many-to-One with VehicleDiagnostic and AutoRepairShop

#### **ChatMessage**
- Real-time messaging between users and repair shops
- Fields: `message`, `sent_at`, `status`
- Supports both directions: User↔RepairShop

#### **Notification**
- Stores in-app notifications
- Can belong to: User OR RepairShop (not both)
- Status: `is_read`

#### **SavePushToken**
- Stores device push notification tokens
- Unique per user/repair_shop and platform
- Platforms: iOS, Android, web

### Entity Relationship Diagram (Simplified)
```
User (1) ──→ (M) Vehicle
User (1) ──→ (M) Notification
User (1) ──→ (M) SavePushToken
User (1) ──→ (M) ChatMessage (as sender)
User (1) ──→ (M) ChatMessage (as receiver)

Vehicle (1) ──→ (M) VehicleDiagnostic
VehicleDiagnostic (1) ──→ (M) MechanicRequest

AutoRepairShop (1) ──→ (M) MechanicRequest
AutoRepairShop (1) ──→ (M) ChatMessage

MechanicRequest ──→ VehicleDiagnostic
MechanicRequest ──→ AutoRepairShop
```

---

## 📡 API Endpoints

### **User Management** (`/api/user/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | ❌ | Register new car owner |
| POST | `/login` | ❌ | Login car owner |
| POST | `/login-admin` | ❌ | Login as admin |
| GET | `/get-all` | ❌ | Get all car owners |
| GET | `/get-user-info` | ✅ | Get current user info |
| GET | `/get-admin-info` | ✅ | Get admin info |
| PATCH | `/update-user-info` | ✅ | Update user profile |
| PATCH | `/change-password` | ✅ | Change user password |
| GET | `/get-user-info-chat/:user_id` | ✅ | Get user info for chat |
| POST | `/refresh-token` | ❌ | Refresh JWT token |
| POST | `/check-existence-co` | ❌ | Check email/mobile exists |
| PATCH | `/reset-pass-co` | ❌ | Reset password via OTP |
| POST | `/update-map-type` | ✅ | Update map preference |
| POST | `/update-push-notif` | ✅ | Toggle push notifications |
| GET | `/delete-account` | ✅ | Delete user account |
| GET | `/count-all-co` | ✅ | Count all car owners (Admin) |
| GET | `/newly-registered-co` | ✅ | New registrations last 12 months |

### **Repair Shop Management** (`/api/auto_repair_shop/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | ❌ | Register new repair shop |
| POST | `/login` | ❌ | Login repair shop |
| GET | `/get-all` | ❌ | Get all approved repair shops |
| GET | `/get-all-admin` | ❌ | Get all shops (admin view) |
| GET | `/get-all-unapproved-shops` | ✅ | Get unapproved shops |
| GET | `/get-repair-shop-info` | ✅ | Get current shop info |
| GET | `/get-unapproved-shop-info/:shop_id` | ✅ | Get unapproved shop details |
| PATCH | `/update-repair-shop-info` | ✅ | Update shop profile |
| GET | `/get-shop-info-chat/:repair_shop_id` | ✅ | Get shop info for chat |
| PATCH | `/update-ratings` | ✅ | Update shop rating |
| PATCH | `/update-availability` | ✅ | Update availability status |
| PATCH | `/update-approval-status` | ✅ | Approve/reject shop (Admin) |
| POST | `/check-existence-rs` | ❌ | Check email/mobile exists |
| PATCH | `/reset-pass-rs` | ❌ | Reset password via OTP |
| POST | `/update-map-type` | ✅ | Update map preference |
| POST | `/update-push-notif` | ✅ | Toggle push notifications |
| GET | `/delete-account` | ✅ | Delete shop account |
| GET | `/count-all-rs` | ✅ | Count all repair shops (Admin) |
| GET | `/newly-registered-rs` | ✅ | New registrations last 12 months |

### **Vehicle Management** (`/api/vehicle/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/add-vehicle` | ✅ | Add new vehicle |
| GET | `/get-vehicles` | ✅ | Get user's vehicles |
| GET | `/get-scanned-vehicle/:vehicle_id` | ✅ | Get specific vehicle details |
| PATCH | `/dismiss-pms` | ✅ | Dismiss PMS reminder |
| PATCH | `/delete-vehicle` | ✅ | Soft delete vehicle |

### **Vehicle Diagnostics** (`/api/vehicle_diagnostic/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/add-vehicle-diagnostic` | ✅ | Create diagnostic scan |
| GET | `/get-vehicle-diagnostics` | ✅ | Get all user diagnostics |
| GET | `/get-on-vehicle-diagnostic-co/:vehicle_id/:scan_reference` | ✅ | Get diagnostic for car owner |
| GET | `/get-on-vehicle-diagnostic-rs/:vehicle_id/:scan_reference` | ✅ | Get diagnostic for repair shop |
| GET | `/get-on-spec-vehicle-diagnostic/:vehicle_diagnostic_id` | ✅ | Get specific diagnostic |
| PATCH | `/delete-vehicle-diagnostic` | ✅ | Delete single diagnostic |
| PATCH | `/delete-all-vehicle-diagnostics` | ✅ | Delete all diagnostics |
| GET | `/count-scans-today` | ✅ | Count scans (Admin) |
| GET | `/get-recent-scans-co/:vehicle_id` | ✅ | Get recent scans (Car owner) |
| GET | `/get-recent-scans-rs/:vehicle_id` | ✅ | Get recent scans (Repair shop) |

### **Mechanic Requests** (`/api/mechanic_request/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/add-request` | ✅ | Create service request |
| GET | `/get-requests-co` | ✅ | Get car owner's requests |
| GET | `/get-requests-rs` | ✅ | Get repair shop's requests |
| PATCH | `/reject-request` | ✅ | Reject service request |
| PATCH | `/accept-request` | ✅ | Accept service request |
| PATCH | `/request-completed` | ✅ | Mark request as completed |

### **Chat & Messaging** (`/api/messages/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/get-conversation-co/:repair_shop_id` | ✅ | Get chat with shop (Car owner) |
| GET | `/get-conversation-rs/:user_id` | ✅ | Get chat with user (Repair shop) |
| GET | `/get-all-chats-co` | ✅ | Get all chats (Car owner) |
| GET | `/get-all-chats-rs` | ✅ | Get all chats (Repair shop) |
| GET | `/count-unread-chats-co` | ✅ | Count unread messages |
| GET | `/count-unread-chats-rs` | ✅ | Count unread messages |
| POST | `/send-message` | ❌ | Send message (via Socket.io preferred) |
| PATCH | `/update-message-status` | ❌ | Mark messages as read |

### **Notifications** (`/api/notifications/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/get-notifications-co` | ✅ | Get car owner notifications |
| GET | `/get-notifications-rs` | ✅ | Get repair shop notifications |
| GET | `/count-unread-notifs-co` | ✅ | Count unread notifications |
| GET | `/count-unread-notifs-rs` | ✅ | Count unread notifications |
| PATCH | `/update-notification-co` | ✅ | Mark notification as read |
| PATCH | `/update-notification-rs` | ✅ | Mark notification as read |
| DELETE | `/delete-notification-co` | ✅ | Delete notification |
| DELETE | `/delete-notification-rs` | ✅ | Delete notification |
| POST | `/save-push-token` | ❌ | Save device push token |

### **Authentication** (`/api/authentication/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/generate-otp` | ❌ | Generate OTP via SMS or Email |

### **Cloudinary** (`/api/cloudinary/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/generate-signature` | ❌ | Get upload signature (Profile pics) |
| POST | `/generate-signature-shop-images` | ❌ | Get upload signature (Shop images) |
| POST | `/delete-image` | ❌ | Delete image from Cloudinary |

---

## ✨ Features

### 🚗 Vehicle Management
- Add and manage multiple vehicles
- Track vehicle make, model, year
- Soft delete with is_deleted flag
- Last PMS maintenance tracking

### 🔍 Vehicle Diagnostics
- OBD-II diagnostic scan storage
- DTC (Diagnostic Trouble Code) tracking
- Technical descriptions and recommended repairs
- Scan reference for tracking
- Multiple scans per vehicle

### 🔧 Service Requests (Mechanic Requests)
- Create requests from diagnostic scans
- Request status tracking: pending, accepted, rejected, completed
- Repair shop assignment with location tracking
- Service type and request type categorization
- Rating system after completion

### 💬 Real-Time Chat
- Direct messaging between car owners and repair shops
- Message status tracking: sent, delivered, read
- Unread message counts
- Conversation history

### 🔔 Notifications
- In-app notifications for all actions
- Push notifications via Expo
- Read/unread status tracking
- PMS reminder notifications (scheduled)
- Different notification types for different actions

### 📱 Push Notifications
- Device token management
- Multi-platform support (iOS, Android, Web)
- Automatic token expiration handling
- Silent background notifications

### ⏰ Preventive Maintenance System (PMS)
- Automatic PMS reminders every 3 months
- Cron job scheduler running daily at 9 AM
- Email/push notifications for reminders
- Dismissible reminders

### 🏪 Auto Repair Shop Features
- Shop profile with services offered
- Location-based with latitude/longitude
- Availability status (online/offline/busy)
- Rating and review system
- Shop approval workflow (pending/approved)
- Admin approval management

### 🔐 Authentication & Security
- JWT-based authentication
- Separate tokens for car owners, repair shops, and admins
- Access token & refresh token pattern
- Password hashing and reset via OTP
- Email/SMS based OTP verification

### ☁️ Image Management
- Profile picture uploads via Cloudinary
- Shop images/gallery management
- Secure signed URLs
- Image deletion capability
- Folder-based organization

### 👤 User Roles
- **Car Owner**: Browse shops, request services, chat, rate
- **Repair Shop**: Manage requests, communicate, track availability
- **Admin**: Manage users, approve shops, view analytics

### 📊 Analytics (Admin)
- Count total car owners and repair shops
- Track newly registered users (12-month period)
- View total vehicle scans
- Monitor service metrics

---

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### With Logging
The server logs important events:
- User connections/disconnections
- Socket.io events
- Database operations
- API requests
- Errors and exceptions

---

## 🔌 Socket.io Events

Socket.io enables real-time communication. The server manages:

### Connection Events
```javascript
socket.on('connection') // User connects to socket
socket.on('registerUser', { userID, role }) // Register online user
socket.on('disconnect') // User disconnects
```

### Chat Events
```javascript
socket.on('sendMessage', { senderID, receiverID, role, message, sentAt })
socket.on('updateStatus', { chatIDs, status })
socket.on('checkOnlineStatus', { ID, role })
```

### Broadcasting
```javascript
io.emit(`newNotif-CO-${user_id}`, { newNotif }) // Car owner notification
io.emit(`newUnreadNotif-CO-${user_id}`, { unreadNotifs }) // Unread count
```

---

## 🛠 Utilities

### **onlineUsers.js**
- Maintains arrays: `onlineUsers` and `onlineShops`
- Tracks currently connected users in real-time
- Used for online status checks

### **pushNotif.js**
- Expo push notification service integration
- Handles message chunking (max 100 messages per request)
- Batch receipt ID retrieval
- Error handling and logging
- Supports custom data payloads

### **pms.js**
- Node-cron scheduler running daily at 9 AM
- Checks vehicle maintenance schedules
- Sends notifications and push alerts to users
- Marks vehicles with overdue maintenance
- Integrates with Socket.io for real-time updates

---

## 📝 Request/Response Examples

### User Login
```json
// Request
POST /api/user/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "token": "jwt_token_here",
  "user": {
    "user_id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "email": "user@example.com"
  }
}
```

### Add Vehicle
```json
// Request
POST /api/vehicle/add-vehicle
Authorization: Bearer jwt_token
{
  "make": "Toyota",
  "model": "Camry",
  "year": "2020",
  "date_added": "2025-12-21",
  "last_pms_trigger": "2025-12-21"
}

// Response
{
  "message": "Vehicle added successfully",
  "vehicle": { /* vehicle object */ }
}
```

### Create Service Request
```json
// Request
POST /api/mechanic_request/add-request
Authorization: Bearer jwt_token
{
  "vehicle_diagnostic_id": 5,
  "repair_shop_id": 3,
  "service_type": "regular",
  "request_type": "diagnosis_based"
}

// Response
{
  "message": "Request created successfully",
  "request_id": 10
}
```

---

## 🐛 Error Handling

The API returns standardized error responses:

```json
{
  "error": "Error message describing what went wrong",
  "status": 400 // or 500, 401, 403, etc.
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

---

## 🔄 Authentication Flow

1. User signs up or logs in
2. Server returns JWT access token and refresh token
3. Client sends access token in `Authorization: Bearer <token>` header
4. `authMiddleware` verifies token validity
5. If expired, client uses refresh token to get new access token
6. Protected routes require valid authentication

---

## 📞 Support & Contact

For issues, questions, or feature requests:
- Review API endpoints documentation above
- Check error messages in server logs
- Verify all required environment variables are set
- Ensure database connectivity and proper schema

---

## 📄 License

[Add your license information here]

---

**Last Updated:** December 21, 2025  
**Version:** 1.0.0

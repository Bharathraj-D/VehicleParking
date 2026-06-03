# SmartParking - Full Stack Application

Production-ready parking management system with Spring Boot 3 backend and React Vite frontend.

## Architecture

**Frontend**: React 18 + Vite + Bootstrap 5 + React Router
**Backend**: Spring Boot 3 + Java 21 + Spring Security + JWT
**Database**: MySQL 8.0+

## Project Structure

```
smartparking/
├── src/                          # React Frontend (Vite)
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Sidebar.jsx
│   ├── context/
│   │   └── AuthContext.jsx      # Auth state & JWT management
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ParkingSlots.jsx
│   │   ├── ParkVehicle.jsx
│   │   ├── RemoveVehicle.jsx
│   │   └── VehicleSearch.jsx
│   ├── lib/
│   │   └── api.js               # Spring Boot API client
│   ├── utils/
│   │   └── parking.js           # Parking logic (fee calculation)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                # Global styles
├── backend/                      # Spring Boot 3 Backend
│   ├── src/main/java/com/smartparking/
│   │   ├── SmartParkingApplication.java
│   │   ├── config/
│   │   │   └── SecurityConfig.java     # Spring Security + CORS
│   │   ├── controller/
│   │   │   ├── AuthController.java     # Login, Register, Seed Admin
│   │   │   ├── ParkingController.java  # Slots, Stats
│   │   │   └── VehicleController.java  # Park, Remove, Search
│   │   ├── service/
│   │   │   ├── UserService.java
│   │   │   ├── ParkingService.java
│   │   │   └── VehicleService.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── ParkingSlotRepository.java
│   │   │   └── VehicleRepository.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── ParkingSlot.java
│   │   │   └── Vehicle.java
│   │   ├── dto/
│   │   │   ├── AuthRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── UserDto.java
│   │   │   ├── VehicleDto.java
│   │   │   ├── ParkVehicleRequest.java
│   │   │   └── ParkingStatsDto.java
│   │   └── security/
│   │       ├── JwtTokenProvider.java   # JWT token generation/validation
│   │       └── JwtAuthenticationFilter.java
│   ├── src/main/resources/
│   │   └── application.properties      # MySQL, JWT, CORS config
│   └── pom.xml                        # Maven dependencies
├── .env                          # Frontend env vars
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Backend Setup (Spring Boot)

1. **Prerequisites**:
   - Java 21+
   - Maven 3.8+
   - MySQL 8.0+

2. **Database Configuration** (`backend/src/main/resources/application.properties`):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartparking?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
```

3. **Build & Run**:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`

### Frontend Setup (React + Vite)

1. **Install Dependencies**:
```bash
npm install
```

2. **Development Server**:
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

3. **Build for Production**:
```bash
npm run build
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new customer account
- `POST /api/auth/seed-admin` - Create admin account (one-click setup)

### Parking Management

- `GET /api/parking/slots` - List all parking slots
- `GET /api/parking/stats` - Dashboard statistics (total, occupied, available, revenue)
- `POST /api/parking/init` - Initialize parking slots (automatic on first run)

### Vehicle Operations

- `POST /api/vehicles/park` - Park a vehicle (assign slot)
- `POST /api/vehicles/remove` - Remove vehicle (checkout & calculate fee)
- `GET /api/vehicles/active` - List active parked vehicles
- `GET /api/vehicles/search?q=...` - Full-text search across vehicle records
- `GET /api/vehicles/recent?limit=6` - Recent parking records for dashboard

## Features

### Parking Rules
- **Rate**: ₹50 per hour
- **Minimum**: ₹50 (even for < 1 hour)
- **Rounding**: Partial hours rounded up (ceiling)

### Parking Layout
- 4 Sections (A, B, C, D)
- 50 Slots per section
- **Total**: 200 Slots

### User Roles
- **Admin**: Manage system, view stats
- **Customer**: Park vehicles, view history, search

### Dashboard
- Total slots, available, occupied
- Occupancy rate with visual progress
- Today's revenue
- Recent parking activity

### Operations
- **Park**: Register vehicle, select slot, confirm
- **Remove**: Search vehicle, checkout, get receipt with fee
- **Search**: Full-text search (vehicle number, owner, phone, slot)
- **Slots**: Real-time availability grid by section

## Authentication & Security

- **JWT Tokens**: Email-based, 24-hour expiration
- **Spring Security**: Stateless sessions, CORS enabled
- **Password Hashing**: BCrypt
- **Protected Routes**: Frontend redirect + API authorization checks

### Admin Seeding
First-time setup: Click "Initialize Admin Account" button on login page.
- Email: `admin@smartparking.com`
- Password: `Admin@123`

## Database Schema

### users
- id, email, password, fullName, phone, role (ADMIN/CUSTOMER)

### parking_slots
- id, slotNumber (A1-D50), status (AVAILABLE/OCCUPIED)

### vehicles
- id, ownerName, email, phone, vehicleNumber, vehicleType
- slotNumber, entryTime, exitTime, amount, status (ACTIVE/COMPLETED)

## Configuration

### Environment Variables

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:8080/api
```

**Backend** (`backend/src/main/resources/application.properties`):
```
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/smartparking
spring.datasource.username=root
spring.datasource.password=root

# JWT
jwt.secret=smartparking-secret-key-change-in-production
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

## Technologies Used

### Backend
- Spring Boot 3.3.0
- Spring Data JPA
- Spring Security
- JWT (jjwt)
- MySQL Connector
- Lombok
- Maven

### Frontend
- React 18
- Vite 5
- React Router 7
- Bootstrap 5
- React Bootstrap
- React Icons
- Axios

## Development Workflow

1. **Start Backend**: `cd backend && mvn spring-boot:run`
2. **Start Frontend**: `npm run dev`
3. **Access App**: `http://localhost:5173`
4. **Login**: Use admin seed or register new account

## Production Deployment

### Backend
```bash
mvn clean package
java -jar target/smartparking-backend-1.0.0.jar \
  --spring.datasource.url=jdbc:mysql://prod-db:3306/smartparking \
  --spring.datasource.password=<secure-password> \
  --jwt.secret=<secure-random-key>
```

### Frontend
```bash
npm run build
# Serve dist/ folder with any static host (Nginx, Apache, S3+CloudFront, Vercel, etc.)
```

## API Response Format

**Success** (200):
```json
{ "field": "value", ... }
```

**Auth Error** (401):
```json
"Invalid email or password"
```

**Validation Error** (400):
```json
"Error message"
```

**Server Error** (500):
```json
"error": "Stack trace or error message"
```

## Notes

- JWT tokens stored in localStorage (frontend)
- All API calls require Authorization header
- Database auto-creates on first run (MySQL)
- Parking slots auto-seeded (200 slots A1-D50)
- CORS enabled for localhost (configure for production)
- All passwords bcrypt hashed
- Transaction logs visible in vehicle search

## Support

For issues or questions, check:
1. Backend logs: Spring Boot console
2. Frontend console: Browser DevTools
3. Network tab: Check API responses
4. MySQL: Verify connection & schema

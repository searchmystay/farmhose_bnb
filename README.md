# SearchMyStay.com - Farmhouse Listing Platform

## 🏡 Project Overview
A farmhouse listing platform where users can browse farmhouses and connect with owners via WhatsApp. Revenue is generated through a lead-based model where farmhouse owners pay 40 rupees per contact lead.

## 💰 Business Model
- **Revenue Source**: 40 rupees per lead from farmhouse owners
- **Payment Model**: Prepaid credit system for farmhouse owners
- **Lead Generation**: WhatsApp contact integration

## 🔄 Application Flow

### 1. Farmhouse Owner Journey
```
Registration → Document Upload → Admin Approval → Credit Addition → Go Live
```

**Steps:**
1. **Self-Registration**: Owner submits farmhouse listing form
2. **Document Upload**: 
   - Aadhar Card
   - PAN Card
   - Property Documents
3. **Pending Status**: Listing awaits admin approval
4. **Admin Review**: Document verification and farmhouse approval
5. **Credit Management**: Admin adds prepaid credits manually
6. **Live Listing**: Approved farmhouses appear on public site

### 2. User (Customer) Journey
```
Browse → View Details → Contact Owner → Credit Deduction → WhatsApp Redirect
```

**Steps:**
1. **Browse Farmhouses**: View all approved listings
2. **Search/Filter**: By location, amenities, price range
3. **View Details**: Photos, description, location, contact info
4. **Contact Owner**: Click contact button
5. **System Check**: Verify farmhouse has ≥40 rupees credit
6. **Credit Deduction**: Automatically deduct 40 rupees
7. **WhatsApp Redirect**: Open WhatsApp with owner's number
8. **Lead Tracking**: Log lead for analytics

### 3. Admin Panel Journey
```
Dashboard → Manage Approvals → Credit Management → Analytics
```

## 🛠 Technical Features

### Public Website (searchmystay.com)
- **Homepage**: Farmhouse listing grid
- **Search & Filter**: Location, amenities, price range
- **Farmhouse Details**: Comprehensive property information
- **Contact Integration**: WhatsApp direct linking
- **Responsive Design**: Mobile and desktop friendly

### Admin Panel
- **Dashboard**: Revenue overview, daily leads, pending approvals
- **Farmhouse Management**:
  - Pending approvals with document viewer
  - Active farmhouse listings
  - Approval/rejection workflow
- **Credit Management**: Add and track credits for each farmhouse
- **Document Verification**: Review uploaded documents
- **Analytics & Reports**:
  - Revenue tracking
  - Popular farmhouses
  - Lead generation statistics

## 📊 Key Entities

### Farmhouses
- Basic info (name, location, description)
- Contact details (phone, WhatsApp)
- Media (photos, virtual tours)
- Amenities and pricing
- Approval status
- Credit balance

### Documents
- Aadhar Card
- PAN Card
- Property ownership documents
- Verification status

### Transactions
- Credit additions
- Lead deductions (40 rupees each)
- Transaction history

### Leads
- User contact attempts
- Timestamp tracking
- Farmhouse-wise lead count

## 🚀 MVP Scope (Current Iteration)

### ✅ Include
- Farmhouse registration with document upload
- Admin approval workflow
- Manual credit management
- Basic WhatsApp integration
- Lead tracking and analytics
- Responsive farmhouse listing

### ❌ Exclude (Future Iterations)
- Automated payment gateway
- Real-time payment processing
- Advanced search algorithms
- Mobile applications

## 🔄 Pending Client Clarifications
- **Insufficient Credits**: Behavior when farmhouse credit < 40 rupees
- **Document Requirements**: Specific property document types needed

## 🏗 Tech Stack
- **Frontend**: React.js with Vite
- **Backend**: Python Flask
- **Database**: TBD (PostgreSQL/MongoDB)
- **File Storage**: Local/Cloud storage for documents
- **Deployment**: TBD

---

## 📋 Development Phases

### Phase 1: Core MVP
1. Database schema and API design
2. Admin panel for farmhouse management
3. Public farmhouse listing page
4. Document upload and verification
5. Credit system and lead tracking

### Phase 2: Enhancement
1. Advanced search and filtering
2. Payment gateway integration
3. Automated notifications
4. Enhanced analytics dashboard

---

*Last Updated: [Current Date]*
*Domain: searchmystay.com*
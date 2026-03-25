# Smart Parking System: Complete Walkthrough

This document outlines the entire end-to-end flow of the Smart Parking System, demonstrating how a single person would interact with the application from registering a new mall to booking a parking slot.

## Phase 1: Mall Registration (Mall Admin Perspective)

1.  **Navigating to Registration:** The user starts at the landing page and clicks **"Partner With Us"** or navigates to `/register-mall`.
2.  **Filling out the Form:** The user (acting as the Mall Admin) fills out a 3-step registration form:
    *   **Step 1:** Mall Details (Name, Address, City, Latitude, Longitude).
    *   **Step 2:** Contact Info (Name, Email, Phone).
    *   **Step 3:** Security (Setting an admin password). The admin email is automatically set to the contact email.
3.  **Submission:** Upon clicking submit, the mall data is saved to the database with a status of `pending`.
4.  **Notifications:**
    *   The **Mall Admin** instantly receives a professional "Registration Received" email confirming their application is under review.
    *   The **Super Admin** receives an automated email notification about the new pending registration.
5.  **Success Screen:** The Mall Admin sees a success screen and cannot access the admin dashboard until approved.

## Phase 2: Mall Approval (Super Admin Perspective)

1.  **super Admin Login:** The user logs in using the dedicated Super Admin credentials (e.g., `admin@smartparking.com`).
2.  **Dashboard Access:** The system recognizes the `superadmin` role and routes the user to the Super Admin Dashboard.
3.  **Reviewing Applications:** The Super Admin navigates to the "Pending Malls" section. Here, they see the newly registered mall.
4.  **Action - Approve:** The Super Admin clicks the checkmark icon to approve the mall.
5.  **System Actions upon Approval:**
    *   The mall's status changes from `pending` to `approved` in the database.
    *   A new Firebase Authentication user account is created using the Mall Admin's email and password provided during registration.
    *   A Firestore user record is created with the role `malladmin` and linked to the specific `mall_id`.
    *   A "Mall Approved!" email is automatically sent to the Mall Admin, providing a link to access their dashboard.

## Phase 3: Mall Configuration (Mall Admin Perspective)

1.  **Mall Admin Login:** The user logs out as the Super Admin and logs back in using the credentials they created during Phase 1.
2.  **Dashboard Access:** The system recognizes the `malladmin` role and routes them to the specific Mall Admin Dashboard, locked to their unique `mall_id`.
3.  **Adding Slots:** The Mall Admin clicks "Add Slots" and configures their parking inventory (e.g., adding 50 "Car" slots to the "Ground Floor" with a prefix "A" and a price of $5/hour).
4.  **Live Monitoring:** The Mall Admin can now see their live parking grid. All slots are initially green (Available).

## Phase 4: User Booking & Parking (Customer Perspective)

1.  **User Registration/Login:** The user creates a standard customer account (or logs in) and is routed to the User Dashboard.
2.  **Finding a Mall:** The user searches for a mall (e.g., typing the city or the newly created mall name). The real-time search fetches the approved mall.
3.  **Selecting a Mall:** Clicking "View Slots" opens the live parking grid for that specific mall.
4.  **Booking a Slot:** The user clicks an available (green) slot. A modal appears asking if they want to:
    *   **Reserve for Later:** Secures the spot ahead of time.
    *   **Park Now:** Immediately occupies the spot.
5.  **Payment Processing:** After selecting an option, a secure mock payment overlay appears. The user confirms the payment.
6.  **System Actions upon Payment:**
    *   The booking is recorded in the database.
    *   The slot's status changes to `booked` (yellow) or `occupied` (red) based on the choice.
    *   **Real-time Update:** Through WebSockets, the slot color instantly updates for the User, the Mall Admin, and any other users viewing that mall, without refreshing the page.
    *   **Notification:** The user receives either a "Booking Confirmed" email or a "Payment Receipt" email.
7.  **Active Session:** The user sees a live timer tracking their occupancy duration.

## Phase 5: Exiting & Refunds (Customer/Admin Interaction)

1.  **Exiting:** When the user is ready to leave, they click their occupied (red) slot and select "Release Slot".
2.  **System Actions upon Exit:**
    *   The slot immediately turns green (available) again for everyone on the network.
    *   An email is sent to the user confirming their session has ended.
3.  **Dispute/Refund Scenario (Optional Walkthrough):**
    *   If a user reserved a spot but arrives to find someone else parked there, they can click "Report Taken" on their active booking banner.
    *   This instantly sends a live WebSocket notification to the Mall Admin's dashboard ("New Dispute").
    *   The Mall Admin reviews the dispute and clicks "Confirm Refund".
    *   The system automatically refunds the user's wallet, releases the slot back to available, and sends a refund confirmation email.

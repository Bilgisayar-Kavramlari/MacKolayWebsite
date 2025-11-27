# ⚽ Maç Kolay - Small-Sided Football Match Organizer

**Developed on Replit.** This is a robust full-stack web application designed to simplify the process of organizing, joining, and managing local "halı saha" (small-sided football) matches in Turkey. The platform focuses on accountability and seamless user experience.

## 🚀 Live Application
You can explore the live, fully functional application here:

[Visit Maç Kolay Live Site](https://mackolay.replit.app/)

## ✨ Core Features & Functionality

* **Secure Authentication:** User registration (`/kayit`) and login (`/giris`) with password hashing and session persistence, fixed for public deployment environments.
* **Reliability Score System:** A **"Güvenilirlik Puanı"** (Reliability Score) is implemented (default 50), with logic to penalize users for last-minute match cancellations, promoting accountability.
* **Match Management:**
    * **Search & Post:** Users can filter available matches (`/mac-bul`) or post new match requirements.
    * **Homepage Integration:** Search parameters from the homepage are automatically passed to the search page for an immediate, filtered display.
    * **Match Synchronization (Maçlarım):** Users can track all matches they have created or joined under the dedicated **"Maçlarım"** tab.
* **UX & Data Safety:**
    * **Instant State Update:** The navigation bar updates immediately upon login (e.g., showing the profile link), resolving critical UX delays.
    * **Secured Contact:** The match organizer's phone number is only revealed to users who have successfully joined the match.

## ⚙️ Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | **React, TypeScript, Vite** | Modern, component-based user interface. |
| **Backend** | **Node.js, Express.js** | Handling routing, API endpoints, and business logic. |
| **Storage** | **JSON Files (fs module)** | Prototype persistence for user data and match data. |

## 🛠️ Local Setup and Installation

To run this project locally, please ensure you have Node.js installed.

1.  **Clone the Repository:**
    ```bash
    git clone YOUR_REPOSITORY_LINK_HERE
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Build the Project (Compile TS to JS):**
    ```bash
    npm run build
    ```
4.  **Start the Server:**
    ```bash
    npm start
    ```

    ## 👨‍💻 Developers
    This is a common project.
    
    👤Eren Şimşek

    👤Muhammed Eren Bağ

    👤Abdulkadir Atakan

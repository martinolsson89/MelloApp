class UserService {
    private storage: Storage;

    constructor() {
        // Default to sessionStorage, can be overridden
        this.storage = sessionStorage;
    }

    // Set storage type based on "remember me"
    setStorage(useLocalStorage: boolean) {
        this.storage = useLocalStorage ? localStorage : sessionStorage;
    }

    // Save user data with consistent keys and data types
    saveUserData(userData: { email: string; role: string }) {
        this.storage.setItem('email', userData.email);
        this.storage.setItem('role', userData.role); // Use 'role' instead of 'roles'
    }

    // Retrieve user data with correct keys and without unnecessary parsing
    getUserData(): { email: string; role: string } | null {
        const email = this.storage.getItem('email');
        const role = this.storage.getItem('role'); // Correct key
        if (email && role) {
            return { email, role }; // No JSON.parse needed
        }
        return null;
    }

    // Get only the user email
    getUserEmail(): string | null { // Return type updated to handle null
        const userData = this.getUserData();
        return userData?.email || null;
    }

    // Get only the user role
    getUserRole(): string | null { // Additional method for convenience
        const userData = this.getUserData();
        return userData?.role || null;
    }

    // Clear user data from storage
    clearUserData() {
        this.storage.removeItem('email');
        this.storage.removeItem('role');
    }

     // Check if user is admin
     isAdmin(): boolean {
        const userData = this.getUserData();
        return userData?.role === 'Admin';
    }

    // Check if user is logged in
    isLoggedIn(): boolean {
        return this.getUserData() !== null;
    }
}

// Export a singleton instance
export const userService = new UserService();

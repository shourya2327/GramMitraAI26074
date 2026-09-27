/**
 * GramMitraAI User Storage & Authentication Service
 * 
 * Note: This implements local storage-backed user management and authentication
 * for the demo/frontend-only deployment of GramMitraAI. In a production environment,
 * this will be replaced with real backend API calls (e.g. Spring Boot JWT auth at /api/auth/*).
 */

const STORAGE_KEY_USERS = 'gm_registered_users';
const STORAGE_KEY_CURRENT_USER = 'gm_user';
const STORAGE_KEY_TOKEN = 'gm_token';

// Initial seeded demo users (customers/farmers and admin)
const INITIAL_DEMO_USERS = [
  {
    id: 1,
    fullName: "Ramesh Patel",
    mobileNumber: "9876543210",
    email: "ramesh.farmer@grammitra.ai",
    password: "farmer123",
    role: "ROLE_FARMER",
    preferredLanguage: "hi",
    state: "Madhya Pradesh",
    district: "Indore",
    block: "Sanwer",
    panchayat: "Kshipra",
    registrationDate: "2024-01-15",
    status: "Active",
    farmSize: "4.5 Acres",
    primaryCrop: "Wheat & Soybean"
  },
  {
    id: 2,
    fullName: "Sunita Devi",
    mobileNumber: "9876543211",
    email: "sunita.farmer@grammitra.ai",
    password: "farmer123",
    role: "ROLE_FARMER",
    preferredLanguage: "mr",
    state: "Maharashtra",
    district: "Nashik",
    block: "Dindori",
    panchayat: "Janori",
    registrationDate: "2024-02-10",
    status: "Active",
    farmSize: "3.2 Acres",
    primaryCrop: "Grapes & Onions"
  },
  {
    id: 3,
    fullName: "Balwinder Singh",
    mobileNumber: "9876543212",
    email: "balwinder@grammitra.ai",
    password: "farmer123",
    role: "ROLE_FARMER",
    preferredLanguage: "en",
    state: "Punjab",
    district: "Ludhiana",
    block: "Khanna",
    panchayat: "Alour",
    registrationDate: "2024-03-01",
    status: "Active",
    farmSize: "8.0 Acres",
    primaryCrop: "Paddy & Mustard"
  },
  {
    id: 4,
    fullName: "Dr. Anita Sharma",
    mobileNumber: "9876543213",
    email: "anita.officer@grammitra.ai",
    password: "officer123",
    role: "ROLE_OFFICER",
    preferredLanguage: "hi",
    state: "Madhya Pradesh",
    district: "Bhopal",
    block: "Phanda",
    panchayat: "Berasia",
    registrationDate: "2024-01-05",
    status: "Active",
    farmSize: "N/A",
    primaryCrop: "N/A"
  },
  {
    id: 99,
    fullName: "GramMitra Admin",
    mobileNumber: "9999999999",
    email: "admin@grammitra.ai",
    password: "Admin@123",
    role: "ROLE_ADMIN",
    preferredLanguage: "en",
    state: "National",
    district: "Central Ops",
    block: "Headquarters",
    panchayat: "Admin HQ",
    registrationDate: "2023-11-01",
    status: "Active",
    farmSize: "N/A",
    primaryCrop: "N/A"
  }
];

/**
 * Retrieve all registered users from localStorage, seeding if not present.
 */
export const getRegisteredUsers = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    const parsed = JSON.parse(data);
    // If admin is missing or data is malformed, re-seed or merge
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    return parsed;
  } catch (e) {
    console.error("Failed to read registered users from localStorage", e);
    return INITIAL_DEMO_USERS;
  }
};

/**
 * Save updated list of users to localStorage.
 */
export const saveRegisteredUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to write registered users to localStorage", e);
  }
};

/**
 * Authenticate customer/farmer login.
 * Identifier can be Mobile Number or Email.
 */
export const authenticateCustomer = (identifier, password) => {
  const users = getRegisteredUsers();
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  const user = users.find(u => {
    const matchEmail = (u.email || '').toLowerCase() === cleanId;
    const matchMobile = (u.mobileNumber || '').trim() === cleanId;
    return (matchEmail || matchMobile);
  });

  if (!user) {
    return { success: false, message: "User not found. Please check your mobile/email or create a new account." };
  }

  if (user.status === 'Inactive' || user.status === 'Deactivated') {
    return { success: false, message: "Your account has been deactivated. Please contact administrator." };
  }

  if (user.password !== cleanPass) {
    return { success: false, message: "Incorrect password. Please try again or use 'Forgot Password'." };
  }

  // Admin cannot login via customer login form
  if (user.role === 'ROLE_ADMIN') {
    return { success: false, message: "Admin credentials detected. Please switch to the Admin Login option." };
  }

  // Generate safe user session object (strip plain password)
  const { password: _, ...safeUser } = user;
  return {
    success: true,
    user: safeUser,
    token: `demo-token-${user.id}-${Date.now()}`
  };
};

/**
 * Authenticate Admin login.
 * Admin ID / Email and password.
 */
export const authenticateAdmin = (identifier, password) => {
  const users = getRegisteredUsers();
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  const adminUser = users.find(u => {
    const matchEmail = (u.email || '').toLowerCase() === cleanId;
    const matchMobile = (u.mobileNumber || '').trim() === cleanId;
    return (matchEmail || matchMobile);
  });

  if (!adminUser) {
    return { success: false, message: "Admin ID not found. Use demo admin credentials (admin@grammitra.ai / Admin@123)." };
  }

  if (adminUser.role !== 'ROLE_ADMIN') {
    return { success: false, message: "This account does not have Admin privileges. Please use Customer / Farmer Login." };
  }

  if (adminUser.status === 'Inactive' || adminUser.status === 'Deactivated') {
    return { success: false, message: "This admin account is deactivated." };
  }

  if (adminUser.password !== cleanPass) {
    return { success: false, message: "Incorrect Admin password. Demo password is: Admin@123" };
  }

  const { password: _, ...safeUser } = adminUser;
  return {
    success: true,
    user: safeUser,
    token: `demo-admin-token-${adminUser.id}-${Date.now()}`
  };
};

/**
 * Register a new Customer / Farmer.
 */
export const registerNewCustomer = (customerData) => {
  const users = getRegisteredUsers();
  const cleanMobile = (customerData.mobileNumber || '').trim();
  const cleanEmail = (customerData.email || '').trim().toLowerCase();

  // Check if mobile or email already exists
  const existing = users.find(u => 
    (cleanMobile && u.mobileNumber === cleanMobile) ||
    (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail)
  );

  if (existing) {
    return { success: false, message: "An account with this mobile number or email already exists." };
  }

  const newUser = {
    id: Date.now(),
    fullName: customerData.fullName.trim(),
    mobileNumber: cleanMobile,
    email: cleanEmail || `${cleanMobile}@farmer.grammitra.ai`,
    password: customerData.password,
    role: customerData.role || "ROLE_FARMER",
    preferredLanguage: customerData.preferredLanguage || "hi",
    state: customerData.state || "Central Region",
    district: customerData.district || "Local District",
    block: customerData.block || "Local Block",
    panchayat: customerData.panchayat || "Local Panchayat",
    registrationDate: new Date().toISOString().split('T')[0],
    status: "Active",
    farmSize: customerData.farmSize || "2.5 Acres",
    primaryCrop: customerData.primaryCrop || "Wheat"
  };

  const updatedUsers = [...users, newUser];
  saveRegisteredUsers(updatedUsers);

  const { password: _, ...safeUser } = newUser;
  return {
    success: true,
    user: safeUser,
    token: `demo-token-${newUser.id}-${Date.now()}`
  };
};

/**
 * Update an existing customer profile.
 * If the updated user is currently logged in, syncs the session storage as well.
 */
export const updateCustomerData = (userId, updatedFields) => {
  const users = getRegisteredUsers();
  const index = users.findIndex(u => String(u.id) === String(userId));

  if (index === -1) {
    return { success: false, message: "User not found." };
  }

  const updatedUser = {
    ...users[index],
    ...updatedFields
  };

  users[index] = updatedUser;
  saveRegisteredUsers(users);

  // If this user is currently in session storage, update the session
  try {
    const currentSession = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (currentSession) {
      const parsedSession = JSON.parse(currentSession);
      if (String(parsedSession.id) === String(userId)) {
        const { password: _, ...safeUser } = updatedUser;
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(safeUser));
      }
    }
  } catch (e) {
    console.error("Failed to sync current user session", e);
  }

  const { password: _, ...safeUser } = updatedUser;
  return { success: true, user: safeUser };
};

/**
 * Delete a customer account.
 */
export const deleteCustomerAccount = (userId) => {
  const users = getRegisteredUsers();
  const target = users.find(u => String(u.id) === String(userId));
  if (!target) {
    return { success: false, message: "User not found." };
  }
  if (target.role === 'ROLE_ADMIN') {
    return { success: false, message: "Cannot delete primary administrator account." };
  }

  const updatedUsers = users.filter(u => String(u.id) !== String(userId));
  saveRegisteredUsers(updatedUsers);
  return { success: true };
};

/**
 * Toggle Active / Deactivated status for a customer.
 */
export const toggleCustomerStatus = (userId) => {
  const users = getRegisteredUsers();
  const index = users.findIndex(u => String(u.id) === String(userId));
  if (index === -1) {
    return { success: false, message: "User not found." };
  }
  if (users[index].role === 'ROLE_ADMIN') {
    return { success: false, message: "Cannot deactivate administrator account." };
  }

  const currentStatus = users[index].status || 'Active';
  users[index].status = currentStatus === 'Active' ? 'Deactivated' : 'Active';
  saveRegisteredUsers(users);

  return { success: true, status: users[index].status };
};

/**
 * Reset password for customer (Forgot Password flow).
 */
export const resetCustomerPassword = (identifier, newPassword) => {
  const users = getRegisteredUsers();
  const cleanId = (identifier || '').trim().toLowerCase();

  const index = users.findIndex(u => {
    const matchEmail = (u.email || '').toLowerCase() === cleanId;
    const matchMobile = (u.mobileNumber || '').trim() === cleanId;
    return matchEmail || matchMobile;
  });

  if (index === -1) {
    return { success: false, message: "No registered customer found with this mobile or email." };
  }

  users[index].password = newPassword;
  saveRegisteredUsers(users);
  return { success: true, message: "Password updated successfully. You can now login with your new password." };
};

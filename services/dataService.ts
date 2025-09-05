// A generic function to get items from localStorage
export const getItems = <T>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            const parsed = JSON.parse(storedValue);
            // Basic check to prevent returning an empty array from storage if the default has content,
            // which can happen if the content was cleared from the admin panel.
            if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(defaultValue) && defaultValue.length > 0) {
                 return defaultValue;
            }
            return parsed;
        }
    } catch (error) {
        console.error(`Error reading '${key}' from localStorage:`, error);
    }
    // Return the default value if nothing is in storage or if there's an error
    return defaultValue;
};

// A generic function to save items to localStorage
export const saveItems = <T>(key: string, items: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
        console.error(`Error saving '${key}' to localStorage:`, error);
    }
};

// Specific function for a single string value, like the email template
export const getItem = (key: string, defaultValue: string): string => {
    try {
        const storedValue = localStorage.getItem(key);
        return storedValue || defaultValue;
    } catch (error) {
        console.error(`Error reading item '${key}' from localStorage:`, error);
        return defaultValue;
    }
};

export const setItem = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error(`Error setting item '${key}' in localStorage:`, error);
    }
};

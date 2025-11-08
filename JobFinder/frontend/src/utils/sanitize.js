export const sanitizeHtml = (html) => {
    // Simple HTML sanitizer to prevent XSS
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
};

export const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};

export const validateUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const validatePhone = (phone) => {
    const re = /^\+?[\d\s-]{10,}$/;
    return re.test(phone);
};
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // Ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10,11}$/;
  return re.test(phone);
};

export const validateRequired = (value) => {
  if (typeof value === 'string') return value.trim() !== '';
  if (typeof value === 'number') return true;
  return value !== undefined && value !== null && value !== '';
};

export const validateLength = (value, min, max) => {
  if (!value) return false;
  const length = value.toString().length;
  return length >= min && length <= max;
};

export const validateDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

export const validateFileSize = (file, maxSizeMB) => {
  if (!file) return false;
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  return file.size <= maxSize;
};

export const validateFileType = (file, allowedTypes) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = 'Trường này là bắt buộc';
    }
    
    if (value && fieldRules.email && !validateEmail(value)) {
      errors[field] = 'Email không hợp lệ';
    }
    
    if (value && fieldRules.password && !validatePassword(value)) {
      errors[field] = 'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường và 1 số';
    }
    
    if (value && fieldRules.phone && !validatePhone(value)) {
      errors[field] = 'Số điện thoại không hợp lệ';
    }
    
    if (value && fieldRules.minLength && !validateLength(value, fieldRules.minLength)) {
      errors[field] = `Độ dài tối thiểu là ${fieldRules.minLength} ký tự`;
    }
    
    if (value && fieldRules.maxLength && !validateLength(value, 0, fieldRules.maxLength)) {
      errors[field] = `Độ dài tối đa là ${fieldRules.maxLength} ký tự`;
    }
  });
  
  return errors;
}; 
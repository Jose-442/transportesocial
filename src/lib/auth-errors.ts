const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "Email not confirmed":
    "Debes confirmar tu correo antes de entrar. Revisa tu bandeja de entrada y la carpeta de spam.",
  "Invalid login credentials": "Email o contraseña incorrectos.",
  "User already registered":
    "Este email ya está registrado. Prueba a entrar o recupera tu contraseña.",
  "Password should be at least 6 characters":
    "La contraseña debe tener al menos 6 caracteres.",
  "Signup requires a valid password": "Introduce una contraseña válida.",
  "Unable to validate email address: invalid format":
    "El formato del email no es válido.",
  "Email rate limit exceeded":
    "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
  "For security purposes, you can only request this once every 60 seconds":
    "Por seguridad, solo puedes solicitarlo una vez cada 60 segundos.",
};

export function traducirErrorAuth(message: string): string {
  return AUTH_ERROR_MESSAGES[message] ?? message;
}

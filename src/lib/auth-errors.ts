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
    "Demasiados intentos de envío de correo. Espera al menos 1 hora y vuelve a intentarlo.",
  over_email_send_rate_limit:
    "Demasiados intentos de envío de correo. Espera al menos 1 hora y vuelve a intentarlo.",
  "For security purposes, you can only request this once every 60 seconds":
    "Por seguridad, solo puedes solicitarlo una vez cada 60 segundos. Espera un minuto.",
  "missing email or phone": "Escribe el email y la contraseña.",
};

const AUTH_ERROR_PATTERNS: Array<[RegExp, string]> = [
  [/missing email or phone/i, "Escribe el email y la contraseña."],
  [/invalid login credentials/i, "Email o contraseña incorrectos."],
  [/email not confirmed/i,
    "Debes confirmar tu correo antes de entrar. Revisa tu bandeja de entrada y la carpeta de spam."],
  [/user already registered/i,
    "Este email ya está registrado. Prueba a entrar o recupera tu contraseña."],
  [/invalid format/i, "El formato del email no es válido."],
  [/rate limit/i,
    "Demasiados intentos. Espera un rato y vuelve a intentarlo."],
];

const INGLES_TIPICO =
  /\b(the|and|missing|invalid|denied|failed|unable|please|required|phone)\b/i;

export function pareceMensajeIngles(message: string): boolean {
  return INGLES_TIPICO.test(message);
}

export function traducirErrorAuth(message: string): string {
  const msg = message.trim();
  if (AUTH_ERROR_MESSAGES[msg]) return AUTH_ERROR_MESSAGES[msg];

  for (const [patron, texto] of AUTH_ERROR_PATTERNS) {
    if (patron.test(msg)) return texto;
  }

  if (pareceMensajeIngles(msg)) {
    return "No se ha podido completar. Revisa los datos e inténtalo de nuevo.";
  }

  return msg;
}

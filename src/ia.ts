// 🤖 La revisión de la semana escrita por Claude, dentro de la app. Usa la clave de la API de Anthropic de cada persona:
// la clave se guarda solo en este equipo (localStorage), nunca en los datos de la app ni en la nube. El texto que se manda
// es el de promptSemanal (prediccion.js), sin nombre ni correo. El SDK se descarga solo al pedir la primera revisión.
import type Anthropic from '@anthropic-ai/sdk';

const CLAVE = 'rutina_ia_clave';
export const MODELO = 'claude-opus-5-5';
export function claveIA(): string {
  try { return localStorage.getItem(CLAVE) || ''; } catch (err) { return ''; }
}
export function ponerClaveIA(k: string) {
  try { if (k) localStorage.setItem(CLAVE, k); else localStorage.removeItem(CLAVE); } catch (err) { /* sin almacenamiento */ }
}
export const pareceClave = (k: string) => /^sk-ant-[\w-]{20,}$/.test(k.trim());

const SISTEMA = 'Eres el entrenador, nutricionista y mentor de vida de quien te escribe. Respondes siempre en español de Colombia, ' +
  'claro, directo y honesto, sin halagos. Usa títulos cortos y listas. No inventes datos: si falta uno, dilo. Termina con un plan ' +
  'priorizado de 3 acciones para la próxima semana, cada una con un número concreto.';

/** Pide la revisión. Devuelve el texto o lanza un Error con un mensaje para mostrar tal cual */
/** sistema: otras instrucciones (🎙️ Audio a texto la usa para ordenar y resumir una nota) */
export async function pedirRevisionIA(texto: string, clave = claveIA(), sistema = SISTEMA): Promise<string> {
  if (!clave) throw new Error('Primero pega tu clave de la API de Anthropic.');
  if (typeof navigator !== 'undefined' && navigator.onLine === false) throw new Error('Sin internet. La revisión con IA necesita conexión; todo lo demás sigue funcionando.');
  const { default: Cliente } = await import('@anthropic-ai/sdk');
  // dangerouslyAllowBrowser: la clave es de la misma persona que usa el equipo; no hay servidor de por medio
  const cliente: Anthropic = new Cliente({ apiKey: clave, dangerouslyAllowBrowser: true, maxRetries: 1 });
  try {
    const r = await cliente.beta.messages.create({
      model: MODELO,
      max_tokens: 16000,
      system: sistema,
      output_config: { effort: 'medium' },
      // Si el modelo declina, la API reintenta sola con otro modelo (refusal fallback)
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      messages: [{ role: 'user', content: texto }],
    });
    if (r.stop_reason === 'refusal') throw new Error('La IA no quiso responder esta vez. Inténtalo de nuevo más tarde.');
    const salida = r.content.map((b) => (b.type === 'text' ? b.text : '')).join('').trim();
    if (!salida) throw new Error('La IA no devolvió texto. Inténtalo de nuevo.');
    return salida;
  } catch (err) {
    if (err instanceof Cliente.AuthenticationError || err instanceof Cliente.PermissionDeniedError) throw new Error('La clave no sirve o no tiene permiso. Revísala en console.anthropic.com.');
    if (err instanceof Cliente.RateLimitError) throw new Error('Demasiadas peticiones o sin saldo en tu cuenta de Anthropic. Espera un poco o revisa tu saldo.');
    if (err instanceof Cliente.APIConnectionError) throw new Error('No se pudo conectar con Anthropic. Revisa tu internet.');
    if (err instanceof Cliente.APIError) throw new Error('Anthropic respondió con un error (' + err.status + '). Inténtalo más tarde.');
    throw err;
  }
}

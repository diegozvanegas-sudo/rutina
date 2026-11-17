// Recorrido de 🔮 Predicciones (Progreso): sin datos pide pesarse; con 8 semanas de pesos que bajan dice el ritmo, el peso
// en 4 semanas y cuándo llega a la meta, con su prueba contra el pasado; con comidas marcadas, el gasto real; la carga; y la
// revisión para la IA (copiar y ver el texto, sin nombre ni correo). Al final deja los datos como estaban.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/prediccion.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Predicciones'), { paso, falla, tocarTexto } = a;
  const tarjeta = () => p.ev(`(()=>{const t=[...document.querySelectorAll('#vista [data-t=tarjeta]')].find(x=>x.dataset.plegable&&x.dataset.plegable.includes('Predicciones'));return t?t.textContent.replace(/\\s+/g,' '):''})()`);
  const abrir = async () => {
    await p.ir('progreso');
    await a.esperar('#vista h1');
    await p.ev(`(()=>{const t=[...document.querySelectorAll('#vista [data-t=tarjeta]')].find(x=>x.dataset.plegable&&x.dataset.plegable.includes('Predicciones'));const b=t&&t.querySelector('[data-t=plegar][aria-expanded=false]');if(b)b.click()})()`);
    await a.dormir(500);
  };
  const conDatos = (js) => p.ev(`(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('rutina_v1')),s=JSON.parse(localStorage[k]);${js};localStorage[k]=JSON.stringify(s)})()`);

  await p.computador();
  // Sin pesos: pide pesarse
  await conDatos(`for(const f of Object.keys(s.dias)) delete s.dias[f].peso`);
  await p.recargar();
  await abrir();
  falla((await tarjeta()).includes('Pésate al menos 8 veces'), 'sin pesos no pide pesarse: ' + (await tarjeta()).slice(0, 200));
  await paso('sin datos');

  // 8 semanas de pesos bajando 0,5 kg por semana, meta 75 kg, y 3 semanas de comidas completas marcadas
  await conDatos(`
    const hoy=new Date(); const iso=(d)=>new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);
    const r=[0.3,-0.2,0.1,-0.3,0.2,0,-0.1];
    for(let i=0;i<56;i++){const d=new Date(hoy);d.setDate(d.getDate()-55+i);const f=iso(d);(s.dias[f]??={}).peso=Math.round((80-0.5/7*i+r[i%7])*10)/10;}
    s.dieta.config.meta=75;
    const ej=s.rutina.find(d=>d.diaSemana&&d.id!=='core').ejercicios.find(x=>x.filas[0]&&x.filas[0].unidad!=='s'), fi=ej.filas[0].id;
    for(let n=1;n<=6;n++){s.semanas[n]??={};s.semanas[n][fi]={peso:String(60+2.5*n),reps:'6',unidad:'kg'};}
    for(let i=1;i<=21;i++){const d=new Date(hoy);d.setDate(d.getDate()-i);const f=iso(d);(s.dias[f]??={}).comidas={'x:0':{ts:1,nombre:'Todo',kcal:4000,p:150,c:400,g:80}};}
  `);
  await p.recargar();
  await abrir();
  const t = await tarjeta();
  falla(/Vas a -0,\d kg por semana/.test(t), 'no dice el ritmo: ' + t.slice(0, 300));
  falla(t.includes('En 4 semanas:') && t.includes('Llegas a 75 kg hacia el'), 'no dice el peso en 4 semanas ni cuándo llega');
  falla(t.includes('Probada') && t.includes('sin modelo'), 'no dice cómo le fue contra el pasado');
  falla(t.includes('Gastas unas') && t.includes('kcal al día'), 'no calcula el gasto real: ' + t);
  falla(t.includes('🔋 Tu carga') && /Carga en|veces tu carga/.test(t), 'no mide la carga: ' + t.slice(t.indexOf('🔋'), t.indexOf('🔋') + 160));
  const ej = await p.ev(`(()=>{const s=JSON.parse(localStorage[Object.keys(localStorage).find(k=>k.startsWith('rutina_v1'))]);return s.rutina.find(d=>d.diaSemana&&d.id!=='core').ejercicios.find(x=>x.filas[0]&&x.filas[0].unidad!=='s').nombre})()`);
  falla(t.includes(ej) && /\d → \d/.test(t), 'no predice la fuerza de ' + ej + ': ' + t.slice(t.indexOf('💪'), t.indexOf('💪') + 200));
  await paso('con datos');
  await p.foto('prediccion-pc');

  // Revisión para la IA: copiar y ver el texto
  await tocarTexto('📋 Copiar la revisión para la IA');
  falla((await a.aviso()).includes('Revisión copiada'), 'no avisó que copió: ' + await a.aviso());
  await tocarTexto('Ver el texto', 'button, summary, [role=button]', false);
  await a.esperar('#prompt-semanal');
  const texto = await a.valor('#prompt-semanal');
  for (const s of ['## Lo que necesito', '## Peso', '## Comida y gasto real', '## Fuerza', '## Carga', 'Llegaría el']) falla(texto.toLowerCase().includes(s.toLowerCase()), 'el texto para la IA no trae ' + s);
  falla(!/@/.test(texto), 'el texto para la IA lleva un correo');

  // Celular
  await p.celular();
  await abrir();
  falla(await p.sinDesborde(), 'se sale de la pantalla en el celular');
  await p.ev(`[...document.querySelectorAll('#vista [data-t=tarjeta]')].find(x=>x.dataset.plegable&&x.dataset.plegable.includes('Predicciones')).scrollIntoView()`);
  await p.foto('prediccion-cel');
  await p.computador();

  // Como empiezan los demás recorridos
  await p.ev('window.rutinaPrueba.ejemplo()');
  console.log('✓ Predicciones');
};

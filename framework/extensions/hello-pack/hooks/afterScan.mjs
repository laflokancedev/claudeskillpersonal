// Handler de hook pur (ADR-056) fourni par hello-pack. Reçoit une copie du payload,
// renvoie un delta contractuel — ne mute pas l'état global.
export default function afterScan(payload) {
  return { greeted: true, note: 'hello-pack: afterScan exécuté', extension: 'hello-pack' };
}

// Fee: ₹50/hour, minimum ₹50, partial hours rounded up
export function calculateFee(entryTime) {
  const entry = new Date(entryTime);
  const now = new Date();
  const diffMs = now - entry;
  const diffHours = diffMs / (1000 * 60 * 60);
  const roundedHours = Math.ceil(diffHours);
  return Math.max(50, roundedHours * 50);
}

export function formatDuration(entryTime) {
  const entry = new Date(entryTime);
  const now = new Date();
  const diffMs = now - entry;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

export function formatDateTime(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export const SECTIONS = ['A', 'B', 'C', 'D'];
export const SLOTS_PER_SECTION = 50;

export function getAllSlotNumbers() {
  const slots = [];
  for (const sec of SECTIONS) {
    for (let i = 1; i <= SLOTS_PER_SECTION; i++) {
      slots.push(`${sec}${i}`);
    }
  }
  return slots;
}

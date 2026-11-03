export function resultLabel(result: number): string {
  switch (result) {
    case 0:
      return 'High response';
    case 1:
      return 'Moderate';
    case 2:
      return 'Low';
    case 3:
      return 'No reaction';
    default:
      return 'Unknown';
  }
}

export function resultColorClass(result: number): string {
  switch (result) {
    case 0:
      return 'bg-pulse-high';
    case 1:
      return 'bg-pulse-mid';
    case 2:
      return 'bg-pulse-low';
    case 3:
      return 'bg-pulse-calm';
    default:
      return 'bg-slate-soft';
  }
}

export function resultTextClass(result: number): string {
  switch (result) {
    case 0:
      return 'text-pulse-high';
    case 1:
      return 'text-pulse-mid';
    case 2:
      return 'text-pulse-low';
    case 3:
      return 'text-pulse-calm';
    default:
      return 'text-slate-soft';
  }
}

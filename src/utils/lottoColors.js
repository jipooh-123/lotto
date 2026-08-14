/**
 * Get lotto ball color styles based on official color scheme
 * 1~10: Yellow (#FBC400)
 * 11~20: Blue (#69C8F2)
 * 21~30: Red (#FF7272)
 * 31~40: Gray (#AAAAAA)
 * 41~45: Green (#B0D840)
 */

export function getBallColorInfo(num) {
  const n = parseInt(num, 10);
  if (n >= 1 && n <= 10) {
    return {
      bg: '#FBC400',
      text: '#1E1B4B', // dark text for high contrast on yellow
      glow: 'rgba(251, 196, 0, 0.4)',
      gradient: 'radial-gradient(circle at 35% 35%, #FFF08A, #FBC400 65%, #B78900)',
      border: '#D9A700',
      name: 'yellow'
    };
  } else if (n >= 11 && n <= 20) {
    return {
      bg: '#69C8F2',
      text: '#FFFFFF',
      glow: 'rgba(105, 200, 242, 0.4)',
      gradient: 'radial-gradient(circle at 35% 35%, #BBE7FD, #69C8F2 65%, #2581B8)',
      border: '#45AEDB',
      name: 'blue'
    };
  } else if (n >= 21 && n <= 30) {
    return {
      bg: '#FF7272',
      text: '#FFFFFF',
      glow: 'rgba(255, 114, 114, 0.4)',
      gradient: 'radial-gradient(circle at 35% 35%, #FFBDBD, #FF7272 65%, #C23333)',
      border: '#E04E4E',
      name: 'red'
    };
  } else if (n >= 31 && n <= 40) {
    return {
      bg: '#AAAAAA',
      text: '#FFFFFF',
      glow: 'rgba(170, 170, 170, 0.4)',
      gradient: 'radial-gradient(circle at 35% 35%, #E2E2E2, #AAAAAA 65%, #666666)',
      border: '#888888',
      name: 'gray'
    };
  } else if (n >= 41 && n <= 45) {
    return {
      bg: '#B0D840',
      text: '#1E3A8A', // dark contrast text on lime green
      glow: 'rgba(176, 216, 64, 0.4)',
      gradient: 'radial-gradient(circle at 35% 35%, #E5F796, #B0D840 65%, #729910)',
      border: '#93B926',
      name: 'green'
    };
  }
  return {
    bg: '#334155',
    text: '#FFFFFF',
    glow: 'rgba(51, 65, 85, 0.4)',
    gradient: 'radial-gradient(circle at 35% 35%, #64748B, #334155 65%, #0F172A)',
    border: '#1E293B',
    name: 'default'
  };
}

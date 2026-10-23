// mockPeaks.ts
export const generateMockPeaks = (count = 100, seed = 42): number[] => {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    // «фразы»: громкость плавно ходит вверх-вниз
    const envelope = 0.55 + 0.35 * Math.sin(t * Math.PI * 7);
    // небольшой шум, чтобы столбики не были гладкими
    const noise = 0.6 + 0.4 * rand();
    // затухание в начале и конце трека
    const edge = Math.min(1, t * 12, (1 - t) * 12);
    return Math.min(1, Math.max(0.06, envelope * noise * (0.3 + 0.7 * edge)));
  });
};

export const MOCK_PEAKS = generateMockPeaks(100);

export const createMockAudioUrl = (seconds = 331): string => {
  if (typeof window === "undefined") {
    return "";
  }
  const sampleRate = 8000;
  const samples = seconds * sampleRate;
  const buffer = new ArrayBuffer(44 + samples);
  const v = new DataView(buffer);

  const write = (offset: number, str: string) =>
    [...str].forEach((c, i) => v.setUint8(offset + i, c.charCodeAt(0)));

  // WAV-заголовок: 8 бит, моно
  write(0, "RIFF");
  v.setUint32(4, 36 + samples, true);
  write(8, "WAVE");
  write(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate, true);
  v.setUint16(32, 1, true);
  v.setUint16(34, 8, true);
  write(36, "data");
  v.setUint32(40, samples, true);

  // тихий тон 220 Гц, чтобы было слышно, что играет
  for (let i = 0; i < samples; i++) {
    const s = Math.sin((2 * Math.PI * 220 * i) / sampleRate);
    v.setUint8(44 + i, 128 + Math.round(s * 20));
  }

  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
};

// Один и тот же URL на одинаковую длительность, чтобы не плодить Blob'ы
// TODO: Убрать вместе с моками, когда появятся настоящие аудио
const mockAudioUrls = new Map<number, string>();

export const getMockAudioUrl = (seconds = 331): string => {
  if (typeof window === "undefined") {
    return "";
  }
  const cachedUrl = mockAudioUrls.get(seconds);
  if (cachedUrl) {
    return cachedUrl;
  }
  const url = createMockAudioUrl(seconds);
  mockAudioUrls.set(seconds, url);
  return url;
};

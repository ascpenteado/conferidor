import Tesseract from 'tesseract.js';

export const useOCR = async (file: File): Promise<string> => {
  const result = await Tesseract.recognize(file, 'eng');
  return result.data.text;
};

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

// Read the compressed dictionary
const dictionaryPath = path.join(process.cwd(), 'public', 'compressed-dictionary.json');
const compressedDictionary = JSON.parse(fs.readFileSync(dictionaryPath, 'utf-8'));

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const word = searchParams.get('word');

  if (!word) {
    return NextResponse.json({ error: 'Word parameter is required' }, { status: 400 });
  }

  const isValidWord = compressedDictionary.includes(word.toLowerCase());

  return NextResponse.json({ isValid: isValidWord });
}
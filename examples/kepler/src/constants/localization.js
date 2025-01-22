// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// Add english messages here, other languages will use these
// if translations not available for every message
const en = {
  'sampleMapsTab.noData': 'No data ?',
  'sampleMapsTab.trySampleData': 'Try sample data',
  'sampleDataViewer.rowCount': ' {rowCount} rows',
  'exportVideoModal.animation': 'Animation',
  'exportVideoModal.settings': 'Settings',
  'placeholder.search': 'Search',
};

export const messages = {
  en,
  fi: {
    ...en,
    'sampleMapsTab.noData': 'Ei aineistoja?',
    'sampleMapsTab.trySampleData': 'Kokeile testiaineistoja',
    'sampleDataViewer.rowCount': ' {rowCount} riviä'
  },
  ca: {
    ...en,
    'sampleMapsTab.noData': 'Cap dada?',
    'sampleMapsTab.trySampleData': 'Prova dades de mostra',
    'sampleDataViewer.rowCount': ' {rowCount} files'
  },
  es: {
    ...en,
    'sampleMapsTab.noData': 'Ningún dato?',
    'sampleMapsTab.trySampleData': 'Prueba datos de muestra',
    'sampleDataViewer.rowCount': ' {rowCount} files'
  }
};

import test from 'tape-catch';

import {printDuration} from '@hubble.gl/react/src/components/export-video/utils';

test('printDuration#duration without milli or hour', t => {
  t.equal(printDuration(106050), '01:46');
  t.end();
});

test('printDuration#duration with milli and no hour', t => {
  t.equal(printDuration(106050, true), '01:46.5');
  t.end();
});

test('printDuration#duration with milli and with hour', t => {
  t.equal(printDuration(10605700, true), '02:56:45.7');
  t.end();
});

test('printDuration#duration no milli and with hour', t => {
  t.equal(printDuration(10605700, false), '02:56:45');
  t.end();
});

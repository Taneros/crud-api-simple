import {jest} from '@jest/globals'
import server from '../src/index'

jest.unstable_mockModule('node:child_process', () => ({
  execSync: jest.fn(),
}));


describe('util', function () {
  it('loads JSON  files', async function () {
    // import the module being tested, which uses the mocked resource
    const {loadJson} = await import( './index.ts' );
    
    const data = loadJson( 'foo.json' );
    
    expect(data).toEqual({ items: ['one', 'two', 'three'] });
  });
});
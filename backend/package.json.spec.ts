/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { Test } from '@nestjs/testing';

describe('PackageJson', () => {
    let packageJson: PackageJson;

beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [], // Add
        controllers: [], // Add
        providers: [],   // Add
    }).compile();

    packageJson = moduleRef.get<PackageJson>(PackageJson);
    });

it('should be defined', () => {
    expect(packageJson).toBeDefined();
    });
});

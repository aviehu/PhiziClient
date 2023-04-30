import get2DPositions from './util/get2DPositions'
import {sampledVideoWidth, scoreThreshold} from "./util/envVars";

test('get2DPositions', () => {
    const poses = {
        keypoints: [{
            name: 'abc',
            x: 123,
            y: 456,
            z: 789,
            score: scoreThreshold + 1
        }]
    }
    const expectedResult = [{
        part: 'abc',
        x: sampledVideoWidth - 123,
        y: 456,
        z: 789,
    }]

    expect(get2DPositions(poses)).toMatchObject(expectedResult);
});

import get2DPositions from '../util/get2DPositions'
import get3DPositions from "../util/get3DPositions";
import { sampledVideoWidth, scoreThreshold } from "../util/envVars";


test('get2DPositions_success', () => {
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

test('get2DPositions_withPointsBelowThreshold', () => {
    const poses = {
        keypoints: [{
            name: 'abc',
            x: 123,
            y: 456,
            z: 789,
            score: scoreThreshold + 1
        },
        {
            name: 'def',
            x: 234,
            y: 567,
            z: 890,
            score: scoreThreshold - 0.1
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

test('get2DPositions_allPointsBelowThreshold', () => {
    const poses = {
        keypoints: [{
            name: 'abc',
            x: 123,
            y: 456,
            z: 789,
            score: 0.2
        },
        {
            name: 'def',
            x: 234,
            y: 567,
            z: 890,
            score: 0.1
        }]
    }
    const expectedResult = {}
    expect(get2DPositions(poses)).toMatchObject(expectedResult);
});


test('get3DPositions_success', () => {
    const poses = {
        keypoints3D: [{
            name: 'abc',
            x: 123,
            y: 456,
            z: 789,
            score: scoreThreshold + 1
        }]
    }
    const expectedResult = [{
        part: 'abc',
        x: -123,
        y: 456,
        z: 789,
    }]
    expect(get3DPositions(poses)).toMatchObject(expectedResult);
})

test('get3DPositions_withPointsBelowThreshold', () => {
    const poses = {
        keypoints3D: [{
            name: 'abc',
            x: 123,
            y: 456,
            z: 789,
            score: scoreThreshold + 1
        },
        {
            name: 'def',
            x: 234,
            y: 567,
            z: 890,
            score: scoreThreshold - 0.1
        }]
    }
    const expectedResult = [{
        part: 'abc',
        x: -123,
        y: 456,
        z: 789,
    }]
    expect(get3DPositions(poses)).toMatchObject(expectedResult);
});

test('get3DPositions_allPointsBelowThreshold', () => {
    const poses = {
        keypoints3D: [{
            name: 'abc',
            x: 123,
            y: 456,
            z: 789,
            score: 0.2
        },
        {
            name: 'def',
            x: 234,
            y: 567,
            z: 890,
            score: 0.1
        }]
    }
    const expectedResult = {}
    expect(get3DPositions(poses)).toMatchObject(expectedResult);
});
import { dist, calculateAngle, findAngle, findCoord, calcAngles, calcLengths } from '../components/calc'

test('dist_validPoints1', () => {
    const p1 = [0, 0, 1]
    const p2 = [0, 0, 2]
    expect(dist(p1, p2)).toBe(1)
})

test('dist_validPotins2', () => {
    const p1 = [1.5, 2.5, 3.5];
    const p2 = [4.5, 5.5, 6.5];
    expect(dist(p1, p2)).toBeCloseTo(5.19615)
})

test('dist_nullPoint', () => {
    const p1 = [1, 2, 3]
    const p2 = null
    expect(dist(p1, p2)).toBe(-1)
})

test('dist_nullPoints', () => {
    const p1 = null
    const p2 = null
    expect(dist(p1, p2)).toBe(-1)
})

test('findcoord_withMatchingPart', () => {
    const body = [
        { part: 'left_wrist', x: 1, y: 2, z: 3 },
        { part: 'left_elbow', x: 4, y: 5, z: 6 },
        { part: 'left_shoulder', x: 7, y: 8, z: 9 }
    ];
    const p = 'left_elbow';
    expect(findCoord(body, p)).toMatchObject([4, 5, 6])
})

test('findcoord_withoutMatchingPart', () => {
    const body = [
        { part: 'left_wrist', x: 1, y: 2, z: 3 },
        { part: 'left_elbow', x: 4, y: 5, z: 6 },
        { part: 'left_shoulder', x: 7, y: 8, z: 9 }
    ];
    const p = 'test';
    expect(findCoord(body, p)).toBe(null)
})

test('findcoord_withEmptyBody', () => {
    const body = [];
    const p = 'test';
    expect(findCoord(body, p)).toBe(null)
})

test('findAngle_validPoints1', () => {
    const p1 = [0, 0, 1]
    const p2 = [0, 0, 0]
    const p3 = [0, 1, 0]
    expect(findAngle(p1, p2, p3)).toBeCloseTo(90)
})

test('findAngle_validPoints2', () => {
    const p1 = [0, 0, 1]
    const p2 = [0, 0, 0]
    const p3 = [0, 2, 1]
    expect(findAngle(p1, p2, p3)).toBeCloseTo(63.43494882292201)
})

test('findAngle_nullPoints', () => {
    const p1 = null
    const p2 = [0, 0, 0]
    const p3 = [0, 2, 1]
    expect(findAngle(p1, p2, p3)).toBe(NaN)
})

test('calculateAngle_validPoints1', () => {
    const p1 = [0, 0, 1]
    const p2 = [0, 0, 0]
    const p3 = [0, 1, 0]
    expect(calculateAngle('testAngle', [p1, p2, p3]).name).toBe('testAngle')
    expect(calculateAngle('testAngle', [p1, p2, p3]).angle).toBeCloseTo(90)
})

test('calculateAngle_validPoints2', () => {
    const p1 = [1, 1, 1]
    const p2 = [2, 2, 2]
    const p3 = [3, 3, 3]
    expect(calculateAngle('testAngle', [p1, p2, p3]).name).toBe('testAngle')
    expect(calculateAngle('testAngle', [p1, p2, p3]).angle).toBe(180)
})

test('calculateAngle_nullPoints', () => {
    const p1 = null
    const p2 = [0, 0, 0]
    const p3 = [0, 2, 1]
    expect(calculateAngle('testAngle', [p1, p2, p3])).toBe(-1)
})

test('calculateAngle_withOnlyTwoPoints', () => {
    const p1 = [0, 0, 0]
    const p2 = [0, 2, 1]
    expect(calculateAngle('testAngle', [p1, p2])).toBe(-1)
})

test('calcAngles_validPositions', () => {
    const p1 = {
        part: 'left_wrist',
        x: 0,
        y: 0,
        z: 1
    }
    const p2 = {
        part: 'left_elbow',
        x: 0,
        y: 0,
        z: 0
    }
    const p3 = {
        part: 'left_shoulder',
        x: 0,
        y: 1,
        z: 0
    }
    const result = calcAngles([p1, p2, p3])
    expect(result[0].angle).toBeCloseTo(90)
    expect(result[0].name).toBe('left_elbow')
    expect(result.slice(1)).toMatchObject([-1, -1, -1, -1, -1, -1, -1])
})

test('calcAngles_missingPositions', () => {
    const p1 = {
        part: 'left_wrist',
        x: 0,
        y: 0,
        z: 1
    }
    const p2 = {
        part: 'left_elbow',
        x: 0,
        y: 0,
        z: 0
    }

    const result = calcAngles([p1, p2])
    expect(result).toMatchObject([-1, -1, -1, -1, -1, -1, -1, -1])
})

test('calcAngles_emptyPositions', () => {
    const result = calcAngles([])
    expect(result).toMatchObject([-1, -1, -1, -1, -1, -1, -1, -1])
})

test('calcLengthsvalidPositions', () => {
    const p1 = {
        part: 'left_wrist',
        x: 0,
        y: 0,
        z: 1
    }
    const p2 = {
        part: 'left_elbow',
        x: 0,
        y: 0,
        z: 0
    }
    const result = calcLengths([p1, p2])
    expect(result).toMatchObject([{
        from: 'left_elbow',
        to: 'left_wrist',
        length: 1
    }])
})

test('calcLengths_missingPosition', () => {
    const p1 = {
        part: 'left_wrist',
        x: 0,
        y: 0,
        z: 1
    }
    const result = calcLengths([p1])
    expect(result).toMatchObject([])
})

test('calcLengths_emptyPositiona', () => {
    const result = calcLengths([])
    expect(result).toMatchObject([])
})


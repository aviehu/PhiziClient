import { dist, calculateAngle, findAngle, findCoord, calcAngles, calcLengths } from '../components/calc'

test('dist 1', () => {
    const p1 = [0, 0, 1]
    const p2 = [0, 0, 2]
    expect(dist(p1, p2)).toBe(1)
})

test('dist 2', () => {
    const p1 = [0, 2, 0]
    const p2 = [0, 0, 2]
    expect(dist(p1, p2)).toBeCloseTo(2.8284271247461903)
})

test('calculateAngle 1', () => {
    const p1 = [0, 0, 1]
    const p2 = [0, 0, 0]
    const p3 = [0, 1, 0]
    expect(calculateAngle('testAngle', [p1, p2, p3]).name).toBe('testAngle')
    expect(calculateAngle('testAngle', [p1, p2, p3]).angle).toBeCloseTo(90)
})

test('calculateAngle 2', () => {
    const p1 = [0, 0, 1]
    const p2 = [0, 0, 0]
    const p3 = [0, 2, 1]
    expect(calculateAngle('testAngle', [p1, p2, p3]).name).toBe('testAngle')
    expect(calculateAngle('testAngle', [p1, p2, p3]).angle).toBeCloseTo(63.43494882292201)
})

test('findAngle 1', () => {
    const p1 = [0, 0, 1]
    const p2 = [0, 0, 0]
    const p3 = [0, 1, 0]
    expect(findAngle( p1, p2, p3)).toBeCloseTo(90)
})

test('findAngle 2', () => {
    const p1 = [0, 0, 1]
    const p2 = [0, 0, 0]
    const p3 = [0, 2, 1]
    expect(findAngle(p1, p2, p3)).toBeCloseTo(63.43494882292201)
})

test('findcoord 1', () => {
    const body = [{
        part: 'testFindCoord',
        x: 1,
        y: 2,
        z: 3
    }]
    expect(findCoord(body, 'testFindCoord')).toMatchObject([1, 2, 3])
})

test('findcoord 2', () => {
    const body = [{
        part: 'testFindCoord',
        x: 1,
        y: 2,
        z: 3
    }]
    expect(findCoord(body, 'badPart')).toEqual(null)
})

test('calcAngles 1', () => {
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

test('calcAngles 2', () => {
    const result = calcAngles([])
    expect(result).toMatchObject([-1, -1, -1, -1, -1, -1, -1, -1])
})

test('calcLengths 1', () => {
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

test('calcLengths 1', () => {
    const result = calcLengths([])
    expect(result).toMatchObject([])
})
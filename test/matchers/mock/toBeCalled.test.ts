import { toBeCalled } from '../../../src/matchers/mock/toBeCalled'

class TestMock {
    _calls: any[]

    constructor () {
        this._calls = []
    }
    get calls () {
        return this._calls
    }
    abort () { return Promise.resolve() }
    abortOnce () { return Promise.resolve() }
    respond () { return Promise.resolve() }
    respondOnce () { return Promise.resolve() }
    clear () { return Promise.resolve() }
    restore () { return Promise.resolve() }
}

describe('toBeCalled', () => {
    test('wait for success', async () => {
        const mock: WebdriverIO.Mock = new TestMock()
        const result = await toBeCalled(mock)
        expect(result.pass).toBe(false)

        setTimeout(() => {
            mock.calls.push('foo')
            mock.calls.push('foo')
        }, 10)

        const result2 = await toBeCalled(mock)
        expect(result2.pass).toBe(true)
    })

    test('not to be called', async () => {
        const mock: WebdriverIO.Mock = new TestMock()

        // expect(mock).not.toBeCalled() should pass
        const result = await toBeCalled.call({ isNot: true }, mock)
        expect(result.pass).toBe(true)

        mock.calls.push('foo')

        // expect(mock).not.toBeCalled() should fail
        const result4 = await toBeCalled.call({ isNot: true }, mock)
        expect(result4.pass).toBe(false)
    })

    test('message', async () => {
        const mock: WebdriverIO.Mock = new TestMock()

        const result = await toBeCalled(mock)
        expect(result.message()).toContain('Expect mock to be called')

        const result2 = await toBeCalled.call({ isNot: true }, mock)
        expect(result2.message()).toContain('Expect mock not to be called')
    })
})

import { waitUntil, enhanceError, executeCommand, getExpected, updateElementsArray } from '../../utils'

export function toHaveClass(received: WebdriverIO.Element | WebdriverIO.ElementArray, className: string, options: ExpectWebdriverIO.StringOptions = {}) {
    const isNot = this.isNot
    const { expectation = 'class', verb = 'have' } = this

    const attribute = 'class'

    return browser.call(async () => {
        let el = await received
        let attr

        const pass = await waitUntil(async () => {
            const result = await executeCommand(el, condition, options, [attribute, className, options])
            el = result.el
            attr = result.values

            return result.success
        }, isNot, options)

        updateElementsArray(pass, received, el)

        const message = enhanceError(el, getExpected(el, attr, className), attr, this, verb, expectation, '', options)

        return {
            pass,
            message: () => message
        }
    })
}

async function condition(el: WebdriverIO.Element, attribute: string, value: string, options: ExpectWebdriverIO.StringOptions) {
    const { ignoreCase = false, trim = false, containing = false } = options

    let attr = await el.getAttribute(attribute)
    if (typeof attr !== 'string') {
        return { result: false }
    }

    if (trim) {
        attr = attr.trim()
    }
    if (ignoreCase) {
        attr = attr.toLowerCase()
        value = value.toLowerCase()
    }
    if (containing) {
        return {
            result: attr.includes(value),
            value: attr
        }
    }

    const classes = attr.split(' ')

    return {
        result: classes.includes(value),
        value: attr
    }
}

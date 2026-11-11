const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const events = {};
const modalEvents = {};
let clicked, delay, pending, opened = false, focused = false;
const root = { style: { overflow: 'auto' } };
const modal = {
    showModal() { opened = true; },
    close() { opened = false; modalEvents.close(); },
    addEventListener(name, fn) { modalEvents[name] = fn; },
    querySelector() { return { addEventListener(name, fn) { clicked = fn; } }; }
};
vm.runInNewContext(fs.readFileSync(__dirname + '/christmas-promo.js', 'utf8'), {
    Date: { now: () => 0 }, Math,
    document: { getElementById: () => modal, documentElement: root,
        activeElement: { focus() { focused = true; } } },
    window: { addEventListener(name, fn, options) {
        assert.equal(options.once, true); events[name] = fn;
    } },
    setTimeout(fn, ms) { pending = fn; delay = ms; }
});
assert.equal(opened, false);
events.scroll();
assert.equal(delay, 2000);
assert.equal(opened, false);
pending();
assert.equal(opened, true);
assert.equal(root.style.overflow, 'hidden');
clicked();
assert.equal(opened, false);
assert.equal(root.style.overflow, 'auto');
assert.equal(focused, true);
console.log('OK: scroll, delay, open, scroll lock, close and focus restoration');

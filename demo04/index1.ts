import { fromEvent } from './core';
import { JSDOM } from 'jsdom';

const element = new JSDOM(`<div>Hello world</div>`).window.document.querySelector('div');

const source$ = fromEvent(element, 'click');

source$.subscribe(console.log);

setTimeout(() => {
  element.click()
}, 1000)
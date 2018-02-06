import Store from './store.mjs';
import Counter from './counter.mjs'
import CounterDisplay from './counterdisplay.mjs'

(function() {
    
    const store = new Store();

    const counter = new Counter(store, 10);

    const elem = document.getElementById('container');
    const counterDisplay = new CounterDisplay(store, elem);

    counter.start();

})();
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */

/***************************************************************************************************
* BROWSER POLYFILLS
*/
import 'core-js/es6/symbol';
import 'core-js/es6/object';

import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/weak-map';
import 'core-js/es6/set';

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
 import 'classlist.js';  // Run `npm install --save classlist.js`.

/** Evergreen browsers require these. **/
import 'core-js/es6/reflect';


/**
 * Required to support Web Animations `@angular/platform-browser/animations`.
 * Needed for: All but Chrome, Firefox and Opera. http://caniuse.com/#feat=web-animation
 **/
 import 'web-animations-js';  // Run `npm install --save web-animations-js`.



/***************************************************************************************************
 * Zone JS is required by Angular itself.
 */
import 'zone.js/dist/zone';  // Included with Angular CLI.



/***************************************************************************************************
 * APPLICATION IMPORTS
 */

/**
 * Date, currency, decimal and percent pipes.
 * Needed for: All but Chrome, Firefox, Edge, IE11 and Safari 10
 */
// import 'intl';  // Run `npm install --save intl`.
/**
 * Need to import at least one locale-data with intl.
 */
// import 'intl/locale-data/jsonp/en';
import 'mdn-polyfills/Object.assign';
import 'mdn-polyfills/Object.create';
import 'mdn-polyfills/Object.entries';
import 'mdn-polyfills/Array.from';
import 'mdn-polyfills/Array.of';
import 'mdn-polyfills/Array.prototype.find';
import 'mdn-polyfills/Array.prototype.forEach';
import 'mdn-polyfills/Array.prototype.filter';
import 'mdn-polyfills/Array.prototype.findIndex';
import 'mdn-polyfills/Array.prototype.includes';
import 'mdn-polyfills/String.prototype.includes';
import 'mdn-polyfills/String.prototype.repeat';
import 'mdn-polyfills/String.prototype.startsWith';
import 'mdn-polyfills/String.prototype.endsWith';
import 'mdn-polyfills/String.prototype.padStart';
import 'mdn-polyfills/String.prototype.padEnd';
import 'mdn-polyfills/Function.prototype.bind';
import 'mdn-polyfills/NodeList.prototype.forEach';
import 'mdn-polyfills/Element.prototype.closest';
import 'mdn-polyfills/Element.prototype.matches';
import 'mdn-polyfills/MouseEvent';

import 'mdn-polyfills/CustomEvent';
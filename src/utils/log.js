/* global console */
import { hasConsole } from 'config/environment';
import Ractive from 'Ractive';
import noop from 'utils/noop';

var alreadyWarned = {}, log, printWarning, welcome;

if ( hasConsole ) {
	let welcomeMessage = `You're running Ractive <@version@> in debug mode - messages will be printed to the console to help you fix problems and optimise your application.

To disable debug mode, add this line at the start of your app:
  Ractive.DEBUG = false;

To disable debug mode when your app is minified, add this snippet:
  Ractive.DEBUG = /unminified/.test(function(){/*unminified*/});

Get help and support:
  http://docs.ractivejs.org
  http://stackoverflow.com/questions/tagged/ractivejs
  http://groups.google.com/forum/#!forum/ractive-js
  http://twitter.com/ractivejs

Found a bug? Raise an issue:
  https://github.com/ractivejs/ractive/issues

`;

	welcome = () => {
		console.log.apply( console, [ '%cRactive.js: %c' + welcomeMessage, 'color: rgb(114, 157, 52);', 'color: rgb(85, 85, 85);' ] );
		welcome = noop;
	};

	printWarning = ( message, args ) => {
		welcome();

		// extract information about the instance this message pertains to, if applicable
		if ( typeof args[ args.length - 1 ] === 'object' ) {
			let options = args.pop();
			let ractive = options.ractive;

			if ( ractive ) {
				// if this is an instance of a component that we know the name of, add
				// it to the message
				let name;
				if ( ractive.component && ( name = ractive.component.name ) ) {
					message = `<${name}> ${message}`;
				}

				let node;
				if ( node = ( options.node || ( ractive.fragment && ractive.fragment.rendered && ractive.find( '*' ) ) ) ) {
					args.push( node );
				}
			}
		}

		console.warn.apply( console, [ '%cRactive.js: %c' + message, 'color: rgb(114, 157, 52);', 'color: rgb(85, 85, 85);' ].concat( args ) );
	};

	log = function () {
		console.log.apply( console, arguments );
	};
} else {
	printWarning = log = welcome = noop;
}

function format ( message, args ) {
	return message.replace( /%s/g, () => args.shift() );
}

function fatal ( message, ...args ) {
	message = format( message, args );
	throw new Error( message );
}

function logIfDebug () {
	if ( Ractive.DEBUG ) {
		log.apply( null, arguments );
	}
}

function warn ( message, ...args ) {
	message = format( message, args );
	printWarning( message, args );
}

function warnOnce ( message, ...args ) {
	message = format( message, args );

	if ( alreadyWarned[ message ] ) {
		return;
	}

	alreadyWarned[ message ] = true;
	printWarning( message, args );
}

function warnIfDebug () {
	if ( Ractive.DEBUG ) {
		warn.apply( null, arguments );
	}
}

function warnOnceIfDebug () {
	if ( Ractive.DEBUG ) {
		warnOnce.apply( null, arguments );
	}
}

export { fatal, log, logIfDebug, warn, warnOnce, warnIfDebug, warnOnceIfDebug, welcome };

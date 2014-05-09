import runloop from 'global/runloop';

export default function Element$teardown ( destroy ) {
	var eventName, binding, bindings;

	// Detach as soon as we can
	if ( destroy ) {
		this.willDetach = true;
		runloop.detachWhenReady( this );
	}

	// Children first. that way, any transitions on child elements will be
	// handled by the current transitionManager
	if ( this.fragment ) {
		this.fragment.teardown( false );
	}

	while ( this.attributes.length ) {
		this.attributes.pop().teardown();
	}

	if ( binding = this.binding ) {
		this.binding.unrender();

		this.node._ractive.binding = null;
		bindings = this.root._twowayBindings[ binding.keypath ];
		bindings.splice( bindings.indexOf( binding ), 1 );
	}

	if ( this.node ) {
		for ( eventName in this.node._ractive.events ) {
			this.node._ractive.events[ eventName ].teardown();
		}
	}

	if ( this.decorator ) {
		this.decorator.teardown();
	}

	// Outro, if necessary
	if ( this.outro ) {
		runloop.addOutro( this.outro );
	}

	// Remove this node from any live queries
	if ( this.liveQueries ) {
		removeFromLiveQueries( this );
	}
}

function removeFromLiveQueries ( element ) {
	var query, selector, i;

	i = element.liveQueries.length;
	while ( i-- ) {
		query = element.liveQueries[i];
		selector = query.selector;

		query._remove( element.node );
	}
}

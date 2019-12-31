import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({  
	selector: 'facets', 	
	templateUrl: './facets.component.html',
	providers: [ ],
	animations: [    	
		trigger('facetFadeInOut', [
			state('load', style({ height: "0px", display: "none" })),
			state('in', style({ height: "0px", display: "none" })),
			state('out', style({ height: "*", display: "block" })),
			transition("in => out", animate(200)),
			transition("out => in", animate(200)),
			transition("out => load", animate(200)),
			transition("load => out", animate(200))
		])
	]
})

export class FacetsComponent {			
	@Input() facetParameters: string;
	@Input() facetsIn: Object;
	@Input() i18n: any;	
	@Input() apiLanguage: string;
	@Output() selectedFacets = new EventEmitter<any>();
	@Output() outParameters = new EventEmitter<string>();

	facets: any = [];
	collapseFacets: any[] = [];
	limitFacets: any[] = [];
	selectedFacetItems: any[];
	seeMore: string = 'SeeMore';
	seeLess: string = 'SeeLess';
	i18nValues: any;
	placeholder: string;	
	locale: string;	
	
	ngOnChanges() {				
        this.facets = this.facetsIn;                 
        this.i18nValues = this.i18n == undefined ? '' : this.i18n;
        this.selectedFacetItems = [];

        if(this.facetParameters !== undefined) {         	       
			let parameters = this.facetParameters.split('&');
			parameters = parameters.filter(function(entry) { return entry.trim() != ''; });						
						
			for(let i=0; i < parameters.length; i++) {
				let key = parameters[i].split('=')[0];
				let value = parameters[i].split('=')[1];
				
				if (value != '') {
					if (parameters[i].indexOf('lang_exact=') === -1) {
						let param = value.replace('%26', '&');
						this.selectedFacetItems[key] = param.split('+').join(' ');
					} else {						
						this.selectedFacetItems[key] = value;
					}	
				}								
			}					
		}

		if (this.facets != undefined) {
			this.selectedFacetItems = this.facets.length == 0 ? [] : this.selectedFacetItems;
		}		
		this.selectedFacets.emit(this.selectedFacetItems); 
		this.locale = this.apiLanguage.split('=')[1];
		this.placeholder = this.locale == 'en' ? 'Search' : '';
    }

   	public onCollapse(index) {
		let i = this.collapseFacets.indexOf(index, 0);
		if (i > -1) {
		   this.collapseFacets.splice(i, 1);
		} else {
			this.collapseFacets.push(index);
		}				
    };

	public onSeeMore(index) {
		this.limitFacets.push(index);		
    };

	public onSeeLess(index) {
		let i = this.limitFacets.indexOf(index, 0);
		if (i > -1) {
		   this.limitFacets.splice(i, 1);
		}				
    };

    public onSelectFacetItem(facet, itemName) {
    	this.limitFacets = [];
    	this.selectedFacetItems[facet.trim()] = itemName.trim();
    	itemName = itemName.replace('&', '%26');
    	if(this.facetParameters === undefined || this.facetParameters === '') {    		
    		this.outParameters.emit(facet.trim() + '=' + itemName.split(' ').join('+'));
    	} else {
    		let modifiedUrl = this.removeURLParameter(this.facetParameters, facet);    		
    		
    		if (modifiedUrl === '') {
				this.outParameters.emit(modifiedUrl + facet.trim() + '=' + itemName.split(' ').join('+'));
    		} else {
    			if( modifiedUrl.charAt( 0 ) === '&' )
    				modifiedUrl = modifiedUrl.slice( 1 );
    			this.outParameters.emit(modifiedUrl + '&' + facet.trim() + '=' + itemName.split(' ').join('+'));
    		}    		
    	}    	
    	this.selectedFacets.emit(this.selectedFacetItems);     		
    };
	
	public onDeselectFacetItem(facet) {
		this.limitFacets = [];
		if(this.selectedFacetItems.hasOwnProperty(facet)) {			
			delete this.selectedFacetItems[facet];
		}				
		this.outParameters.emit(facet + '=');
		this.selectedFacets.emit(this.selectedFacetItems); 
	}
	
	public removeURLParameter(url, parameter) {		
		var prefix = encodeURIComponent(parameter) + '=';
		var pars= url.split(/[&;]/g);
		
		for (var i= pars.length; i-- > 0;) {    
			if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
				pars.splice(i, 1);
			}
		}
		return pars.join('&');					
	}
}

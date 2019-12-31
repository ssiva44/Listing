import { Component, ElementRef, Inject, HostListener, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

declare function analyticParams(searchFilters: any, searchTerm: any, searchResults: any, sortBy: any): any;
declare var require: any;
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [ ],
	animations: [
    	trigger('fadeInOut', [
      		transition('void => *', [style({opacity:0}), animate(500, style({opacity:1}))]),
      		transition('* => void', [animate(500, style({opacity:0}))])
    	]),		
  	]	
})

export class AppComponent {
	onLoad: boolean = false;
	loading: boolean;
	imagePath: string;
	url: string;
	title: string;	
	inputUrl: string;
	locales: any;
	searchIn: string;
	host: string;
	inputParameters: string;	
	allFacets: string;
	selectedFacets: any = {};
	excludedLanguages: string[] = [];
	isFacetsCollapsed: boolean = false;
	isCollapsed: boolean = true;
	selectedFacetItems: any[] = [];
	languageExact: string;
	apiLanguage: string;
	dateFormates: any = {};	
	monthNames: any;
	localeAndDateFormat: any = {};
	displayParameters: string;
	facetParameters: string;
	startDateParameters: string;
	endDateParameters: string;
	queryParameter: string;	
	timeframeParameter: string;	
	localeUrlParameter: string;
	facets: any;
	filter: string;
	clearAll: string;		
	refineBy: string = 'RefineBy';		
	i18n: any;
	rows: number;
	showingResults: string = 'ShowingResults';
	showingFrom: number;
	showingTo: number;
	total: number;
	wcmMode: string;
	localeUrl: string = '//wb-stage62.adobecqms.net/wbg/aem/service/i18nservice.html?';
	keys: string = '&keys=Today,Past7Days,PastMonth,PastYear,RefineBy,TimeFrame,SpecificDateRange,StartDate,EndDate,SeeMore,SeeLess,SortBy,ShowingResults,Date,addtocalendar,Upcoming,Past,BestMatch,job_title,alphabetical,NoResultsMsgFuture,NoResultsMsgPast';
	sideBarArrow: string;
	isScrollToTop: boolean = false;	
	isLoadMore: boolean;
	isClearAll: boolean;
	i18nFilter: any;
	i18nClearAll: any;
	
	constructor(private element: ElementRef, private ref: ChangeDetectorRef) {	
		//console.log('on load ' + new Date);			
		this.wcmMode = 'wcmmode=disabled';
		this.excludedLanguages = ['Arabic', 'Chinese', 'English', 'French', 'Russian', 'Spanish'];		
		this.dateFormates = { 
			//'ar' : 'YYYY/MM/DD', 
            'bg' : 'D MMMM, YYYY', 
            'de' : 'DD MMM YYYY',
            'en' : 'MMMM DD, YYYY',
            'es' : 'MMMM DD, YYYY',
            //'fa' : 'MMM DD, YYYY',
            'fr' : 'DD MMMM YYYY',
            //'hi' : 'DD MMMM, YYYY',
            'id' : 'D MMMM YYYY',
            'ja' : 'YYYY年M月D日',
            'km' : 'D MMMM YYYY',
            //'mk' : 'DD MMMM YYYY',
            'ta' : 'D MMMM YYYY',
            'mn' : 'YYYY.M.DD',
            'pl' : 'DD MMMM YYYY',
            //'ps' : 'MMM DD, YYYY',
            'ro' : 'DD MMMM YYYY',
            'ru' : 'D MMMM YYYY',
            'sq' : 'DD MMMM YYYY',
            'th' : 'D MMMM YYYY',
            'tr' : 'DD MMMM YYYY',
            'sr' : 'DD MMMM YYYY',
            'si' : 'DD MMMM YYYY',
            'uk' : 'D MMMM, YYYY',
            'zh' : 'YYYY年M月D日',
            'hy-am' : 'MMMM DD, YYYYթ',
            'hr' : 'YYYY MMMM DD',
            'ko' : 'YYYY MMMM Do',
            'lo' : 'Do MMMM YYYY'
            //'vi' : 'MMM DD, YYYY'
		}
		this.i18nFilter = { 'fr': 'filtre', 'ru': 'Фильтр', 'es': 'filtrar', 'zh': '过滤', 'ar': 'منقي' };
		this.i18nClearAll = { 'fr': 'Clair Tout', 'ru': 'Очистить Все', 'es': 'Claro Todas', 'zh': '明确 所有', 'ar': 'واضح الكل' };		
		this.showingFrom = 1;
		this.loading = true;
        this.imagePath = this.element.nativeElement.getAttribute('imagePath');
        this.inputUrl = this.element.nativeElement.getAttribute('url');
        this.title = this.element.nativeElement.getAttribute('pageTitle');        
        this.locales = JSON.parse(this.element.nativeElement.getAttribute('locale'));
        this.searchIn = this.element.nativeElement.getAttribute('searchIn');            

        if (this.inputUrl != '' && this.inputUrl != ' ') {        	
        	let urlSplit = this.inputUrl.split('?');
	        this.host = urlSplit[0];	        
			this.inputParameters = urlSplit[1];	 
			
	        this.allFacets = this.getParameterByName('fct', this.inputUrl);
	        if (this.allFacets != null) {
	        	let allFacetsSplit = this.allFacets.split(',');
	        	for(let i=0; i < allFacetsSplit.length; i++) {	        		
	        		if (this.getParameterByName(allFacetsSplit[i], this.inputUrl) != null) {
	        			this.selectedFacets[allFacetsSplit[i]] = this.getParameterByName(allFacetsSplit[i], this.inputUrl);	
	        		}
	        	}
	        }

	        this.rows = Number(this.getParameterByName('rows', this.inputUrl));	        
	        this.languageExact = this.getParameterByName('lang_exact', this.inputUrl) == null ? 'lang_exact=English' : 'lang_exact=' + this.getParameterByName('lang_exact', this.inputUrl);
	        this.apiLanguage = this.getParameterByName('apilang', this.inputUrl) == null ? 'apilang=en' : 'apilang=' + this.getParameterByName('apilang', this.inputUrl);	        	        
	        
	        let currentUrl = window.location.href;
	        let searchParameters = currentUrl.split('?');

	        if(searchParameters[1] === undefined || searchParameters[1] === '') {	        		      
	        	this.facetParameters = this.languageExact;       	
				//this.displayParameters = this.languageExact;
				this.displayParameters = '';
		    	this.inputParameters = this.removeURLParameter(this.inputParameters, this.languageExact.split('=')[0]);
				this.selectedFacetItems['lang_exact'] = this.getParameterByName('lang_exact', this.inputUrl) == null ? 'English' : this.getParameterByName('lang_exact', this.inputUrl);				
		    } else {		    	   			    			    			    	  
		    	if (searchParameters[1].indexOf(this.wcmMode) !== -1) {
		        	searchParameters[1] = this.removeURLParameter(searchParameters[1], this.wcmMode.split('=')[0]);
		        }
		        if (searchParameters[1].indexOf('cq_ck=') !== -1) {
		        	searchParameters[1] = this.removeURLParameter(searchParameters[1], 'cq_ck');
		        }

		       	let searchParameter = searchParameters[1].split('&');
		       	searchParameter = searchParameter.filter(function(entry) { return entry.trim() != ''; });

		       	for(let i=0; i < searchParameter.length; i++) {		       		
			       	if (this.allFacets.indexOf(searchParameter[i].split('=')[0]) !== -1) {
						if (searchParameter[i].indexOf('lang_exact=') !== -1) {													
							this.languageExact = searchParameter[i];
						}
						this.facetParameters = this.facetParameters === undefined ? searchParameter[i] : this.facetParameters + '&' + searchParameter[i];
						this.selectedFacetItems[searchParameter[i].split('=')[0]] = (searchParameter[i].split('=')[1]).split('+').join(' ');
					} else if (searchParameter[i].indexOf('strdate=') !== -1) {									
						this.startDateParameters = searchParameter[i];
					} else if (searchParameter[i].indexOf('enddate=') !== -1) {									
						this.endDateParameters = searchParameter[i];
					} else if (searchParameter[i].indexOf('qterm=') !== -1) {									
						this.queryParameter = searchParameter[i];
					} else if (searchParameter[i].indexOf('tf=') !== -1) {									
						this.timeframeParameter = searchParameter[i];
					}			
					this.inputParameters = this.removeURLParameter(this.inputParameters, searchParameter[i].split('=')[0]);										
				}
				
				if (searchParameters[1].indexOf('futureevents=') !== -1 || searchParameters[1].indexOf('pastevents=') !== -1) {
					this.displayParameters = searchParameters[1];
				} else {
					if (searchParameters[1].indexOf('lang_exact=') === -1) {
						this.displayParameters = this.languageExact + '&' + searchParameters[1];
					} else {
						this.displayParameters = searchParameters[1];
					}					
				}				
	        }

			this.inputParameters = this.removeURLParameter(this.inputParameters, 'apilang');	
	        this.inputParameters = this.removeURLParameter(this.inputParameters, 'lang_exact');
			
	        if (this.facetParameters === undefined) 
	        	this.facetParameters = this.languageExact;
	        else 
	        	this.facetParameters = this.facetParameters.indexOf('lang_exact=') === -1 ? this.facetParameters + '&' + this.languageExact : this.facetParameters;

	        this.apiLanguage = 'apilang=' + (this.locales[this.languageExact.split('=')[1]] === undefined ? 'en' : this.locales[this.languageExact.split('=')[1]]);
			if (this.displayParameters.indexOf('lang_exact=') === -1) {
				if (this.displayParameters == '') {
					this.url = this.host + '?' + this.inputParameters + '&' + this.apiLanguage + '&' + this.languageExact;		
				} else {
					this.url = this.host + '?' + this.inputParameters + '&' + this.apiLanguage + '&' + this.languageExact + '&' + this.displayParameters;		
				}
			} else {
				this.url = this.host + '?' + this.inputParameters + '&' + this.apiLanguage + '&' + this.displayParameters;        				
			}				
			//console.log('init---' + this.url);	        
			
	        this.localeUrlParameter = this.localeUrl + this.apiLanguage;	        	       				
			
			let locale = this.apiLanguage.split('=')[1];			
			this.localeAndDateFormat = {
				'locale' : locale,
				'format' : this.dateFormates[locale] === undefined ? 'DD MMMM YYYY' : this.dateFormates[locale]				
			}
			
			this.filter = this.i18nFilter.hasOwnProperty(locale) ? this.i18nFilter[locale] : 'Filter';
			this.clearAll = this.i18nClearAll.hasOwnProperty(locale) ? this.i18nClearAll[locale] : 'Clear All';
			this.sideBarArrow = locale == 'ar' ? 'fa fa-angle-right' : 'fa fa-angle-left';			
        } 		
    } 

	public updateParameter(parameter: any) {		
		//console.log('on click ' + new Date);
		this.onLoad = true;		
		this.loading = true;								     
		if (this.displayParameters == '' || this.displayParameters == ' ') {			
			if (parameter.indexOf('lang_exact=') === -1) {
				this.displayParameters = this.languageExact + '&' + parameter;
			} else {
				this.displayParameters = parameter;
			}	
			
			if (parameter.indexOf('lang_exact=') !== -1) 
				this.languageExact = 'lang_exact=' + this.getParameterByName('lang_exact', '?' + parameter);										
			else if (parameter.indexOf('tf=') !== -1)
				this.timeframeParameter = parameter;
			else if(parameter.indexOf('strdate=') !== -1 && parameter.indexOf('strdate=') !== -1) {
				let params = parameter.split('&');					
				params = params.filter(function(entry) { return entry.trim() != ''; });						
				this.startDateParameters = params[0];
				this.endDateParameters = params[1];
			}
			
			if (this.allFacets.indexOf(parameter.split('=')[0]) !== -1) 
				this.facetParameters = parameter;
		} else {			
			if (parameter.indexOf('qterm=') !== -1) {				
				if (this.getParameterByName('lang_exact', this.url) != null) {					
					this.languageExact = 'lang_exact=' + this.getParameterByName('lang_exact', this.url);						
					this.facetParameters = this.languageExact;
					this.displayParameters = this.languageExact + '&' + parameter;
				} else {
					this.displayParameters = parameter;	
				}
				let urlSplit = this.inputUrl.split('?');				
				this.inputParameters = urlSplit[1];	
				this.inputParameters = this.removeURLParameter(this.inputParameters, 'apilang');
				this.inputParameters = this.removeURLParameter(this.inputParameters, 'lang_exact');
			} else {							
				if (parameter.indexOf('&') === -1) {							
					if (parameter.split('=')[1] == '') {
						if(this.selectedFacets.hasOwnProperty(parameter.split('=')[0])) {						
							if (parameter.indexOf('lang_exact=') !== -1) {
								this.languageExact = parameter;							
							} else {
								this.inputParameters = this.inputParameters + '&' + parameter.split('=')[0] + '=' + this.selectedFacets[parameter.split('=')[0]];	
							}						
						}

						if (parameter.indexOf('lang_exact=') !== -1) {
							this.displayParameters = this.removeURLParameter(this.displayParameters, parameter.split('=')[0]) + '&' + parameter;					
							this.facetParameters = this.removeURLParameter(this.facetParameters, parameter.split('=')[0]) + '&' + parameter;
						} else {
							this.displayParameters = this.removeURLParameter(this.displayParameters, parameter.split('=')[0]);					
							this.facetParameters = this.removeURLParameter(this.facetParameters, parameter.split('=')[0]);									
						}																														
					} else {				
						let modifiedUrl = this.displayParameters;
						if (parameter.indexOf('futureevents') !== -1 || parameter.indexOf('pastevents') !== -1) {							
							modifiedUrl = modifiedUrl.indexOf('futureevents') === -1 ? modifiedUrl : this.removeURLParameter(modifiedUrl, 'futureevents');
							modifiedUrl = modifiedUrl.indexOf('pastevents') === -1 ? modifiedUrl : this.removeURLParameter(modifiedUrl, 'pastevents');							
						}  

						if (parameter.indexOf('srt=') !== -1) 							
							modifiedUrl = this.removeURLParameter(modifiedUrl, 'srt');
						if (parameter.indexOf('lang_exact=') !== -1) 							
							modifiedUrl = this.removeURLParameter(modifiedUrl, 'lang_exact');							
															
				    	this.displayParameters = modifiedUrl + '&' + parameter;
				    	
				    	if (this.allFacets.indexOf(parameter.split('=')[0]) !== -1) 
							this.facetParameters = parameter;			    				    																											  													    					
					}
					if (parameter.indexOf('tf=') !== -1)
						this.timeframeParameter = parameter;
					if (parameter.indexOf('lang_exact=') !== -1) 
						this.languageExact = parameter;					
				} else {					
					if (parameter.indexOf(this.languageExact.split('=')[0] + '=') === -1) {						
						let params = parameter.split('&');					
						params = params.filter(function(entry) { return entry.trim() != ''; });						
						this.startDateParameters = params[0];
						this.endDateParameters = params[1];

						if(this.displayParameters.indexOf('strdate=') !== -1) 		
							this.displayParameters = this.removeURLParameter(this.displayParameters, 'strdate=');				        

				        if(this.displayParameters.indexOf('enddate=') !== -1) 					
							this.displayParameters = this.removeURLParameter(this.displayParameters, 'enddate=');				        				        				   
					} else {					
						let params = parameter.split('&');					
						params = params.filter(function(entry) { return entry.trim() != ''; });
						
						for(let i=0; i < params.length; i++) {						
							this.displayParameters = this.removeURLParameter(this.displayParameters, params[i].split('=')[0]);
							this.inputParameters = this.removeURLParameter(this.inputParameters, params[i].split('=')[0]);

							if (params[i].split('=')[0] == 'lang_exact') 
								this.languageExact = params[i];														
						}			

						if (parameter.indexOf(this.languageExact.split('=')[0]) === -1) 				
							parameter = parameter + '&' + this.languageExact.split('=')[0] + '=';								

						this.facetParameters = parameter;					
					}				
					if (this.displayParameters == '' || this.displayParameters === undefined)	
						this.displayParameters = parameter;
					else 
						this.displayParameters = this.displayParameters + (parameter == '' ? '' : '&' + parameter);								
				}
			}							
			this.inputParameters = this.removeURLParameter(this.inputParameters, 'rows') + '&rows=' + this.rows;				
			if( this.displayParameters.charAt( 0 ) === '&' )
				this.displayParameters = this.displayParameters.slice( 1 );
		}
		
		this.inputParameters = this.removeURLParameter(this.inputParameters, 'apilang');
		this.apiLanguage = 'apilang=' + (this.locales[this.languageExact.split('=')[1]] === undefined ? 'en' : this.locales[this.languageExact.split('=')[1]]);		
		this.localeUrlParameter = this.localeUrl + this.apiLanguage;
		
		let displayUrl = window.location.href;
		let displayUrlSplit = displayUrl.split('?');
		this.url = this.host + '?' + this.inputParameters + '&' + this.apiLanguage + (this.displayParameters == '' ? this.displayParameters : '&' + this.displayParameters);
		//console.log('update---' + this.url); 
		window.history.pushState('', '', displayUrlSplit[0] + (this.displayParameters == '' ? this.displayParameters : '?' + this.displayParameters));		
		
		let locale = this.apiLanguage.split('=')[1];			
		this.localeAndDateFormat = {
			'locale' : locale,
			'format' : this.dateFormates[locale] === undefined ? 'DD MMMM YYYY' : this.dateFormates[locale]
		}	
		this.filter = this.i18nFilter.hasOwnProperty(locale) ? this.i18nFilter[locale] : 'Filter';
		this.clearAll = this.i18nClearAll.hasOwnProperty(locale) ? this.i18nClearAll[locale] : 'Clear All';
		this.sideBarArrow = locale == 'ar' ? 'fa fa-angle-right' : 'fa fa-angle-left';			
	}

	public updatedValues(value: any) {			
		this.i18n = value.i18n;
		this.facets = value.facets;
		this.total = value.total;
		this.showingTo = value.showingTo;
		this.isLoadMore = value.isLoadMore;
		this.loading = false;	
		
		if (this.onLoad) {			
			let qterm = this.getParameterByName('qterm', this.url);
			let srt = this.getParameterByName('srt', this.url);
			let sterm = qterm == null ? '' : qterm; 
			let sresults = this.total;
			let sortby = '';		
			
			if (this.searchIn == 'all_experts') {
				if (sterm == '') {
					if (srt == 'job_title')
						sortby = 'jobtitle';
					else 
						sortby = 'alphabetical'								
				} else {
					if (srt == null) {
						sortby = 'best match';
					} else {
						if (srt == 'surname') 
							sortby = 'alphabetical';
						else if (srt == 'job_title') 
							sortby = 'jobtitle';
						else
							sortby = 'best match';
					}				 
				}			
			} else if (this.searchIn == 'all_events') {
				if (sterm == '') {
					if (this.url.indexOf('pastevents') !== -1)
						sortby = 'past';
					else 
						sortby = 'upcoming';								
				} else {
					if (srt == null) 
						sortby = 'best match';
					else 
						sortby = srt == 'score' ? 'best match' : srt;
				}
			} else {
				if (sterm == '') {
					sortby = 'date'
				} else {
					if (srt == null) 
						sortby = 'best match';
					else 
						sortby = srt == 'score' ? 'best match' : srt;				
				}
			}			
			analyticParams(this.displayParameters, sterm, sresults, sortby);
		}		
		this.ref.detectChanges();
	}	

	public updateIsCollapsed(collapse: any) {			
		this.isCollapsed = collapse;
	}	

	@HostListener("window:scroll", [])
	onScroll(): void {	
		if (window.scrollY > 50) {
	        this.isScrollToTop = true;
	    } else {
	    	this.isScrollToTop = false;
	    }
	}

	public onScrollToTop() {
		window.scrollTo(0, 0);		
	}

	public onScrollToLoadMore() {
		document.getElementById('loadMore1').scrollIntoView(true);
	}	

	public loadMore() {	
		this.loading = true;		
        let numberOfRows = this.rows + Number(this.getParameterByName('rows', this.url));
        let modifiedUrl = this.removeURLParameter(this.url, 'rows');
        this.url = modifiedUrl + '&rows=' + numberOfRows;                
    }

    public updateFacetsCollapsed(facetsCollapsed: any) {    	
    	this.isFacetsCollapsed = facetsCollapsed;
    	this.sideBarArrow = this.sideBarArrow == 'fa fa-angle-left' ? 'fa fa-angle-right' : 'fa fa-angle-left';		
    }
	
	public onClearAll() {		
		let modifiedUrl = this.url;			
		this.timeframeParameter = 'tf=';
		this.queryParameter = 'qterm='
		this.startDateParameters = 'strdate=';
		this.endDateParameters = 'enddate=';
		
		let apilang = this.getParameterByName('apilang', this.inputUrl);		
		let lang_exact = this.getParameterByName('lang_exact', this.inputUrl);
		this.apiLanguage = 'apilang=' + (apilang == null ? 'en' : apilang);
		this.languageExact = 'lang_exact=' + (lang_exact == null ? 'English' : lang_exact);		
		this.displayParameters = this.facetParameters = this.languageExact;		 

		let urlSplit = this.inputUrl.split('?');
        let host = urlSplit[0];        
	    this.inputParameters = urlSplit[1];
		this.inputParameters = this.removeURLParameter(this.inputParameters, 'apilang');	
		this.inputParameters = this.removeURLParameter(this.inputParameters, 'lang_exact');		
		this.url = host + '?' + this.inputParameters + '&' + this.apiLanguage + '&' + this.languageExact;
		this.localeUrlParameter = this.localeUrl + this.apiLanguage;
		let locale = this.apiLanguage.split('=')[1];
		this.filter = this.i18nFilter.hasOwnProperty(locale) ? this.i18nFilter[locale] : 'Filter';
		this.clearAll = this.i18nClearAll.hasOwnProperty(locale) ? this.i18nClearAll[locale] : 'Clear All';
		if (this.url === modifiedUrl) {
			this.loading = false;	
		} else {
			this.loading = true;
		}
		
		let displayUrl = window.location.href;
		let displayUrlSplit = displayUrl.split('?');
		window.history.pushState('', '', displayUrlSplit[0]);
	}

	public getParameterByName(name, url) {	    
	    name = name.replace(/[\[\]]/g, '\\$&');
	    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, ' '));
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
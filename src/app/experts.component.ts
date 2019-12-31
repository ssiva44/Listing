import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CacheService, CacheStoragesEnum } from 'ng2-cache';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable,forkJoin } from 'rxjs';
import 'rxjs';

@Component({  
	selector: 'experts', 	
	templateUrl: './experts.component.html',
	providers: [ CacheService ]
})

export class ExpertsComponent {
	@Input() url: string;		
	@Input() localeUrlParameter: string;	
	@Input() allFacets: string;		
	@Input() keys: string;
	@Input() localeAndDateFormat: any;	
	@Input() excludedLanguages: string[];
	
	@Output() finalResponse = new EventEmitter<any>();
	@Output() outParameters = new EventEmitter<string>();
	
	apiResponse: any;
	documents: any[];
	facetsResponse: any;	
	noData: string;
	sortBy: string = 'SortBy';
	bestMatch: string = 'BestMatch';
	alphabetical: string = 'alphabetical';	
	jobTitle: string = 'job_title';
	language: string = 'lang_exact';
	srt: string;
	isSearch: boolean = false;
	isSrt: boolean = true;
	i18n: any;
	noImagesPath: string[] = []; 

	constructor(private http: HttpClient, private cacheService: CacheService) {}

	ngOnChanges() {	            
        this.getData(this.url); 	                     
    }	
	
	getData = function(url: string) {
		let i18nUrl = this.localeUrlParameter + this.keys + ',' + this.allFacets;				  		
		let numberOfRows = Number(this.getParameterByName('rows', url));
		let languageExact = this.getParameterByName('lang_exact', url);
		let qterm = this.getParameterByName('qterm', this.url);
		url = url.slice(-1) == '&' ? url.slice(0, -1) : url;

        this.isSrt = this.getParameterByName('srt', this.url) == '' ? false : true;

        if (qterm == null || qterm == '') {
			url = url.indexOf('srt=') === -1 ? url + '&srt=surname' : url;			
			url = url + '&order=asc';
			this.srt = this.getParameterByName('srt', url);
			this.isSearch = false;
		} else {			
			url = url.indexOf('srt=') === -1 ? url + '&srt=score' : url;
			url = url + '&order=desc';
			this.srt = this.getParameterByName('srt', url);
			this.isSearch = true;			
		}
		
		let apiCall = null, i18nCall = null;
		let apiCache = this.cacheService.get(url);
		let i18nCache = this.cacheService.get(i18nUrl);		
							
		if (apiCache != null && i18nCache != null) {			
			apiCall = apiCache;
			i18nCall = i18nCache;						
		} else if (apiCache != null) {			
			apiCall = apiCache;
			i18nCall = this.http.post(i18nUrl, '').map((response: Response) =>{
				console.log('i18n ' + new Date);
				this.cacheService.set(i18nUrl, [response.json()]);
				return response.json();
			});
		} else if (i18nCache != null) {							
			apiCall = this.http.post(url, '').map((response: Response) => {
				console.log('api ' + new Date);
				this.cacheService.set(url, [response.json()]);
				return response.json();
			});
			i18nCall = i18nCache;
		} else {			
			apiCall = this.http.post(url, '').map((response: Response) => {
				console.log('api ' + new Date);
				this.cacheService.set(url, [response.json()]);
				return response.json();
			});
			i18nCall = this.http.post(i18nUrl, '').map((response: Response) =>{
				console.log('i18n ' + new Date);
				this.cacheService.set(i18nUrl, [response.json()]);
				return response.json();
			});	
		}	

		forkJoin([apiCall, i18nCall]).subscribe(combinedValues => {			
			const [ apiResponse , i18nResponse ] = combinedValues;			
			this.apiResponse = apiResponse;
			this.i18n = i18nResponse;
			this.facetsResponse = this.apiResponse.documents.facets;
			let total = this.apiResponse.total;													
			let showingTo, isLoadMore, facets = [];
			
			if (Object.keys(this.facetsResponse).length == 0) {
				showingTo = 0;
				isLoadMore = false;	
				this.http.post(this.localeUrlParameter + '&keys=NoResultsMsg', '')
					.map((res: Response) => res.text()).subscribe((response)=> {
					this.noData = response.trim().split(':')[1].slice(1).slice(0, -8) + '</a>';																							    						        
				});				
			} else {																											 																				
				for (let facetName in this.facetsResponse) {				
					let facetItems = [];									
					for (let facetItemKey in this.facetsResponse[facetName]) {							
						facetItems.push(this.facetsResponse[facetName][facetItemKey]);
					}											
					facets.push({facetName: facetName, facetItems: facetItems});
				}

				delete this.apiResponse.documents.facets;
				let documents = [];

				Object.keys(this.apiResponse.documents).forEach( key => {	
					documents.push(this.apiResponse.documents[key]);					
				});									
				this.documents = documents;		
				showingTo = numberOfRows >= total ? total : numberOfRows													
				isLoadMore = numberOfRows >= total ? false : true;											
			}							
			this.finalResponse.emit({ i18n: this.i18n, facets: facets, total: total, showingTo: showingTo, isLoadMore: isLoadMore, loading: false});		
		});	 
				
	}

	public getSortBy(event) {    	     	
    	this.outParameters.emit(event);
    }

    public getParameterByName(name, url) {	    
	    name = name.replace(/[\[\]]/g, '\\$&');
	    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}      
}

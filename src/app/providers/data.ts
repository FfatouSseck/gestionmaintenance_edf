import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class Data {

    plants: any;

    constructor(public http: Http) {

        this.plants = [
            {code: '2ARA',desc: 'Arnprior A - Gen',state: 'unchecked'},
            {code: '2ARB',desc: 'Arnprior B - Gen',state: 'unchecked'},
            {code: '2BCB',desc: 'Bobcat Bluff Wind Project, LLC',state: 'unchecked'},
            {code: '2CFL',desc: 'Chestnut Flats Lessee, LLC',state: 'checked'},
            {code: '2GRA',desc: 'Granit (ext of St Robert) GEN',state: 'unchecked'},
            {code: '2HER',desc: 'TX Hereford Wind, LLC',state: 'unchecked'}
        ]

    }

    filterItems(searchTerm){

        return this.plants.filter((plant) => {
            return plant.desc.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });     

    }

}

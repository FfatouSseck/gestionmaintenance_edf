import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IPlant } from '../interfaces/plant.interface';

@Injectable()
export class Data {

    plants:IPlant[];

    constructor(public http: Http) {

        this.plants = [];

    }

    setPlants(plts): boolean{
        let done = false;
        for(let i=0;i<plts.length;i++){
            this.plants.push({
                Plant: plts[i].Plant,
                PlantDescr: plts[i].PlantDescr,
                state: "unchecked"
            });
        }

        if(this.plants.length>0) done=true;
        return done;

    }

    plantsAvailable():boolean{
        let available = false;

        if(this.plants.length>0){
            available = true;
        }
        return available;
    }

    filterItems(searchTerm){

        return this.plants.filter((plant) => {
            return (plant.PlantDescr.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || plant.Plant.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 );
        });     

    }

}

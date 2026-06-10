import {makeAutoObservable} from "mobx";

export default class ClothStore{
    constructor(){
        this._types = []
        this._brands = []
        this._cloths = []
        this._selectedType = null;
        this._selectedBrand = null;
        this._page = 1;
        this._totalCount = 0;
        this._limit = 6;
        this._minPrice = '';
        this._maxPrice = '';
        this._sort = 'newest';
        this._loading = false;
        makeAutoObservable(this)
    }

    setTypes(types){
        this._types = types
    }
    setBrands(brands){
        this._brands = brands
    }
    setCloths(cloths){
        this._cloths = cloths
    }
    setSelectedType(type) {
        this.setPage(1)
        this._selectedType = type
    }
    setSelectedBrand(brand) {
        this.setPage(1)
        this._selectedBrand = brand
    }
    setTotalCount(count) {
        this._totalCount = count
    }
    setPage(page) {
        this._page = page
    }
    setLimit(limit) {
        this._limit = limit
    }
    setMinPrice(val) {
        this._minPrice = val
        this.setPage(1)
    }
    setMaxPrice(val) {
        this._maxPrice = val
        this.setPage(1)
    }
    setSort(val) {
        this._sort = val
        this.setPage(1)
    }
    setLoading(val) {
        this._loading = val
    }


    get types(){
        return this._types
    }
    get brands(){
        return this._brands
    }
    get cloths(){
        return this._cloths
    }
    get selectedType(){
        return this._selectedType
    }
    get selectedBrand(){
        return this._selectedBrand
    }
    get totalCount(){
        return this._totalCount
    }
    get limit(){
        return this._limit
    }
    get page(){
        return this._page
    }
    get minPrice(){
        return this._minPrice
    }
    get maxPrice(){
        return this._maxPrice
    }
    get sort(){
        return this._sort
    }
    get loading(){
        return this._loading
    }
}
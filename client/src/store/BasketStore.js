import { makeAutoObservable } from 'mobx';
import { fetchBasket, addToBasket, updateBasketItem, deleteBasketItem, clearBasket, applyPromo } from '../http/basketAPI';

export default class BasketStore {
    items = [];
    totalPrice = 0;
    loading = false;
    originalTotal = 0;
    discountPercent = 0;
    appliedPromoCode = null;

    constructor() {
        makeAutoObservable(this);
    }

    async loadBasket() {
        this.loading = true;
        try {
            const data = await fetchBasket();
            this.items = data.items.map(item => ({
                id: item.id,
                clothId: item.clothId,
                name: item.cloth.name,
                img: item.cloth.img,
                price: item.priceAtAdd,
                size: item.size,
                quantity: item.quantity,
            }));
            this.originalTotal = data.total;   
            this.totalPrice = data.total;      
        } catch (error) {
            console.error('Ошибка загрузки корзины', error);
        } finally {
            this.loading = false;
        }
    }

    async addItem(clothId, size, quantity = 1) {
        try {
            await addToBasket(clothId, size, quantity)
            await this.loadBasket()
        } catch (error) {
            console.error('Ошибка добавления', error)
        }
    }

    async updateQuantity(itemId, quantity) {
        try {
            await updateBasketItem(itemId, quantity)
            await this.loadBasket()
        } catch (error) {
            console.error('Ошибка обновления', error)
        }
    }

    async removeItem(itemId) {
        try {
            await deleteBasketItem(itemId)
            await this.loadBasket()
        } catch (error) {
            console.error('Ошибка удаления', error)
        }
    }

    async clear() {
        try {
            await clearBasket()
            await this.loadBasket()
        } catch (error) {
            console.error('Ошибка очистки', error)
        }
    }
    
    async applyPromo(code) {
        try {
            const totalAmount = this.originalTotal 
            const res = await applyPromo(code, totalAmount)
            if (res.discount !== undefined && res.finalAmount !== undefined) {
                this.discountPercent = (res.discount / totalAmount) * 100;
                this.totalPrice = res.finalAmount
                this.appliedPromoCode = code
                return true;
            }
            return false;
        } catch (e) {
            console.error('Ошибка промокода', e)
            return false
        }
    }

    _recalculateTotal() {
        let total = this.originalTotal
        if (this.discountPercent > 0) {
            this.totalPrice = this.originalTotal * (1 - this.discountPercent / 100)
        } else {
            this.totalPrice = this.originalTotal
        }
        if (this.appliedPromoCode && this.discountPercent > 0) {
            total = total * (1 - this.discountPercent / 100)
        }
        this.totalPrice = Math.round(total);
    }

}
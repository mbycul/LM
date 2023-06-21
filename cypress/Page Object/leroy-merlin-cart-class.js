class leroyMerlinCart {
    _ProceedToCheckoutButton = '.AddToCartModalActions_wrapper__6My3m > [aria-label="Przejdź do koszyka"] > .Button_ariaWrapper__Y2Idf';
    _CartWrapper = '.LayoutCartWrapper_wrapper__vEF9Z';    
    clickProceedToCheckoutButton() {
        return cy.get(this._ProceedToCheckoutButton).click();
    }
    checkCartWrapperVisibility() {
        return cy.get(this._CartWrapper).should('be.visible');
    }
} export default leroyMerlinCart
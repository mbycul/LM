/// <reference types="cypress"/>
import labels from "../fixtures/labels.json"
import leroyMerlinCart from "../Page Object/leroy-merlin-cart-class.js";
const leroyMerlinCartInstance = new leroyMerlinCart();

beforeEach('setup', () => {  
  cy.viewport(1280, 800) 
  cy.visit('/');
  cy.get('#onetrust-consent-sdk').invoke('css', 'display', 'none');
  cy.url().should('contain', 'leroymerlin').wait(2000);
  // cy.CloseCookieModal();  
  cy.fixture('labels').as('labels');  
})

Cypress.Commands.add('CloseCookieModal', () => {
  cy.get('#onetrust-accept-btn-handler').click().should('not.be.visible');
})

Cypress.Commands.add('GoToHammersListing', () => {
  cy.get('.HeaderTopBarSearchBar_input__YTgu9').click().type('Młotki');
    cy.get('.HeaderTopBarSearchBarNode_title__Qqn3W').contains('Młotki').click();
    cy.url().should('contain', '/narzedzia-reczne/mlotki-wkretaki/mlotki,a641.html');      
})

Cypress.Commands.add('AddToCartFromListing', () => {
  cy.GoToHammersListing();
  cy.get('.ListingFiltersItem_label__HE29V').contains('Wysyłka 24h').click();
  cy.get('[aria-label="Filtruj"] > .Button_ariaWrapper__Y2Idf').click().wait(2000);
  cy.get('[aria-label="Dodaj do koszyka"] > .Button_ariaWrapper__Y2Idf').first().click().wait(2000);
  cy.get('h2.AddToCartModalHeader_title__Fox1H').should('contain', 'Produkt dodany do koszyka');    
})

describe('Tests of Leroy Merlin webshop cart', () => {
  it('Search for the listing of hammers', () => {
    cy.GoToHammersListing();
  })

  it('Add product to the cart from the listing', () => {
    cy.AddToCartFromListing(); 
  })

  it('Check if the product name in the pre-cart matches the product name in the listing', () => {
    cy.AddToCartFromListing();    
    cy.get('.ProductListProductBlock_wrapper__uqfrW .ProductBlockName_link__fYuf1')
      .first()
      .invoke('text')
      .then(($listingProductName) => {
        cy.get('.AddToCartModalProductInfo_wrapper__GE7sC .AddToCartModalProductInfo_link__l45vW')
          .invoke('text')
          .should('contain', $listingProductName.trim());
      })
  })

  it('Check if the product price in the pre-cart matches the product price in the listing', () => {
    cy.AddToCartFromListing();    
    cy.get('.ProductListProductBlock_wrapper__uqfrW .ProductPrice_price__0Enwf')
      .first()
      .invoke('text')
      .then(($listingProductPrice) => {
        cy.get('.AddToCartModalProductInfo_wrapper__GE7sC .ProductPrice_price__0Enwf')
          .invoke('text')
          .should('contain', $listingProductPrice.trim());
      })
  })

  it('Close the pre-cart by clicking the Continue shopping button', () => {
    cy.AddToCartFromListing();
    cy.get('[aria-label="Kontynuuj zakupy"] > .Button_ariaWrapper__Y2Idf').click();
    cy.get('body').should('not.have.class', 'ReactModal__Body--open');
  })

  it('Proceed to checkout by clicking the Go to cart button in the pre-cart', () => {
    cy.AddToCartFromListing();
    leroyMerlinCartInstance.clickProceedToCheckoutButton();
    leroyMerlinCartInstance.checkCartWrapperVisibility();
  })

  it('Check if the product name in the cart matches the product name in the pre-cart', () => {
    cy.AddToCartFromListing();    
    cy.get('.AddToCartModalProductInfo_wrapper__GE7sC .AddToCartModalProductInfo_link__l45vW')
      .first()
      .invoke('text')
      .then(($precartProductName) => {
        leroyMerlinCartInstance.clickProceedToCheckoutButton();
        leroyMerlinCartInstance.checkCartWrapperVisibility();
        cy.get('.CartPreviewProductsProductBlockInfo_wrapper__W3qJM .CartPreviewProductsProductBlockInfo_title__KHiVZ')
          .invoke('text')
          .should('contain', $precartProductName.trim());
      })
  })

  it('Check if the product price in the cart matches the product price in the pre-cart', () => {
    cy.AddToCartFromListing();    
    cy.get('.AddToCartModalProductInfo_wrapper__GE7sC .ProductPrice_price__0Enwf')
      .first()
      .invoke('text')
      .then(($precartPrice) => {
        leroyMerlinCartInstance.clickProceedToCheckoutButton();
        leroyMerlinCartInstance.checkCartWrapperVisibility();
        cy.get('.CartPreviewProductsPriceBlock_wrapper__RMgkr span') 
          .invoke('text')
          .should('contain', $precartPrice.trim());
      })
  })

  it('Remove all items from the cart by clicking Delete the contents of the basket button', () => {
    cy.AddToCartFromListing();
    leroyMerlinCartInstance.clickProceedToCheckoutButton();
    leroyMerlinCartInstance.checkCartWrapperVisibility();
    cy.get('[aria-label="Usuń zawartość koszyka"] > .Button_ariaWrapper__Y2Idf').click().wait(2000);
    cy.get('.CartPreviewRemoveProductsModal_wrapper__deAfb').should('be.visible'); 
    cy.get('[aria-label="Tak, usuń produkty"] > .Button_ariaWrapper__Y2Idf').click().wait(2000);
    cy.get('.SectionHeader_title__VIP5X').contains(labels.cart[0].emptyCart).should('be.visible');
  })

  it('Abort removing all items from the cart by clicking Cancel button in the remove all products modal', () => {
    cy.AddToCartFromListing();
    leroyMerlinCartInstance.clickProceedToCheckoutButton();
    leroyMerlinCartInstance.checkCartWrapperVisibility();
    cy.get('[aria-label="Usuń zawartość koszyka"] > .Button_ariaWrapper__Y2Idf').click().wait(2000);
    cy.get('.CartPreviewRemoveProductsModal_wrapper__deAfb').should('be.visible'); 
    cy.get('[aria-label="Anuluj"] > .Button_ariaWrapper__Y2Idf').click().wait(2000);
    cy.get('.SectionHeader_title__VIP5X').contains(labels.cart[0].heading).should('be.visible');    
  })
})



class MobileNavBar {
    constructor(botao, menuList, menuLinks) {
        this.botao = document.querySelector(botao);
        this.menuList = document.querySelector(menuList);
        this.menuLinks = document.querySelectorAll(menuLinks);
        this.activeClass = "active";
        
        this.handleClick = this.handleClick.bind(this);
    }

    animateLinks() {
        this.menuLinks.forEach((link, index) => {
            link.style.animation
                ? (link.style.animation = "")
                : (link.style.animation = `navLinkFade 0.5s ease-in-out forwards ${index / 7 + 0.3}s`);
        });
    }

    handleClick() {
        if (this.menuList && this.botao) {
            this.menuList.classList.toggle(this.activeClass);
            this.botao.classList.toggle(this.activeClass);
            this.animateLinks();
        }
    }

    addClickEvent() {
        this.botao.addEventListener("click", this.handleClick);
    }

    init() {
        if (this.botao) {
            this.addClickEvent();
        }
        return this;
    }
}

// Inicialização
const mobileNavBar = new MobileNavBar(".botao", ".menu", ".menu li");
mobileNavBar.init();
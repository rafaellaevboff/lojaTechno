const vm = new Vue({

    el:"#app",
    data:{
        produtos: [],
        produto: false,
        carrinho: [],
        mensagemAlerta: "Item adicionado",
        alertaAtivo: false,
        carrinhoAtivo: false,
    },
    filters:{
        numeroPreco(valor) {
            return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL"})
        },
        maiusculo(valor) {
            return valor.toUpperCase();
        }
    },
    computed: {
        carrinhoTotal(){
            let total = 0;
            if(this.carrinho.length){
                this.carrinho.forEach(item =>{
                    total += item.preco
                    console.log(item);
                }) //ele recalcula sempre que o tamanho do carrinho for alterado, por isso o total de R$ no carrinho atualiza ao add e ao excluir
            }
            return total;
        }
    },
    methods:{
        fetchProdutos(){
            fetch("./api/produtos.json")
            .then(r => r.json())
            .then(r => {
                this.produtos = r;
            })
        },
        fetchProduto(id) {
            fetch(`./api/produtos/${id}/dados.json`)
            .then(r => r.json())
            .then(json => {
                this.produto = json
            })
        },
        abrirModal(id){
            this.fetchProduto(id)
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        },
        fecharModal({target, currentTarget}){
            // console.log(event.target); //é exatamente onde se é clicado
            // console.log(event.currentTarget); //é onde está o evento atribuido
            if(target === currentTarget) this.produto = false
        },
        clickForaCarrinho({target, currentTarget}){
            // console.log(event.target); //é exatamente onde se é clicado
            // console.log(event.currentTarget); //é onde está o evento atribuido
            if(target === currentTarget) this.carrinhoAtivo = false
        },
        adicionarItem(){
            this.produto.estoque--
            const {id, nome, preco} = this.produto
            // console.log(id, nome, preco);
            this.carrinho.push({id, nome, preco})
            this.alerta(`${nome} foi adicionado ao carrinho.`)
        },
        removerItem(index){
            this.carrinho.splice(index,1) //o index é onde o elemento q quer excluir está na lista do carrinho
        },
        checarLocalStorage(){
            if(window.localStorage.carrinho)
                this.carrinho = JSON.parse(window.localStorage.carrinho);
        },
        compararEstoque(){
            const items = this.carrinho.filter(({id}) => id === this.produto.id)
            this.produto.estoque -= items.length
            // console.log(items);
        },
        alerta(mensagem){
            this.mensagemAlerta = mensagem;
            this.alertaAtivo = true
            setTimeout(() => {
                this.alertaAtivo=false
            }, 1500);
        },
        router() {
            const hash = document.location.hash
            console.log(hash);
            if(hash){
                this.fetchProduto(hash.replace("#", ""))
            }
        },
    },
    watch:{
        carrinho(){
            window.localStorage.carrinho = JSON.stringify(this.carrinho)
        },
        produto(){
            document.title = this.produto.nome || "Techno"
            const hash = this.produto.id || ""
            history.pushState(null, null, `#${hash}`)
            if(this.produto){
                this.compararEstoque()
            }
        }
    },
    created(){
        this.fetchProdutos();
        this.router();
        this.checarLocalStorage();
    }
})
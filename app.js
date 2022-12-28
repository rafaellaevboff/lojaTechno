const vm = new Vue({

    el:"#app",
    data:{
        produtos: [],
        produto: false,
        carrinho: [],
        mensagemAlerta: "Item adicionado",
        alertaAtivo: false
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
        alerta(mensagem){
            this.mensagemAlerta = mensagem;
            this.alertaAtivo = true
            setTimeout(() => {
                this.alertaAtivo=false
            }, 1500);
        }
    },
    watch:{
        carrinho(){
            window.localStorage.carrinho = JSON.stringify(this.carrinho)
        }
    },
    created(){
        this.fetchProdutos()
        this.checarLocalStorage()
    }
})
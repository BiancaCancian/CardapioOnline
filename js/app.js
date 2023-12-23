$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];

var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;

var VALOR_ENTREGA = 5;

var CELULAR_EMPRESA ='5511988783162';

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoReserva();
        cardapio.metodos.carregarBotaoWhats();

    }

}

cardapio.metodos = {
    //obtem a lista de itens do carapio
    obterItensCardapio: (categoria = 'churrasco', vermais = false) => {

        var filtro = MENU[categoria];
        console.log(filtro);
        //arrumar depois
        if (!vermais) {
            $("#itensCardapio").html('');
            $("#btnVermais").removeClass('hidden'); // Corrigir o ID aqui

        }


        $.each(filtro, (i, e) => {


            let temp = cardapio.templates.item
                .replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)


            //botao ver mais foi clicado
            if (vermais && i >= 8 && i < 12) {

                $("#itensCardapio").append(temp)
            }

            //paginação inicial

            if (!vermais && i < 8) {
                $("#itensCardapio").append(temp)

            }

        })

        //remover ativo
        $(".container-menu a").removeClass('active');

        //menu para ativo
        $("#menu-" + categoria).addClass('active');
    },


    //clique no  botão de ver mais
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1]; //churrasco
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVermais").addClass('hidden');



    },


    //diminuir a quantidade de item no cardapio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }


    },

    //aumentar a quantidade de item no cardapio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)

    },

    //adicionar ao carrinho o item do cardapio
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {

            //obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //obtem a lista de itens

            let filtro = MENU[categoria];

            //metodo obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if (item.length > 0) {

                //validar se ja existe esse item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                //caso já exista no carrinho so altera a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }

                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }

                cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green')
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();


            }
        }

    },

    //atualiza o badge total dos botoes do carrinho
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {

            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden')

        }
        else {
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").addClass('hidden');

        }

        $(".badge-total-carrinho").html(total);
    },


    //abrir a modal de carrinho
    abrirCarrinho: (abrir) => {
        if (abrir) {
            $("#modal-carrinho").removeClass('hidden')
            cardapio.metodos.carregarCarrinho();
        }
        else {

            $("#modal-carrinho").addClass('hidden')

        }
    },

    //altera texto exibe botao etapas
    carregarEtapa: (etapa) => {

        if (etapa == 1) {

            $("#lbltituloEtapa").text('Seu carrinho');
            $("#itens-carriho").removeClass('hidden');
            $("#local-entrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa-1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnEtapaVoltar").addClass('hidden');
        }
        if (etapa == 2) {

            $("#lbltituloEtapa").text('Endereço de entrega:');
            $("#itens-carriho").addClass('hidden');
            $("#local-entrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa-1").addClass('active');
            $(".etapa-2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnEtapaVoltar").removeClass('hidden');

        }
        if (etapa == 3) {

            $("#lbltituloEtapa").text('Resumo do pedido:');
            $("#itens-carriho").addClass('hidden');
            $("#local-entrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa-1").addClass('active');
            $(".etapa-2").addClass('active');
            $(".etapa-3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnEtapaVoltar").removeClass('hidden');

        }

    },

    //botao de voltar etapa
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);
    },

    //carrega a lista de itens do carrinho
    carregarCarrinho: () => {

        cardapio.metodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {

            $("#itens-carriho").html('');

            $.each(MEU_CARRINHO, (i, e) => {


                let temp = cardapio.templates.itemCarrinho
                    .replace(/\${img}/g, e.img)
                    .replace(/\${name}/g, e.name)
                    .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                    .replace(/\${id}/g, e.id)
                    .replace(/\${qntd}/g, e.qntd)

                $("#itens-carriho").append(temp);

                // ultimo item do carrinho
                if ((i + 1) == MEU_CARRINHO.length) {
                    cardapio.metodos.carregarValores();
                }

            });



        }
        else {

            $("#itens-carriho").html('<p class="carrinho-vazio"><i class="fas fa-shopping-bag"></i>Seu carrinho está vazio</p>');
            cardapio.metodos.carregarValores();

        }


    },

    //diminuir quantidade carrinho
    diminuirQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        }

        else {
            cardapio.metodos.removerItemCarrinho(id)
        }


    },

    //aumentar quantidade carrinho
    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);


    },

    removerItemCarrinho: (id) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id });
        cardapio.metodos.carregarCarrinho();

        cardapio.metodos.atualizarBadgeTotal();

    },

    //atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (id, qntd) => {
        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        //atualiza o botao carrinho ocm a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();

        //atualiza os valores em reais totais do carrinho
        cardapio.metodos.carregarValores();
    },


    //carrega os valores de subtotal entrega e total
    carregarValores: () => {

        VALOR_CARRINHO = 0;

        $("#lblSubtotal").text('R$0,00');
        $("#lblValorEntrega").text('+R$0,00');
        $("#lblValorTotal").text('R$0,00');

        $.each(MEU_CARRINHO, (i, e) => {

            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if ((i + 1) == MEU_CARRINHO.length) {

                $("#lblSubtotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')} `);

            }

        })

    },

    //carregar a etapa endereço
    //verificar se o carrinho está vazio
    carregarEndereco: () => {

        if (MEU_CARRINHO.length <= 0) {
            cardapio.metodos.mensagem('Seu carrinho está vazio.')
            return;
        }

        cardapio.metodos.carregarEtapa(2);

    },

    //buscar cep
    buscarCep: () => {
        //cria a variavel com o valor do cep
        var cep = $("#txt-cep").val().trim().replace(/\D/g, '');

        //verifica se o cep possui valor informado
        if (cep != "") {


            //expressao regular para validar cep
            var validacep = /^[0-9]{8}$/;

            if (validacep.test(cep)) {

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {

                    if (!("erro" in dados)) {

                        // atualizar os campos com os valores retornados

                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUF").val(dados.uf);
                        $("#txtNúmero").focus();

                    }
                    else {
                        cardapio.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente.');
                        $("#txtEndereco").focus();
                    }
                });

            }

            else {

                cardapio.metodos.mensagem('Formato do CEP invalido.')
                $("#txt-cep").focus();

            }
        }


        else {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txt-cep").focus();
        }

    },

    //validação antes de prosseguir para a etapa 3
    resumoPedido: () => {

        let cep = $("#txt-cep").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUF").val().trim();
        let numero = $("#txtNúmero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        if (cep.length <= 0) {
            cardapio.metodos.mensagem('Informe o CEP por favor!')
            $("#txt-cep").focus();
            return;
        }

        if (endereco.length <= 0) {
            cardapio.metodos.mensagem('Informe o endereço por favor!')
            $("#txtEndereco").focus();
            return;
        }

        if (bairro.length <= 0) {
            cardapio.metodos.mensagem('Informe o bairro por favor!')
            $("#txtBairro").focus();
            return;
        }

        if (cidade.length <= 0) {
            cardapio.metodos.mensagem('Informe a cidade por favor!')
            $("#txtCidade").focus();
            return;
        }

        if (uf == -1) {
            cardapio.metodos.mensagem('Informe a UF por favor!')
            $("#ddlUF").focus();
            return;
        }

        if (numero.length <= 0) {
            cardapio.metodos.mensagem('Informe o número por favor!')
            $("#txtNúmero").focus();
            return;

        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento

        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();

    },

    //carrega a etapa de resumo do pedido
    carregarResumo: () => {

       $("#listaItensResumo").html('');

       $.each(MEU_CARRINHO, (i, e) => {

        
        let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
        .replace(/\${name}/g, e.name)
        .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
        .replace(/\${qntd}/g, e.qntd)

        $("#listaItensResumo").append(temp);

       });

       $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero},${MEU_ENDERECO.bairro}`);
       $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);

       cardapio.metodos.finalizarPedido();

    },

    //atualiza o link do botao do whats
    finalizarPedido: () =>{

        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null ){
            var texto = 'Olá gostaria de fazer um pedido: ';
            texto += `\n*Itens do pedido:*\n\n\${itens}`;
            texto += '\n*Endereço de entrega: *';
            texto += `\n${MEU_ENDERECO.endereco},${MEU_ENDERECO.numero},${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\n"Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}"`;

            var itens = '';

            $.each(MEU_CARRINHO, (i, e) => {

              //retirar entrega dps
              itens += `*${e.qntd}x* ${e.name} ....... R$ ${e.price.toFixed(2).replace('.', ',')} \n`;

                if ((i + 1) == MEU_CARRINHO.length) {

                    texto = texto.replace(/\${itens}/g, itens);

                   // converte a url
                   let encode = encodeURI(texto);
                   let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

                   $("#btnEtapaResumo").attr('href', URL);
                }
            })

        }

    },
    
    //carrega o link do botão reserva
    carregarBotaoReserva: () => {

        var texto = 'Olá gostaria de fazer uma *reserva*';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btn-reserva").attr('href', URL)

    },

    carregarBotaoWhats: () => {

        var texto = '';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btn-whats").attr('href', URL)

    },

 










    //mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class=" animated fadeInDown toast ${cor}">${texto}</div>`;
        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown ');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {

            }, 800)
        }, tempo)

    }

}

cardapio.templates = {


    item: `
  <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeInUp">
  <div class="card card-item" id=\${id}> 
      <div class="img-produto">
          <img src="\${img}" />
      </div>
      <p class="title-produto text-center mt-4">
          <b>\${name}</b>
      </p>
      <p class="price-produto text-center">
          <b>R$\${price}</b>
      </p>
      <div class="add-carrinho">
          <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
          <span class="add-numero-itens" id= "qntd-\${id}">0</span>
          <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
          <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
      </div>
  </div>
</div>
 `,

    itemCarrinho: `
 <div class="col-12 item-carrinho ">
                    <div class="img-produto">
                        <img src="\${img}">
                    </div>

                    <div class="dados-produto">
                        <p class="title-produto"><b>\${name}</b></p>
                        <p class="price-produto"><b>R$\${price}</b></p>
                    </div>

                    <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fas fa-times"></i></span>
                    </div>
                </div>
                  `,
    itemResumo: `
    
    <div class="col-12 item-carrinho resumo">
    <div class="img-produto-resumo">
        <img src="\${img}">
    </div>
    <div class="dados-produto">
        <p class="title-produto-resumo">
            <b>\${name}</b>
        </p>
        <p class="price-produto-resumo">
            <b>R$\${price}</b>
        </p>

    </div>
       <p class="quantidade-produto-resumo">
        x <b>\${qntd}</b>
       </p>
   </div>
   `
};
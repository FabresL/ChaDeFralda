// Configuração do Supabase
const supabaseUrl = "https://xfnalomnwctodwbioehx.supabase.co";
const supabaseKey = "sb_publishable_6hIPmpTILgHDUTYQ1_l2dQ_YYx3yqTt";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);


const inputNome = document.querySelector("#btn-name");
const botaoConfirmar = document.querySelector("#btn-confirmar");
//querySelector procura no HTML o valor que você deseja


botaoConfirmar.addEventListener("click", async function() { //ao clicar, irá adicionar a função

    const nome = inputNome.value
        .trim() //nome será adicionado devido a primeira const inputNome; o trim serve para apagar os espaços do fim
        .toLowerCase() //deixar em texto minúsculo
        .split(" ") //separa o texto formando strings
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1)) //para cada palavra, a primeira letra (charAt - pega um caractere), slice (pega o resto da composição)
        .join(" "); //transforma o Array novamente em uma string

    if (nome === "") {
        alert("Você precisa preencher o nome");
        return;
    }


    const { error } = await supabaseClient
        .from("Convidados")
        .insert({
            name: nome
        });


    if (error) {

        if (error.code === "23505" || error.status === 409) {
            alert("Este nome já está no formulário.");

            //guarda o nome mesmo que ele já esteja cadastrado
            localStorage.setItem("nomeConvidado", nome);

        } else {
            console.error("Erro ao confirmar presença:", error);
            alert("Ocorreu um erro ao confirmar. Tente novamente.");
        }

        return;
    }


    //guarda o nome para utilizar no recado
    localStorage.setItem("nomeConvidado", nome);

    alert("Presença confirmada com sucesso! Obrigado!");

    inputNome.value = ""; //esvazia o nome
});


// ==============================
// RECADOS PARA A ISABEL
// ==============================

const textareaRecado = document.getElementById("recado");
const botaoRecado = document.querySelector(".recados input[type='button']");


botaoRecado.addEventListener("click", async function() {

    //pega o nome que foi confirmado anteriormente
    let nome = localStorage.getItem("nomeConvidado");

    //caso ainda não tenha nome salvo, pega o nome digitado no campo
    if (!nome) {
        nome = inputNome.value.trim();
    }


    const recado = textareaRecado.value.trim();


    if (nome === "") {
        alert("Digite seu nome antes de enviar o recado.");
        return;
    }


    if (recado === "") {
        alert("Digite um recado para a Isabel.");
        return;
    }


    if (recado.length > 120) {
        alert("O recado pode ter no máximo 120 caracteres.");
        return;
    }


    const { error } = await supabaseClient
        .from("Recados")
        .insert({
            nome: nome,
            recado: recado
        });


    if (error) {

        console.error("Erro completo ao enviar recado:", error);
        console.error("Código:", error.code);
        console.error("Mensagem:", error.message);
        console.error("Detalhes:", error.details);
        console.error("Hint:", error.hint);

        alert("Ocorreu um erro ao enviar o recado. Tente novamente.");

        return;
    }


    alert("Recado enviado com sucesso!");

    textareaRecado.value = "";

});


const contador = document.getElementById("contador");

if (textareaRecado && contador) {

    textareaRecado.addEventListener("input", function() {

        contador.textContent = this.value.length + " / 120"; //limita o recado para até 120 caracteres

    });

}